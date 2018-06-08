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

import * as Q from 'q';
import * as vscode from 'vscode';
import * as nodeChildProcess from 'child_process';
import { Util } from './utils';
import { QLogger } from './logger';

interface IExecOptions {
    cwd?: string;
    stdio?: any;
    env?: any;
    encoding?: string;
    timeout?: number;
    maxBuffer?: number;
    killSignal?: string;
}

export namespace CommandExecutor {
    export function exec(command: string, args: string[] = [], options: IExecOptions = {}): Q.Promise<string> {
        let outcome = Q.defer<string>();

        nodeChildProcess.exec(
            command + ' ' + args.join(' '),
            options,
            (error: Error, stdout: string, stderr: string) => {
                if (error) {
                    // Dirty trick, read below.
                    let errorString = stdout + stderr;
                    outcome.reject(errorString);
                } else {
                    // Dirty trick, some commands outputs successfully commands,
                    // like --version to stderr (WTF!). Python interpreter is an
                    // example, unfortunately.
                    let outputString = stdout + stderr;
                    outcome.resolve(outputString);
                }
            }
        );

        return outcome.promise;
    }

    export function execPythonActiveEditor(): Q.Promise<string> {
        return Q.Promise((resolve, reject) => {
            vscode.window.showInformationMessage('⚡ Running... ⚡');
            const codeFile = vscode.window.activeTextEditor.document;
            codeFile.save();
            CommandExecutor.exec('python', [codeFile.fileName.toString()])
                .then(stdout => {
                    return resolve(stdout);
                })
                .catch(err => {
                    QLogger.error(err, this);
                    vscode.window.showErrorMessage(err);
                    return reject(err);
                });
        });
    }

    export function execQasmActiveEditor(scriptPath: string): Q.Promise<string> {
        return Q.Promise((resolve, reject) => {
            const execPath = Util.getOSDependentPath(scriptPath);

            vscode.window.showInformationMessage('⚡ Running... ⚡');
            const codeFile = vscode.window.activeTextEditor.document;
            codeFile.save();

            //console.log("Let's go to execute that QASM")
            //console.log(execPath);

            vscode.workspace.openTextDocument(execPath).then(document => {
                //console.log(document);
                //console.log("python", [document.fileName.toString(), '--file', codeFile.fileName.toString()]);

                CommandExecutor.exec('python', [document.fileName.toString(), '--file', codeFile.fileName.toString()])
                    .then(stdout => {
                        //console.log(stdout);
                        return resolve(stdout);
                    })
                    .catch(err => {
                        QLogger.error(err, this);
                        vscode.window.showErrorMessage(err);
                        return reject(err);
                    });
            });
        });
    }

    export function execPythonFile(scriptPath: string, options: string[]): Q.Promise<string> {
        return Q.Promise((resolve, reject) => {
            vscode.window.showInformationMessage('⚡ Running... ⚡');

            const execPath = Util.getOSDependentPath(scriptPath);

            vscode.workspace.openTextDocument(execPath).then(document => {
                CommandExecutor.exec('python', [document.fileName.toString()].concat(options))
                    .then(stdout => {
                        // console.log(stdout);
                        //vscode.window.showInformationMessage("Execution result:",stdout);
                        return resolve(stdout);
                    })
                    .catch(err => {
                        QLogger.error(err, this);
                        vscode.window.showErrorMessage(err);
                        return reject(err);
                    });
            });
        });
    }
}
