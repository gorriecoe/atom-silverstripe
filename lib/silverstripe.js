var fs = require('fs'),
    json = require('json-file'),
    composer = null,
    composerPath = atom.project.rootDirectories["0"].path+'/composer.lock',
    syntax = new Array();

function getversion(name) {
    if (fs.existsSync(composerPath) && !composer) {
        composer = json.read(composerPath);
    }
    if (composer) {
        var packages = composer.data.packages;
        for (var i = 0; i < packages.length; i++) {
            if (packages[i].name == name) {
                var version = packages[i].version.split('.');
                // return only the major and minor version
                return version[0]+'.'+version[1];
            }
        }
    }
}

atom.workspace.observeTextEditors(function(editor) {
    if (fs.existsSync(composerPath)) {
        var composer = json.read(composerPath);
        var ssversion = getversion('silverstripe/framework');
        // Add class to editor based on version.
        // I'm refering to this as "Version point" until a more suitable name discovered.
        switch (true) {
            case (ssversion < 3.0):
                syntax.push('ssv_2');
                break;
            case (ssversion == 3.0):
                syntax.push('ssv_3-0');
                break;
            case (ssversion > 3.1):
                syntax.push('ssv_3-1_+');
            case (ssversion > 3.1 && ssversion < 4.0):
                syntax.push('ssv_3-2_4-0');
                break;
            case (ssversion > 4.0):
                syntax.push('ssv_4_+');
                break;
        }

    }
    var grammar = editor.getGrammar();
    for (var i = 0; i < syntax.length; i++) {
        if (grammar.scopeName.search(syntax[i]) == -1) {
            grammar.scopeName = grammar.scopeName +'.'+ syntax[i];
        }
    }

});
