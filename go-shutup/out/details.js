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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thing = void 0;
const vscode = __importStar(require("vscode"));
const variables_json_1 = __importDefault(require("../output/variables.json"));
class Thing {
    editor; //TODO: eventually make this a private field cuz cLeAn cOde
    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }
    showMessage(message) {
        vscode.window.showInformationMessage(message);
    }
    showError(message) {
        vscode.window.showErrorMessage(message);
    }
    verifyFileType(filetype = "go") {
        return this.editor?.document.languageId == filetype ? true : false; //my first ternary operator :o
    }
    //IMPORTANT: this method assumes you're adding stuff in reverse sorted order
    async insertVariables(array) {
        // Process each variable location one at a time
        for (let i = 0; i < array.length; i++) {
            await this.insertSingleVariable(array[i]);
        }
    }
    async insertSingleVariable(variable) {
        if (!this.editor) {
            return;
        }
        // Wait for each edit operation to complete before proceeding
        await this.editor.edit((editBuilder) => {
            if (this.editor) {
                // Calculate position at end of the specified line
                const lineEnd = new vscode.Position(variable.LineNumber - 1, this.editor.document.lineAt(variable.LineNumber - 1).range.end.character);
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
    readVariables() {
        let returnable = variables_json_1.default.Variables;
        returnable.sort((a, b) => b.LineNumber - a.LineNumber); //sort in descending
        return returnable;
    }
    getFileName() {
        return this.editor?.document.fileName;
    }
    getCurrFilePath() {
        return this.editor?.document.uri.fsPath;
    }
}
exports.Thing = Thing;
//# sourceMappingURL=details.js.map