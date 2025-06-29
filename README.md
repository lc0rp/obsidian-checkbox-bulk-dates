# Checkbox Bulk Dates

This [obsidian](https://obsidian.md) plugin adds a creation date to each unchecked checkbox in an Obsidian file or vault,
either retroactively on-command, or as soon as you hit enter after a checklist item.
The creation date is compatible with the [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin.

## Why?

The [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin has a feature where it automatically
adds a creation date to each created task.
However, this feature is only available when you create the tasks using the modal provided by the plugin.

This plugin adds the creation date to all checklist items retroactively,
or as soon as you hit enter after creating a checklist item.

This makes it easier to use the Tasks plugin queries with the creation date.

## Installation

Until this plugin is published to the Obsidian community, you can install it by using
 the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin.

- Install the BRAT plugin if you haven't already.
- Open the BRAT settings and add the following URL to the "Beta Plugin List", and click "Add Beta Plugin"

```text
https://github.com/lc0rp/obsidian-checkbox-bulk-dates
```

## Features

### Commands

For retroactive adding, the plugin creates two commands:

- **Add missing creation dates (file)** - adds the creation date to all unchecked checkboxes in the current file
- **Add missing creation dates (vault)** - adds the creation date to all unchecked checkboxes in the
  current vault

### Real-time adding

For real-time adding, the plugin detects when you press Enter after
creating a checkbox. It checks the added line to see if it contains an unchecked checkbox without a creation
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
   - **"Add missing creation dates (file)"** - adds dates to all unchecked checkboxes in the current file
   - **"Add missing creation dates (vault)"** - adds dates to all unchecked checkboxes in your entire vault

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
