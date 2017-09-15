'use babel'

import path from 'path'
import fs from 'fs'
import json from 'json-file'

const ComposerPackages = function () {
  let composerPackages = {}
  const object = atom.workspace.project.getPaths()
  for (let key in object) {
    const projectPath = object[key]
    const composerPath = path.join(projectPath, 'composer.lock')

    if (!fs.existsSync(composerPath)) {
      // No composer.lock file found
      return composerPackages
    }

    const packagesListed = json.read(composerPath).data.packages
    for (key in packagesListed) {
      var version
      const composerPackage = packagesListed[key]
      if (composerPackage.version.indexOf('.') > -1) {
        version = composerPackage.version.split('.')
      } else {
        version = [composerPackage.version, '0']
      }
      for (let v of [0, 1]) {
        if (version[v] === null) {
          version[v] = '0'
        } else if (version[v].indexOf('dev') > -1) {
          version[v] = '9999' // lets just return a stupidly large integer if its dev-master
        }
        version[v] = version[v].replace(/[^0-9.]/, '')
      }
      composerPackages[composerPackage.name] = version[0] + '.' + version[1]
    }
  }
  return composerPackages
}

export default ComposerPackages
