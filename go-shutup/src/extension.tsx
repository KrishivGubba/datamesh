// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Thing} from './details'

//helper functions



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-shutup" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('go-shutup.helloWorld', () => {
	// 	// The code you place here will be exawefawefecuted every time your command is executed
	// 	// Display a message box to the user
	// 	let something = "brothe rin aow;ief;waoefji"
	// 	vscode.window.showInformationMessage(something);
	// });

	let suppress = vscode.commands.registerCommand('go-shutup.suppress', () => {
		let plap = new Thing()
		plap.showMessage(`${Thing.called}`)
		const activeEditor = vscode.window.activeTextEditor;
		const filename = plap.getFileName();
		if (filename==undefined){
			plap.showError("What the hell is happening")
		}

		//check to see that this file is a .go file
		if (!plap.verifyFileType()){
			vscode.window.showErrorMessage("Please run this on a Golang file.")
			return
		}

		let unusedVars: string[] = [];

		//TODO: logic to find all the variables, this will likely rqeuire parsing the Go file

		for (let i = 0; i < 10; i++)
			unusedVars.push("somevariable")

		plap.insertVariables(unusedVars, 0);
	})

	//steps
	//1. check if the file is even a golang file
	//2. find all the unused variables, or literally who cares, just use the golang parser and find all the variables i think
	//3. now that you have an array of variables, navigate to the end of the file ***
	//4.  maybe add a bunch of empty lines first?
	//5. add a demarcation for the variable territory

	//you may need to check if youve already seen this file, because if you have, then you dont need to re add a lot of variables
	//idk maybe you should try to maintain a line number, or some offset? like n lines from the end of the file points to the beginning
	// of the variable listing? ye pretty smart ngl

	context.subscriptions.push(suppress);
}

// This method is called when your extension is deactivated
export function deactivate() {}


//HOW TO START DEV:

// run "npx tsc --watch" so that your extension.tsx file is being watched at all time for changes, so when you save it recompiles
//check to see that your out dir is being updated.


//NOTE: the contributes.commands array has all the commands that are going to be added to the command palette
//also, you use commands.registercommand to bind the function to a specific command that youre adding.