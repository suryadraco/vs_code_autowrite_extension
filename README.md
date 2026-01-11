# Human Writer
A VS Code extension that simulates human-like typing when copying folder structures to a target location.

## Demo
<video src="./demo.mp4" controls width="600"></video>


*Watch the extension in action as it types out code character-by-character with human-like delays*

## Features
- **Human-like Typing**: Writes code character-by-character with realistic typing speeds and random delays
- **Recursive Folder Copy**: Automatically scans and recreates entire folder structures
- **All File Types**: Supports any file type (.js, .html, .css, .py, .c, .java, etc.)
- **Sequential Processing**: Writes files one at a time to avoid conflicts
- **Visual Feedback**: Shows progress as files are being written

## Usage
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette
2. Type "Human Write Folder To..." and select the command
3. Select the **SOURCE** folder containing the code files you want to copy
4. Select the **TARGET** folder where you want the files to be written
5. Watch as the extension recreates the folder structure and types out each file character-by-character!

![Demo Animation](demo.gif)

## How It Works
1. The extension scans the source folder recursively
2. Creates the same folder structure in the target location
3. Opens each file in VS Code
4. Types the content character-by-character with:
   - Variable typing speeds (50-200ms per character)
   - Longer delays for special characters
   - Occasional pauses to simulate thinking/reading
   - Faster typing for common characters

## Requirements
- VS Code version 1.74.0 or higher

## Installation

### Quick Start (For Testing)
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile the extension:**
   ```bash
   npm run compile
   ```

3. **Run in VS Code:**
   - Open this folder in VS Code
   - Press `F5` to launch Extension Development Host
   - In the new window, use `Ctrl+Shift+P` → "Human Write Folder To..."

### Full Installation Guide
For detailed setup instructions, see **[SETUP.md](SETUP.md)** - Complete step-by-step guide with troubleshooting.

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes (auto-recompile)
npm run watch
```

### Project Structure
- `src/extension.ts` - Main extension code
- `package.json` - Extension manifest and dependencies
- `tsconfig.json` - TypeScript configuration
- `out/` - Compiled JavaScript (generated after compilation)
- `demo.mp4` - Demo video showing the extension in action

### Building and Testing
1. Make changes to `src/extension.ts`
2. Compile: `npm run compile`
3. Test: Press `F5` in VS Code to launch Extension Development Host
4. Debug: Set breakpoints in TypeScript files (VS Code will map them automatically)

### Packaging for Distribution
```bash
# Install vsce globally
npm install -g @vscode/vsce

# Package the extension
vsce package

# Install the .vsix file in VS Code
# Extensions → ... → Install from VSIX...
```

## License
MIT

