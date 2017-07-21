path = require 'path'
fs = require 'fs'
json = require 'json-file'
composerPackages = ->
  composerPackages = {}
  for key, projectPath of atom.workspace.project.getPaths()
    composerPath = path.join projectPath, 'composer.lock'
    if fs.existsSync(composerPath)
      for key, composerPackage of json.read(composerPath).data.packages
        if composerPackage.version.indexOf('.') > -1
          version = composerPackage.version.split('.')
        else
          version = [composerPackage.version, '0']
        for v in [0,1]
          if version[v] == null
            version[v] = '0'
          else if version[v].indexOf('dev') > -1
            version[v] = '9999' # lets just return a stupidly large integer if its dev-master
          version[v] = version[v].replace /[^0-9.]/, ''
        composerPackages[composerPackage.name] = version[0] + '.' + version[1]
  composerPackages

module.exports = new composerPackages
