import { App, Plugin, PluginSettingTab, Setting, TFile, moment, Notice, Editor, MarkdownView } from 'obsidian';

interface CheckboxBulkDateSettings {
	enableRealTimeAdding: boolean;
	useFileCreationDate: boolean;
}

const DEFAULT_SETTINGS: CheckboxBulkDateSettings = {
	enableRealTimeAdding: true,
	useFileCreationDate: true
}

const CREATED = "➕";

export default class CheckboxBulkDatePlugin extends Plugin {
	settings: CheckboxBulkDateSettings;

	async onload() {
		await this.loadSettings();

		// Command 1: Add missing created dates to current file
		this.addCommand({
			id: 'add-created-file',
			name: 'Add missing created dates (file)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = editor.getValue();
				const newContent = this.addCreatedToText(content, view.file);
				const addedCount = this.countAddedDates(content, newContent);
				
				if (addedCount > 0) {
					editor.setValue(newContent);
					new Notice(`Added ${addedCount} created date${addedCount > 1 ? 's' : ''} to current file`);
					console.log(`Added ${addedCount} created dates to current file`);
				} else {
					new Notice('No unchecked checkboxes without created dates found');
				}
			}
		});

		// Command 2: Add missing created dates to entire vault
		this.addCommand({
			id: 'add-created-vault',
			name: 'Add missing created dates (vault)',
			callback: async () => {
				const files = this.app.vault.getMarkdownFiles();
				let totalCount = 0;
				
				for (const file of files) {
					const count = await this.fixFile(file);
					totalCount += count;
				}
				
				new Notice(`Added ${totalCount} created date${totalCount > 1 ? 's' : ''} across vault`);
				console.log(`Added ${totalCount} created dates across vault`);
			}
		});

		// Always register the real-time watcher (it checks the setting internally)
		this.enableRealTimeAdding();

		// Add settings tab
		this.addSettingTab(new CheckboxBulkDateSettingTab(this.app, this));
	}

	enableRealTimeAdding() {
		// Ensure we only register once
		this.registerEvent(
			this.app.workspace.on(
				"editor-change",
				(editor: Editor) => {
					if (!this.settings.enableRealTimeAdding) return;

					// Cursor after the Enter press sits on the NEW empty line,
					// so the task we just finished is on the line above.
					const cursor = editor.getCursor();
					const prevLineNo = cursor.line - 1;
					if (prevLineNo < 0) return;

					const prevText = editor.getLine(prevLineNo);

					// 1️⃣ Is it an unchecked task?
					if (!/^\s*[-*+]\s+\[ \]/.test(prevText)) return;

					// 2️⃣ Already stamped?
					if (/➕ \d{4}-\d{2}-\d{2}/.test(prevText)) return;

					// 3️⃣ Append created date
					const dateStr = moment().format("YYYY-MM-DD");
					const insertion = ` ${CREATED} ${dateStr}`;

					editor.transaction({
						changes: [{
							from: { line: prevLineNo, ch: prevText.length },
							to:   { line: prevLineNo, ch: prevText.length },
							text: insertion
						}]
					});
				}
			)
		);
	}

	// Helper method to fix a single file
	private async fixFile(file: TFile): Promise<number> {
		const text = await this.app.vault.read(file);
		const newText = this.addCreatedToText(text, file);
		const addedCount = this.countAddedDates(text, newText);
		
		if (addedCount > 0) {
			await this.app.vault.modify(file, newText);
		}
		
		return addedCount;
	}

	// Helper method to add created dates to text
	private addCreatedToText(text: string, file: TFile | null = null): string {
		const dateToUse = this.getDateForFile(file);
		
		console.log('Processing text for created dates...');
		console.log('Original text:', text);
		console.log('Date to use:', dateToUse);
		
		const result = text.replace(
			/^(\s*[-*+]\s+\[ \])\s+(?!.*➕\s*\d{4}-\d{2}-\d{2})(.*)$/gm,
			(match, taskPrefix, rest) => {
				console.log('Found matching line:', match);
				console.log('Task prefix:', taskPrefix);
				console.log('Rest:', rest);
				const replacement = `${taskPrefix} ${rest} ${CREATED} ${dateToUse}`;
				console.log('Replacement:', replacement);
				return replacement;
			}
		);
		
		console.log('Result text:', result);
		return result;
	}

	// Helper method to get the appropriate date for a file
	private getDateForFile(file: TFile | null): string {
		if (!file) {
			return moment().format("YYYY-MM-DD");
		}

		if (this.settings.useFileCreationDate) {
			return moment(file.stat.ctime).format("YYYY-MM-DD");
		} else {
			return moment(file.stat.mtime).format("YYYY-MM-DD");
		}
	}

	// Helper method to count how many dates were added
	private countAddedDates(oldText: string, newText: string): number {
		const oldMatches = oldText.match(/➕ \d{4}-\d{2}-\d{2}/g) || [];
		const newMatches = newText.match(/➕ \d{4}-\d{2}-\d{2}/g) || [];
		
		console.log('Old matches count:', oldMatches.length);
		console.log('New matches count:', newMatches.length);
		console.log('Difference:', newMatches.length - oldMatches.length);
		
		return newMatches.length - oldMatches.length;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CheckboxBulkDateSettingTab extends PluginSettingTab {
	plugin: CheckboxBulkDatePlugin;

	constructor(app: App, plugin: CheckboxBulkDatePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Checkbox Bulk Creation Date Settings' });

		new Setting(containerEl)
			.setName('Enable real-time adding')
			.setDesc('Automatically add created dates when creating new checkboxes')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableRealTimeAdding)
				.onChange(async (value) => {
					this.plugin.settings.enableRealTimeAdding = value;
					await this.plugin.saveSettings();
					console.log('Real-time adding setting changed to:', value);
				}));

		new Setting(containerEl)
			.setName('Date source')
			.setDesc('Choose whether to use file creation date or file modified date for retroactive adding')
			.addDropdown(dropdown => dropdown
				.addOption('creation', 'File creation date')
				.addOption('modified', 'File modified date')
				.setValue(this.plugin.settings.useFileCreationDate ? 'creation' : 'modified')
				.onChange(async (value) => {
					this.plugin.settings.useFileCreationDate = (value === 'creation');
					await this.plugin.saveSettings();
				}));
	}
}
