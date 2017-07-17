cson = require 'season'
path = require 'path'
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
        name: name
        prefix: options.prefix
        scopes: options.scope
        module: options.module
        minVersion: options.minVersion
        maxVersion: options.maxVersion
      })
  completions

buildAutoComplete = ({snippet, name, prefix, scopes, module, minVersion, maxVersion}) ->
  if scopes and packages.hasOwnProperty module
    minVersion = if minVersion? then parseFloat(packages[module]) >= parseFloat(minVersion) else true
    maxVersion = if maxVersion? then parseFloat(packages[module]) < parseFloat(maxVersion) else true
    if maxVersion and minVersion
      if scopes.indexOf(',') > -1
        scopes = scopes.split(',')
      else
        scopes = [scopes]

      trimed = []
      for scope in scopes
        scope = scope.trim()
        scope = scope.replace /^./, ''
        trimed.push(scope)
      scopes = trimed

      completions[iteration] =
        conditions:
          prefix: prefix.trim()
          scope: scopes
        suggestion:
          snippet: snippet
          displayText: name
          type: 'snippet'
          iconHTML: '<i class="icon-ss"></i>'
          className: 'suggestion-ss'
      iteration++

module.exports = new Autocompletes
