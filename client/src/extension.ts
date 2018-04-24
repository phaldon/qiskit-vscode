// Copyright 2018 IBM RESEARCH. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// =============================================================================

'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import * as Q from "q";
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient';
//import {CommandPaletteHelper} from "./commandPaletteHelper";
import {DependencyMgr} from "./dependencyMgr";
import {PackageMgr} from "./packageMgr";

import { ResultProvider } from "./resultProvider";
import { CommandExecutor } from './commandExecutor';

export function activate(context: vscode.ExtensionContext) {

    console.log('Activating IBM Q Studio extension ...');

    vscode.window.showInformationMessage("✨ Activating IBM Q Studio extension... ✨");

    //registerQiskitCommands(context);

    let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
    
    let debugOptions = {
        execArgv: ["--nolazy", "--inspect=6009"]
    };

    let serverOptions: ServerOptions = {
        run: {
            module: serverModule,
            transport: TransportKind.ipc
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    }

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{
            scheme: 'file',
            language: 'qasm-lang'
        }],
        synchronize: {
            configurationSection: 'qasmLang',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
        }
    }

    let disposable = new LanguageClient('qasmLang', 'QAsm Language support', serverOptions, clientOptions).start();

    context.subscriptions.push(disposable);

    vscode.languages.registerDocumentFormattingEditProvider('qasm-lang', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): any {
            const firstLine = document.lineAt(0);
            
            return [vscode.TextEdit.insert(firstLine.range.start, 'Formatted QASM file\n')];
        }
    });

    checkDependencies()
        .then(() => {
            console.log('IBM Q Studio extension succesfully loaded!');
            vscode.window.showInformationMessage("🚀 IBM Q Studio extension loaded! 🚀");
        })
        .catch(err => {
            console.log('Dependencies error:',err);
            vscode.window.showErrorMessage(err);
        })

    /*function registerQiskitCommands(context: vscode.ExtensionContext): void {
        context.subscriptions.push(vscode.commands.registerCommand(`qiskitRun`, () => {
            return CommandPaletteHelper.run()
        }));
    }*/

    context.subscriptions.push(
        vscode.commands.registerCommand("qstudio.reload", () => activate(context)),
        vscode.commands.registerCommand("qstudio.checkDependencies", () => checkDependencies()),
        vscode.commands.registerCommand("qstudio.runCode", () => (new CommandExecutor).execPythonActiveEditor().then(codeResult => {
            let resultProvider = new ResultProvider();
            vscode.workspace.registerTextDocumentContentProvider('qiskit-preview-result', resultProvider)
            let previewUri = vscode.Uri.parse(`qiskit-preview-result://authority/result-preview`);
            resultProvider.content = codeResult;
            console.log(previewUri);
            
            vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, "Execution result")
                .then((_success) => {}, (reason) => {
                    console.log(`Error: ${reason}`);
                    vscode.window.showErrorMessage(reason);
                });
            })),
        vscode.commands.registerCommand("qstudio.discoverLocalBackends", () => (new CommandExecutor).execPythonFile('../../resources/qiskitScripts/listLocalBackends.py').then(localBackends => {
            let resultProvider = new ResultProvider();
            vscode.workspace.registerTextDocumentContentProvider('qiskit-localBackends-result', resultProvider)
            let previewUri = vscode.Uri.parse(`qiskit-localBackends-result://authority/backends-preview`);
            resultProvider.content = localBackends;
            console.log(previewUri);
            
            vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, "Local backends available")
                .then((_success) => {}, (reason) => {
                    console.log(`Error: ${reason}`);
                    vscode.window.showErrorMessage(reason);
                });
            })),
        
        vscode.commands.registerCommand("qstudio.discoverRemoteBackends", () => (new CommandExecutor).execPythonFile('../../resources/qiskitScripts/listRemoteBackends.py').then(remoteBackends => {
            let resultProvider = new ResultProvider();
            vscode.workspace.registerTextDocumentContentProvider('qiskit-remoteBackends-result', resultProvider)
            let previewUri = vscode.Uri.parse(`qiskit-remoteBackends-result://authority/backends-preview`);
            resultProvider.content = remoteBackends;
            console.log(previewUri);
            
            vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, "Remote backends available")
                .then((_success) => {}, (reason) => {
                    console.log(`Error: ${reason}`);
                    vscode.window.showErrorMessage(reason);
                });
            })),

        vscode.commands.registerCommand("qstudio.listPendingJobs", () => (new CommandExecutor).execPythonFile('../../resources/qiskitScripts/listPendingJobs.py').then(pendingJobs => {
            let resultProvider = new ResultProvider();
            vscode.workspace.registerTextDocumentContentProvider('qiskit-pendingJobs-result', resultProvider)
            let previewUri = vscode.Uri.parse(`qiskit-pendingJobs-result://authority/list-preview`);
            resultProvider.content = pendingJobs;
            console.log(previewUri);
            
            vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, "User's pending jobs")
                .then((_success) => {}, (reason) => {
                    console.log(`Error: ${reason}`);
                    vscode.window.showErrorMessage(reason);
                });
            })),

        vscode.commands.registerCommand("qstudio.listExecutedJobs", () => (new CommandExecutor).execPythonFile('../../resources/qiskitScripts/executedJobs.py').then(executedJobs => {
            let resultProvider = new ResultProvider();
            vscode.workspace.registerTextDocumentContentProvider('qiskit-executedJobs-result', resultProvider)
            let previewUri = vscode.Uri.parse(`qiskit-executedJobs-result://authority/list-preview`);
            resultProvider.content = executedJobs;
            console.log(previewUri);
            
            vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, "User's pending jobs")
                .then((_success) => {}, (reason) => {
                    console.log(`Error: ${reason}`);
                    vscode.window.showErrorMessage(reason);
                });
            })),
        //vscode.commands.registerCommand("qstudio.getQueueStatus", () => executionFunctions.getQueueStatus()),
        //vscode.commands.registerCommand("qstudio.getUserCredits", () => executionFunctions.getUserCredits()),
        vscode.commands.registerCommand("qstudio.initQConfig", () => initQConfig()
            .then((result) => {
                vscode.window.showInformationMessage(result);
            }).catch(err =>{
                vscode.window.showErrorMessage(err);
            })
        ),
    );
}

