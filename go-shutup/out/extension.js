"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const details_1 = require("./details");
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
//helper functions
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
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
        let plap = new details_1.Thing();
        const activeEditor = vscode.window.activeTextEditor;
        const filename = plap.getFileName();
        if (filename == undefined) {
            plap.showError("What the hell is happening");
        }
        //check to see that this file is a .go file
        if (!plap.verifyFileType()) {
            vscode.window.showErrorMessage("Please run this on a Golang file.");
            return;
        }
        //TODO: logic to find all the variables, this will likely rqeuire parsing the Go file
        const extensionPath = context.extensionPath;
        const cliPath = path.join(extensionPath, "shutup.exe");
        const executeHere = extensionPath;
        //this bit of code here will populate output/variables.json
        cp.execFile(cliPath, [`random ${plap.getCurrFilePath()}`], {
            cwd: executeHere, // we've set executeHere to the root dir of the extension because that's where the output dir is.
            shell: true, //idk why this arg is here.
        }, (error, stdout, stderr) => {
            if (error) {
                plap.showMessage(error.message);
                plap.showError("Brohte rin christ somethiwng wrong");
            }
            plap.showMessage("All good to go!");
        });
        //TODO: do we even need this bit of code here? probably get rid of it
        const filepath = plap.getCurrFilePath();
        if (filepath == undefined)
            plap.showError("Is this a file even? You're on your own.");
        //read from results.json and write to file.
        let variableArr = plap.readVariables();
        plap.insertVariables(variableArr);
    });
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
function deactivate() { }
//HOW TO START DEV:
// run "npx tsc --watch" so that your extension.tsx file is being watched at all time for changes, so when you save it recompiles
//check to see that your out dir is being updated.
//NOTE: the contributes.commands array has all the commands that are going to be added to the command palette
//also, you use commands.registercommand to bind the function to a specific command that youre adding.
//# sourceMappingURL=extension.js.map