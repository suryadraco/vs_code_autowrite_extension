import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('humanWriter.writeFolder', async () => {
        try {
            // Step 1: Ask user to select source folder
            const sourceUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Source Folder'
            });

            if (!sourceUri || sourceUri.length === 0) {
                vscode.window.showInformationMessage('Source folder selection cancelled.');
                return;
            }

            const sourcePath = sourceUri[0].fsPath;

            // Step 2: Ask user to select target folder
            const targetUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Target Folder'
            });

            if (!targetUri || targetUri.length === 0) {
                vscode.window.showInformationMessage('Target folder selection cancelled.');
                return;
            }

            const targetPath = targetUri[0].fsPath;

            // Validate that target is not inside source
            if (targetPath.startsWith(sourcePath)) {
                vscode.window.showErrorMessage('Target folder cannot be inside source folder!');
                return;
            }

            // Show progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Human Writer",
                cancellable: false
            }, async (progress: vscode.Progress<{ message?: string; increment?: number }>) => {
                progress.report({ increment: 0, message: "Scanning source folder..." });

                // Step 3: Recursively scan source folder
                const files = scanDirectory(sourcePath, sourcePath);
                
                progress.report({ increment: 20, message: `Found ${files.length} files. Creating structure...` });

                // Step 4 & 5: Recreate folder structure and create files
                for (const file of files) {
                    const relativePath = path.relative(sourcePath, file);
                    const targetFile = path.join(targetPath, relativePath);
                    const targetDir = path.dirname(targetFile);

                    // Create directory structure
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }

                    // Create empty file
                    fs.writeFileSync(targetFile, '');
                }

                progress.report({ increment: 40, message: "Structure created. Writing files..." });

                // Step 6 & 7: Open and write each file character-by-character
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const relativePath = path.relative(sourcePath, file);
                    const targetFile = path.join(targetPath, relativePath);

                    progress.report({
                        increment: 40 + (i / files.length) * 50,
                        message: `Writing ${path.basename(targetFile)} (${i + 1}/${files.length})...`
                    });

                    // Read source file content
                    const content = fs.readFileSync(file, 'utf8');

                    // Open file in VS Code
                    const document = await vscode.workspace.openTextDocument(targetFile);
                    const editor = await vscode.window.showTextDocument(document);

                    // Step 8 & 9: Write character-by-character with random delays
                    await typeContent(editor, content);

                    // Save the file
                    await document.save();
                }

                progress.report({ increment: 100, message: "Complete!" });
            });

            vscode.window.showInformationMessage(`Successfully wrote ${sourcePath} to ${targetPath} with human-like typing!`);

        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * Recursively scan a directory and return all file paths
 */
function scanDirectory(dir: string, rootDir: string): string[] {
    const files: string[] = [];
    
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                files.push(...scanDirectory(fullPath, rootDir));
            } else if (entry.isFile()) {
                // Add file to list
                files.push(fullPath);
            }
        }
    } catch (error) {
        // Error scanning directory - skip it
    }
    
    return files;
}

/**
 * Type content character-by-character with human-like delays
 */
async function typeContent(editor: vscode.TextEditor, content: string): Promise<void> {
    const document = editor.document;
    
    // Clear any existing content
    const clearEdit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
    );
    clearEdit.delete(document.uri, fullRange);
    await vscode.workspace.applyEdit(clearEdit);
    
    // Wait a bit for the document to update
    await sleep(100);
    
    let typedContent = '';
    
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        typedContent += char;
        
        // Replace entire document with current typed content
        const edit = new vscode.WorkspaceEdit();
        const currentDoc = vscode.window.activeTextEditor?.document || document;
        const currentText = currentDoc.getText();
        
        if (currentText !== typedContent) {
            const range = new vscode.Range(
                currentDoc.positionAt(0),
                currentDoc.positionAt(currentText.length)
            );
            edit.replace(currentDoc.uri, range, typedContent);
            await vscode.workspace.applyEdit(edit);
        }
        
        // Random delay to simulate human typing
        // Typing speed varies: 50-200ms per character (average ~100ms)
        // Faster for common characters, slower for special characters
        let delay = getTypingDelay(char);
        
        await sleep(delay);
    }
}

/**
 * Get typing delay based on character type to simulate realistic typing
 */
function getTypingDelay(char: string): number {
    // Base delay in milliseconds
    let baseDelay = 50;
    
    // Adjust delay based on character type
    if (char === '\n') {
        // Newlines take a bit longer (thinking about next line)
        baseDelay = 100 + Math.random() * 100;
    } else if (char === '\t') {
        // Tabs are quick
        baseDelay = 30 + Math.random() * 40;
    } else if (char === ' ') {
        // Spaces are quick
        baseDelay = 40 + Math.random() * 40;
    } else if (/[a-zA-Z0-9]/.test(char)) {
        // Regular alphanumeric characters
        baseDelay = 50 + Math.random() * 80;
    } else {
        // Special characters (brackets, operators, etc.) take longer
        baseDelay = 80 + Math.random() * 120;
    }
    
    // Add occasional longer pauses (thinking, reading code)
    if (Math.random() < 0.05) {
        baseDelay += 200 + Math.random() * 300;
    }
    
    return baseDelay;
}

/**
 * Sleep utility function
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function deactivate() {}

