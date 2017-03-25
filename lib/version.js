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
        for (var i = 0; i < packages.length; i++) {
            if (packages[i].name == name) {
                var version = packages[i].version.split('.');
                // return only the major and minor version
                return version[0]+'.'+version[1];
            }
        }
    }
};
