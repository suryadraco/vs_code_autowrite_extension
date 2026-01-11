# Complete Setup Guide - Human Writer Extension

This guide will walk you through setting up, developing, testing, and packaging the Human Writer VS Code extension.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Testing the Extension](#testing-the-extension)
5. [Packaging for Distribution](#packaging-for-distribution)
6. [Troubleshooting](#troubleshooting)
7. [Project Structure](#project-structure)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (version 16.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Visual Studio Code** (version 1.74.0 or higher)
   - Download from: https://code.visualstudio.com/
   - Verify installation:
     ```bash
     code --version
     ```

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### Optional Tools

- **vsce** (Visual Studio Code Extension manager) - for packaging
  ```bash
  npm install -g @vscode/vsce
  ```

---

## Initial Setup

### Step 1: Open the Project

1. Open VS Code
2. Click **File → Open Folder...**
3. Navigate to the project directory (`E:\javaScript_lab\project`)
4. Click **Select Folder**

### Step 2: Install Dependencies

Open the integrated terminal in VS Code:
- Press `` Ctrl+` `` (backtick) or
- Go to **Terminal → New Terminal**

Run the following command:

```bash
npm install
```

This will install:
- `@types/node` - TypeScript definitions for Node.js
- `@types/vscode` - TypeScript definitions for VS Code API
- `typescript` - TypeScript compiler

**Expected output:**
```
added 3 packages, and audited 4 packages in Xs
```

### Step 3: Compile TypeScript

Compile the TypeScript source code to JavaScript:

```bash
npm run compile
```

**Expected output:**
```
> human-writer@0.0.1 compile
> tsc -p ./
```

This creates the `out/` directory with compiled JavaScript files.

**Note:** If you see any errors, check the [Troubleshooting](#troubleshooting) section.

### Step 4: Verify Setup

Check that the following files/directories exist:

```
project/
├── src/
│   └── extension.ts          ✓ Source code
├── out/
│   └── extension.js          ✓ Compiled code (after npm run compile)
├── package.json              ✓ Extension manifest
├── tsconfig.json             ✓ TypeScript config
└── node_modules/             ✓ Dependencies (after npm install)
```

---

## Development Workflow

### Watch Mode (Auto-compilation)

For active development, use watch mode to automatically recompile on file changes:

```bash
npm run watch
```

This will:
- Compile TypeScript files automatically when you save
- Show compilation errors in real-time
- Keep running until you stop it (Ctrl+C)

**Recommended workflow:**
1. Open a terminal and run `npm run watch`
2. Make changes to `src/extension.ts`
3. Save the file
4. The extension will auto-compile
5. Press `F5` to reload the Extension Development Host

### Manual Compilation

If you prefer manual compilation:

```bash
npm run compile
```

Run this after each change to `src/extension.ts`.

---

## Testing the Extension

### Method 1: Extension Development Host (Recommended)

1. **Open the project in VS Code** (if not already open)

2. **Press `F5`** or:
   - Go to **Run → Start Debugging**
   - Or click the **Run and Debug** icon in the sidebar

3. **A new VS Code window will open** - this is the "Extension Development Host"

4. **In the new window:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Human Write Folder To...`
   - Select the command

5. **Follow the prompts:**
   - Select the **SOURCE** folder (containing files to copy)
   - Select the **TARGET** folder (where files will be written)
   - Watch the extension work!

6. **To stop debugging:**
   - Close the Extension Development Host window
   - Or press `Shift+F5` in the original VS Code window

### Method 2: Using the Debug Console

1. Set breakpoints in `src/extension.ts` by clicking in the gutter (left of line numbers)

2. Press `F5` to start debugging

3. Execute the command in the Extension Development Host

4. The debugger will pause at breakpoints

5. Use the Debug Console to inspect variables and step through code

### Testing Checklist

- [ ] Extension command appears in Command Palette
- [ ] Source folder selection dialog works
- [ ] Target folder selection dialog works
- [ ] Folder structure is recreated correctly
- [ ] Files are typed character-by-character
- [ ] Typing speed feels human-like (not instant)
- [ ] Progress indicator shows correctly
- [ ] All file types are supported
- [ ] Files are processed sequentially

---

## Packaging for Distribution

### Step 1: Install vsce (if not already installed)

```bash
npm install -g @vscode/vsce
```

### Step 2: Prepare for Packaging

Ensure your code is compiled:

```bash
npm run compile
```

### Step 3: Package the Extension

```bash
vsce package
```

This will:
- Compile TypeScript (via `vscode:prepublish` script)
- Create a `.vsix` file (e.g., `human-writer-0.0.1.vsix`)

**Expected output:**
```
DONE  Packaged: human-writer-0.0.1.vsix (XXX files, XXX.XX KB)
```

### Step 4: Install the Packaged Extension

1. Open VS Code
2. Go to **Extensions** (Ctrl+Shift+X)
3. Click the **...** menu (top right)
4. Select **Install from VSIX...**
5. Choose the `.vsix` file
6. The extension will be installed

### Step 5: Verify Installation

1. Go to **Extensions** view
2. Search for "Human Writer"
3. You should see it listed as installed
4. Test the command: `Ctrl+Shift+P` → "Human Write Folder To..."

---

## Troubleshooting

### Issue: "Cannot find module 'vscode'"

**Solution:**
```bash
npm install
npm run compile
```

The `@types/vscode` package provides the type definitions.

### Issue: "Cannot find module 'fs' or 'path'"

**Solution:**
```bash
npm install
```

These are Node.js built-in modules. The `@types/node` package provides their types.

### Issue: TypeScript compilation errors

**Check:**
1. Is `tsconfig.json` present and valid?
2. Are dependencies installed? (`npm install`)
3. Is TypeScript installed? (`npm list typescript`)

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run compile
```

### Issue: Extension doesn't appear in Command Palette

**Check:**
1. Is the extension compiled? (`npm run compile`)
2. Did you restart the Extension Development Host?
3. Is `package.json` valid?

**Solution:**
1. Recompile: `npm run compile`
2. Restart Extension Development Host (close and press F5 again)
3. Check `package.json` for the command registration

### Issue: "Command not found" when running vsce

**Solution:**
```bash
npm install -g @vscode/vsce
```

Make sure npm global bin directory is in your PATH.

### Issue: Files not typing character-by-character

**Possible causes:**
- File is too large (typing might be too slow)
- VS Code is throttling edits

**Solution:**
- Test with smaller files first
- Check browser console in Extension Development Host (Help → Toggle Developer Tools)

### Issue: Extension Development Host doesn't open

**Check:**
1. Are there compilation errors? Check the terminal
2. Is `out/extension.js` present?

**Solution:**
```bash
npm run compile
# Check for errors in terminal
# Then try F5 again
```

### Issue: Folder selection dialogs don't appear

**Check:**
- Are you running in Extension Development Host (not the main VS Code window)?
- Check the Output panel: View → Output → Select "Log (Extension Host)"

---

## Project Structure

```
project/
├── .gitignore                 # Git ignore rules
├── .vscodeignore             # Files excluded from packaging
├── package.json              # Extension manifest and dependencies
├── tsconfig.json             # TypeScript configuration
├── README.md                 # User documentation
├── SETUP.md                  # This file
│
├── src/                      # Source code
│   └── extension.ts          # Main extension logic
│
├── out/                      # Compiled output (generated)
│   └── extension.js          # Compiled JavaScript
│
└── node_modules/             # Dependencies (generated)
    ├── @types/
    │   ├── node/
    │   └── vscode/
    └── typescript/
```

### Key Files Explained

- **`package.json`**: Defines the extension, its commands, dependencies, and build scripts
- **`tsconfig.json`**: TypeScript compiler configuration
- **`src/extension.ts`**: Main extension code with all functionality
- **`out/extension.js`**: Compiled JavaScript (don't edit directly)

---

## Next Steps

1. ✅ Complete initial setup
2. ✅ Test the extension
3. ✅ Make any customizations you need
4. ✅ Package and distribute (optional)

## Additional Resources

- [VS Code Extension API Documentation](https://code.visualstudio.com/api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [VS Code Extension Development Guide](https://code.visualstudio.com/api/get-started/your-first-extension)

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Compile once
npm run compile

# Watch mode (auto-compile)
npm run watch

# Package extension
vsce package

# Run extension (in VS Code)
# Press F5
```

---

**Happy coding! 🚀**
