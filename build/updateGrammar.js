/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

var path = require('path');
var fs = require('fs');
var plist = require('fast-plist');
var https = require('https');
var url = require('url');

function removeDom(grammar) {
    grammar.repository['support-objects'].patterns = grammar.repository['support-objects'].patterns.filter(pattern => {
        if (pattern.match && pattern.match.match(/\b(HTMLElement|ATTRIBUTE_NODE|stopImmediatePropagation)\b/g)) {
            return false;
        }
        return true;
    });
    return grammar;
}

function removeNodeTypes(grammar) {
    grammar.repository['support-objects'].patterns = grammar.repository['support-objects'].patterns.filter(pattern => {
        if (pattern.name) {
            if (pattern.name.startsWith('support.variable.object.node') || pattern.name.startsWith('support.class.node.')) {
                return false;
            }
        }
        if (pattern.captures) {
            if (Object.values(pattern.captures).some(capture =>
                capture.name && (capture.name.startsWith('support.variable.object.process')
                    || capture.name.startsWith('support.class.console'))
            )) {
                return false;
            }
        }
        return true;
    });
    return grammar;
}

function patchJsdoctype(grammar) {
    grammar.repository['jsdoctype'].patterns = grammar.repository['jsdoctype'].patterns.filter(pattern => {
        if (pattern.name && pattern.name.includes('illegal')) {
            return false;
        }
        return true;
    });
    return grammar;
}

function patchGrammar(grammar) {
    return removeNodeTypes(removeDom(patchJsdoctype(grammar)));
}

function adaptToJavaScript(grammar, replacementScope) {
    grammar.name = 'JavaScript (with React support)';
    grammar.fileTypes = ['.js', '.jsx', '.es6', '.mjs', '.cjs'];
    grammar.scopeName = `source${replacementScope}`;

    var fixScopeNames = function (rule) {
        if (typeof rule.name === 'string') {
            rule.name = rule.name.replace(/\.tsx/g, replacementScope);
        }
        if (typeof rule.contentName === 'string') {
            rule.contentName = rule.contentName.replace(/\.tsx/g, replacementScope);
        }
        for (var property in rule) {
            var value = rule[property];
            if (typeof value === 'object') {
                fixScopeNames(value);
            }
        }
    };

    var repository = grammar.repository;
    for (var key in repository) {
        fixScopeNames(repository[key]);
    }
}

function getCommitSha(branchId) {
    var commitInfo = 'https://api.github.com/repos/Microsoft/TypeScript-TmLanguage/branches/' + branchId;
    return download(commitInfo).then(function (content) {
        try {
            let lastCommit = JSON.parse(content)["commit"];
            return Promise.resolve({
                commitSha: lastCommit.sha,
                commitDate: lastCommit.commit.author.date
            });
        } catch (e) {
            return Promise.resolve(null);
        }
    }, function () {
        console.err('Failed loading ' + commitInfo);
        return Promise.resolve(null);
    });
}

function download(urlString) {
    return new Promise((c, e) => {
        var _url = url.parse(urlString);
        var options = { host: _url.host, port: _url.port, path: _url.path, headers: { 'User-Agent': 'NodeJS' } };
        var content = '';
        var request = https.get(options, function (response) {
            response.on('data', function (data) {
                content += data.toString();
            }).on('end', function () {
                c(content);
            });
        }).on('error', function (err) {
            e(err.message);
        });
    });
}

exports.update = function (branchId, repoPath, dest, modifyGrammar) {
    var contentPath = 'https://raw.githubusercontent.com/Microsoft/TypeScript-TmLanguage/' + branchId + '/' + repoPath;
    console.log('Reading from ' + contentPath);
    return download(contentPath).then(function (content) {
        var ext = path.extname(repoPath);
        var grammar;
        if (ext === '.tmLanguage' || ext === '.plist') {
            grammar = plist.parse(content);
        } else {
            console.error('Unknown file extension: ' + ext);
            return;
        }
        if (modifyGrammar) {
            modifyGrammar(grammar);
        }
        return getCommitSha(branchId).then(function (info) {
            if (info) {
                grammar.version = 'https://github.com/Microsoft/TypeScript-TmLanguage/commit/' + info.commitSha;
            }

            try {
                fs.writeFileSync(dest, JSON.stringify(grammar, null, '\t'));
                if (info) {
                    console.log('Updated ' + path.basename(dest) + ' to Microsoft/TypeScript-TmLanguage@' + info.commitSha.substr(0, 7) + ' (' + info.commitDate.substr(0, 10) + ')');
                } else {
                    console.log('Updated ' + path.basename(dest));
                }
            } catch (e) {
                console.error(e);
            }
        });

    }, console.error);
}

const branch = "master";
exports.update(branch, 'TypeScript.tmLanguage', './syntaxes/TypeScript.tmLanguage.json', grammar => patchGrammar(grammar));
exports.update(branch, 'TypeScriptReact.tmLanguage', './syntaxes/TypeScriptReact.tmLanguage.json', grammar => patchGrammar(grammar));
exports.update(branch, 'TypeScriptReact.tmLanguage', './syntaxes/JavaScript.tmLanguage.json', grammar => adaptToJavaScript(patchGrammar(grammar), '.js'));
exports.update(branch, 'TypeScriptReact.tmLanguage', './syntaxes/JavaScriptReact.tmLanguage.json', grammar => adaptToJavaScript(patchGrammar(grammar), '.js.jsx'));
