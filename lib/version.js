const fs = require('fs'),
    json = require('json-file');

var projects = atom.workspace.project.getPaths(),
    composer = null;

/**
 * Return the version
 *
 * @param {String} name
 * @return {String}
 */
module.exports = (name) => {
    for (var i = 0; i < projects.length; i++) {
        var composerPath = projects[i]+'/composer.lock';
        if (fs.existsSync(composerPath) && !composer) {
            composer = json.read(composerPath);
        }
    }

    if (composer) {
        var packages = composer.data.packages;
        for (var c = 0; c < packages.length; c++) {
            if (packages[c].name == name) {
                var version = packages[c].version.split('.');
                // lets just return a stupidly large integer if its dev-master
                if (version[0] == 'dev-master') {
                  return 9999;
                }
                // return only the major and minor version
                return version[0]+'.'+version[1];
            }
        }
    }
};
