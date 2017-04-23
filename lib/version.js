const fs = require('fs'),
    json = require('json-file');

var projects = atom.workspace.project.getPaths(),
    packages = null;

/**
 * Return the version
 *
 * @param {String} name
 * @return {String}
 */
module.exports = (name) => {
    for (var i = 0; i < projects.length; i++) {
        var composer = projects[i] + '/composer.lock';
        if (fs.existsSync(composer) && !packages) {
            packages = json.read(composer).data.packages;
        }
    }

    if (packages) {
        for (var c = 0; c < packages.length; c++) {
            if (packages[c].name == name) {
                var version = packages[c].version.split('.');
                for (var v = 0; v < 2; v++) {
                    if(version[v] == null) {
                        version[v] =  0;
                    } else if (version[v].indexOf('dev') > -1) {
                        // lets just return a stupidly large integer if its dev-master
                        version[v] = 9999;
                    }
                }
                // return only the major and minor version
                return version[0] + '.' + version[1];
            }
        }
    }
};
