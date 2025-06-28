# Checkbox Bulk Creation Date

This plugin adds a creation date to each unchecked checkbox in an Obsidian file or vault, either retroactively
on-command, or as soon as you hit enter after a checklist item.
The creation date is compatible with the [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin.

This project uses TypeScript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in TypeScript Definition format, which contains
TSDoc comments describing what it does.

## Features

### Commands

For retroactive adding, the plugin creates two commands:

- **Add missing created dates (file)** - adds the creation date to all unchecked checkboxes in the current file
- **Add missing created dates (vault)** - adds the creation date to all unchecked checkboxes in the
  current vault

### Real-time adding

For real-time adding, the plugin uses an editor-change event listener that detects when you press Enter after
creating a checkbox. It checks the previous line to see if it contains an unchecked checkbox without a creation
date, and if so, automatically adds the date.

The plugin logs the number of creation dates added to the console and shows a toast notification with the count.

### Settings

The plugin has the following settings:

1. **Enable/disable real-time adding** - Toggle automatic date addition when creating checkboxes
2. **Date source for retroactive adding** - Choose between file creation date or file modified date
   (defaults to file creation date)

## Usage

### Retroactive Adding

1. Open the Command Palette (Ctrl/Cmd + P)
2. Run either:
   - **"Add missing created dates (file)"** - adds dates to all unchecked checkboxes in the current file
   - **"Add missing created dates (vault)"** - adds dates to all unchecked checkboxes in your entire vault

### Real-time Adding

When enabled in settings, the plugin automatically adds creation dates when you:

1. Type a checkbox (`- [ ]`, `* [ ]`, or `+ [ ]`)
2. Press Enter to move to the next line

The plugin detects the checkbox on the previous line and automatically appends `➕ YYYY-MM-DD` to it.

**Supported formats:**

- `- [ ]` (dash)
- `* [ ]` (asterisk)
- `+ [ ]` (plus)
- All formats work with any level of indentation for nested tasks

### Date Format

The plugin uses the Tasks plugin compatible format: `➕ YYYY-MM-DD`

**Date sources:**

- **Real-time adding**: Uses current date
- **Retroactive adding**: Uses file creation date or file modification date (configurable in settings)

**Examples:**

```markdown
- [ ] Buy groceries ➕ 2024-01-15
  - [ ] Get milk ➕ 2024-01-15
    * [ ] Check expiration date ➕ 2024-01-15
+ [ ] Call dentist ➕ 2024-01-15
```

## First time developing plugins?

Quick starting guide for new plugin devs:

- Check if [someone already developed a plugin for what you want](https://obsidian.md/plugins)! There might be an
  existing plugin similar enough that you can partner up with.
- Make a copy of this repo as a template with the "Use this template" button (login to GitHub if you don't
  see it).
- Clone your repo to a local development folder. For convenience, you can place this folder in your
  `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into
  `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version
  required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of
  Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number,
  don't include a prefix `v`. See here for an example: <https://github.com/obsidianmd/obsidian-sample-plugin/releases>
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file
  must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or
> `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at <https://github.com/obsidianmd/obsidian-releases> to add your plugin.

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)

- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint
  against your plugin to find common bugs and ways to improve your code.
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See <https://github.com/obsidianmd/obsidian-api>