function checkDependencies(): Q.Promise<string> {
    let depMgr = new DependencyMgr();
    return Q.Promise((resolve, reject) => {
        return depMgr.checkDependencies()
            .then((deps) => {
                console.log('Checking for Python dependencies...');
                //vscode.window.showInformationMessage("Checking for Python dependencies...");
                let depsList :string = "";
                deps.forEach(dep => {
                    console.log("Package: " + dep.Name + " Version: " +
                        dep.InstalledVersion);
                        depsList+=("👌 " + dep.Name + " v " + dep.InstalledVersion+"\n");
                });
                vscode.window.showInformationMessage("IBM Q Studio dependencies found! "+depsList);
            // Check for pyhton packages!
            }).then(() => {
                console.log('Check for required python packages...');

                //vscode.window.showInformationMessage("Checking for required python packages...");
                
                let packMgr = new PackageMgr();
                return packMgr.check()
                    .then(results => {
                        console.log("packMgr.check extension.ts",results);
                        vscode.window.showInformationMessage(results);
                        //return Q.resolve(results);
                        return resolve();
                    }).catch(err => {
                        console.log("packMgr.check error extension.ts",err);
                        return Q.reject(err);
                    });
                
            // Iterate over the list of packages
            }).catch(error => {
                console.log('Seems like there was a problem: ' + error);
                //vscode.window.showWarningMessage('Seems like there was a problem: ' + error);
                vscode.window.showErrorMessage('Seems like there was a problem: ' + error);
                return reject(error);
            });
        }
    );
}

function initQConfig(): Q.Promise<string> {
    let apiToken = null;
    return Q.Promise((resolve, reject) => {
        return vscode.window.showInputBox({
            ignoreFocusOut: true,
            prompt: `👉 Let's configure your QConfig.py! Please introduce your API Token 👈`,
            password: true,
        }).then((token: string|undefined) => {
            if (token != undefined)
            {
                apiToken = token;
                return vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    prompt: `👉 Ok! Do you need to set up your hub/group/project and custom URL (probably not) 👈`,
                    placeHolder: 'Type YES if you need that, or NO if you do not need that (or not sure to need)',
                })
            }
            else{
                return reject("Empty API Token, your QConfig won't be created") 
            }
        }).then((selection: string|undefined) => {
            if (selection.toUpperCase() === 'YES'){
                // The user needs to configure the Hub/Group/Project and URL in the QConfig.py
                /*saveQConfig(apiToken, hub, group, project, url).then(result => {
                    return resolve(result);
                });*/
            }
            else {
                // The user does not need to configure the Hub/Group/Project and URL in the QConfig.py
                saveQConfig(apiToken, null, null, null, null).then(result => {
                    return resolve(result);
                })
            }
        });
    });
}

function saveQConfig(apiToken:string, hub:string|undefined, 
    group:string|undefined, project:string|undefined, 
    url:string|undefined ): Q.Promise<string> {
    vscode.window.showInformationMessage("Saving the QConfig.py... (not implemented)");
    
    return Q.Promise((resolve, reject) => {
        try{    
            console.log(apiToken);
            console.log(hub);
            console.log(group);
            console.log(project);
            console.log(url);
            // outputs the content of the text file
            return resolve("QConfig.py saved (not implemented)!")

        } catch (err) {
            return reject("Error saving QConfig.py! (not implemented)")
        };
    });
}

export function deactivate() {
    console.log('Deactivating Qiskit extension ...');
}