// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const SpeechClient = require("./webspeechclient");
const extensionActions = require("./actions");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "speechtocode" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "speechtocode.startSpeechCode",
    function () {
      // The code you place here will be executed every time your command is executed
      //instantiate SpeechClient
      const client = new SpeechClient({
        chromePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        continuous: true,
        headless: false,
      });

      // Display a message box to the user
      vscode.window.showInformationMessage("Start using your microphone!");
      //start recording on chrome browser page open
      client.on("ready", () => {
        client.record();
      });
      //log the speech recognition output
      client.on("data", (transcript) => {
        const commands = ["add function", "add for each", "add for in", "add for of", "add if", "add if else"];
        const actions = ["add line comment", "toggle block comment", "remove line comment", "format document"];
        const transcriptCommand =transcript.toLowerCase().trim();
        console.log(transcriptCommand);
        if (commands.includes(transcriptCommand)) {
          vscode.window.showInformationMessage(
            "Executing Command: # " + transcriptCommand
          );
          extensionActions.writeText(vscode, transcriptCommand);
        } else if(actions.includes(transcriptCommand)) {
          vscode.window.showInformationMessage(
            "Executing Action: # " + transcriptCommand
          );
          extensionActions.executeCommand(vscode, transcriptCommand);
        }
        
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
