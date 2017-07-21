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
  if checkConditions(module, minVersion, maxVersion)
    completions[iteration] =
      conditions:
        prefix: buildPrefix(prefix, module, minVersion, maxVersion)
        scope: buildScope(scopes)
      suggestion:
        snippet: format(snippet, definitions)
        displayText: name
        type: 'snippet'
        iconHTML: '<i class="icon-ss"></i>'
        className: 'suggestion-ss'
    iteration++

checkConditions = (module, minVersion, maxVersion) ->
  # Allow all autocompletes if composer packages aren't found
  if !Object.keys(packages).length
    return true
  # Filter modules
  if !packages.hasOwnProperty(module)
    return false
  # Now filer module versions
  moduleVersion = parseFloat(packages[module])
  minVersion = if minVersion? then moduleVersion >= parseFloat(minVersion) else true
  maxVersion = if maxVersion? then moduleVersion < parseFloat(maxVersion) else true
  maxVersion and minVersion

buildScope = (scopes) ->
  if scopes
    if scopes.indexOf(',') > -1
      scopes = scopes.split(',')
    else
      scopes = [scopes]
  else
    scopes = []

  cleaned = []
  for scope in scopes
    cleaned.push(scope.trim().replace(/^./, ''))
  cleaned

buildPrefix = (prefix, module, minVersion, maxVersion) ->
  prefix = [prefix.trim()]
  if module? then prefix.push(module.replace(/^[\w-]*\//, ''))
  if minVersion? and maxVersion?
    if minVersion? then prefix.push(minVersion) else prefix.push('0')
    if maxVersion? then prefix.push(maxVersion) else prefix.push('+')
  prefix.join('_')

module.exports = new Autocompletes
