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
          description: variation.description ? options.description
          url: variation.url ? options.url
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
        description: options.description
        url: options.url
      })
  completions

buildAutoComplete = ({snippet, definitions, name, prefix, scopes, module, minVersion, maxVersion, description, url}) ->
  if checkConditions(module, minVersion, maxVersion)
    completions[iteration] =
      conditions:
        prefix: buildPrefix(prefix, module, minVersion, maxVersion)
        scope: buildScope(scopes)
      suggestion:
        snippet: format(snippet, definitions)
        displayText: name
        rightLabelHTML: buildRightLabel(module, minVersion, maxVersion)
        description: description
        descriptionMoreURL: url
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
  if module? then prefix.push(moduleName(module))
  if minVersion? or maxVersion?
    prefix.push(moduleVersionString(minVersion, maxVersion))
  prefix.join('_')

buildRightLabel = (module, minVersion, maxVersion) ->
  label = []
  if module? then label.push(moduleName(module))
  if minVersion? or maxVersion?
    label.push(moduleVersionString(minVersion, maxVersion))
  label.join(' ')

moduleName = (module) ->
  module.replace(/^[\w-]*\//, '')

moduleVersionString = (minVersion, maxVersion) ->
  string = []
  if minVersion? then string.push(minVersion) else string.push('0')
  if maxVersion? then string.push('-' + maxVersion) else string.push('+')
  string.join('')

module.exports = new Autocompletes
