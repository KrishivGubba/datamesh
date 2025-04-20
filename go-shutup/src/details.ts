import * as vscode from 'vscode';
import variables from '../output/variables.json'

export type VarLocation = {
    VarNames: string[];
    LineNumber: number;
}

export class Thing {

    public editor: vscode.TextEditor | undefined;  //TODO: eventually make this a private field cuz cLeAn cOde

    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }

    public showMessage(message: string){
        vscode.window.showInformationMessage(message);
    }

    public showError(message: string){
        vscode.window.showErrorMessage(message);
    }

    public verifyFileType(filetype: string = "go") : boolean{
        return this.editor?.document.languageId == filetype ? true : false; //my first ternary operator :o
    }

    //IMPORTANT: this method assumes you're adding stuff in reverse sorted order
    public async insertVariables(array: VarLocation[]) {
        // Process each variable location one at a time
        for (let i = 0; i < array.length; i++) {
            await this.insertSingleVariable(array[i]);
        }
    }
    
    private async insertSingleVariable(variable: VarLocation) {
        if (!this.editor) {
            return;
        }
        
        // Wait for each edit operation to complete before proceeding
        await this.editor.edit((editBuilder) => {
            if (this.editor) {
                // Calculate position at end of the specified line
                const lineEnd = new vscode.Position(
                    variable.LineNumber-1, 
                    this.editor.document.lineAt(variable.LineNumber-1).range.end.character
                );
                
                // Insert a newline
                editBuilder.insert(lineEnd, "\n");
                
                // Insert all variable references on the next line
                let insertText = "";
                for (let i = 0; i < variable.VarNames.length; i++) {
                    // Add each variable on its own line
                    insertText += `_ = ${variable.VarNames[i]}\n`;
                }
                
                // Insert all variables at once at the beginning of the next line
                const nextLineStart = new vscode.Position(variable.LineNumber, 0);
                editBuilder.insert(nextLineStart, insertText);
            }
        });
        
        // Add a small delay to ensure edits are applied
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    public readVariables() : VarLocation[]{
        let returnable = variables.Variables
    
        returnable.sort((a, b) => b.LineNumber - a.LineNumber);  //sort in descending
        
        return returnable
    }

    public getFileName(): string | undefined{
        return this.editor?.document.fileName;
    }

    public getCurrFilePath(): string | undefined{
        return this.editor?.document.uri.fsPath;
    }
}
