cson = require 'season'
path = require 'path'
format = require './string-format'
packageInfo = require '../package.json'
packagePath = atom.packages.resolvePackagePath packageInfo.name
packages = require './packages'
completionsPath = path.join packagePath, 'completions.cson'
completions = {}
iteration = 0

Autocompletes = ->
  for name, options of cson.readFileSync completionsPath
    if options.variations
      for key, variation of options.variations
        buildAutoComplete({
          snippet: variation.body
          definitions: variation.definitions ? options.definitions
          name: name
          prefix: options.prefix
          scopes: variation.scope ? options.scope
          module: variation.module ? options.module
          minVersion: variation.minVersion ? options.minVersion
          maxVersion: variation.maxVersion ? options.maxVersion
        })
    else
      buildAutoComplete({
        snippet: options.body
        definitions: options.definitions
        name: name
        prefix: options.prefix
        scopes: options.scope
        module: options.module
        minVersion: options.minVersion
        maxVersion: options.maxVersion
      })
  completions

buildAutoComplete = ({snippet, definitions, name, prefix, scopes, module, minVersion, maxVersion}) ->
  if scopes
    if scopes.indexOf(',') > -1
      scopes = scopes.split(',')
    else
      scopes = [scopes]
  else
    scopes = []
  trimed = []
  for scope in scopes
    trimed.push(scope.trim().replace /^./, '')
  scopes = trimed

  if packages.hasOwnProperty module
    moduleVersion = parseFloat(packages[module])
    minVersion = if minVersion? then moduleVersion >= parseFloat(minVersion) else true
    maxVersion = if maxVersion? then moduleVersion < parseFloat(maxVersion) else true
    if maxVersion and minVersion
      completions[iteration] =
        conditions:
          prefix: prefix.trim()
          scope: scopes
        suggestion:
          snippet: format(snippet, definitions)
          displayText: name
          type: 'snippet'
          iconHTML: '<i class="icon-ss"></i>'
          className: 'suggestion-ss'
      iteration++

module.exports = new Autocompletes
