var packagename = require('../package.json').name,
    logic = require('./logic'),
    version = require('./version'),
    path = require('path'),
    cson = require('season'),
    syntax = new Array();

atom.workspace.observeTextEditors(function(editor) {
    var versionpointsPath = path.join(
        atom.packages.resolvePackagePath(packagename),
        'versionpoints.cson'
    );
    var versionpoints = cson.readFileSync(versionpointsPath);
    if (versionpoints) {
        for (var package in versionpoints) {
            if (versionpoints.hasOwnProperty(package)) {
                for (var condition in versionpoints[package]) {
                    if (versionpoints[package].hasOwnProperty(condition)) {
                        if (logic(condition, {version: version(package)})) {
                            syntax.push(
                                versionpoints[package][condition]
                            );
                        }

                    }
                }

            }
        }
    }
    var grammar = editor.getGrammar();
    for (var i = 0; i < syntax.length; i++) {
        if (grammar.scopeName.search(syntax[i]) == -1) {
            grammar.scopeName = grammar.scopeName +'.'+ syntax[i];
        }
    }

});
