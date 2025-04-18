import * as vscode from 'vscode';

export class Thing {
    static called: number = 0;

    public editor: vscode.TextEditor | undefined;  //TODO: eventually make this a private field cuz cLeAn cOde

    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }

    public doSomething() {
        Thing.called += 1;
        vscode.window.showInformationMessage(`Thing was called ${Thing.called} times`);
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

    public insertVariables(variables : string[], start : number){
        let offset = start;

        this.editor?.edit((editBuilder) => {
            for (let i = 0; i < variables.length; i++){
                let charPosition = 0;
                const position = new vscode.Position(offset + i, charPosition);
                let insertString = `_ := ${variables[i]} \n`
                editBuilder.insert(position, insertString)
            }
        })
        
    }

    public getFileName(): string | undefined{
        return this.editor?.document.fileName;
    }

    public getCurrFilePath(): string | undefined{
        return this.editor?.document.uri.fsPath;
    }
}
