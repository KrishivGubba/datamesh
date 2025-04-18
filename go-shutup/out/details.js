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
exports.Thing = void 0;
const vscode = __importStar(require("vscode"));
class Thing {
    static called = 0;
    editor; //TODO: eventually make this a private field cuz cLeAn cOde
    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }
    doSomething() {
        Thing.called += 1;
        vscode.window.showInformationMessage(`Thing was called ${Thing.called} times`);
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
    insertVariables(variables, start) {
        let offset = start;
        this.editor?.edit((editBuilder) => {
            for (let i = 0; i < variables.length; i++) {
                let charPosition = 0;
                const position = new vscode.Position(offset + i, charPosition);
                let insertString = `_ := ${variables[i]} \n`;
                editBuilder.insert(position, insertString);
            }
        });
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