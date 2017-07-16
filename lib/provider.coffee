packages = require('./packages');
autocompletes = require('./autocompletes');

module.exports =
  selector: '*'
  disableForSelector: '.comment, .string'
  inclusionPriority: 1
  suggestionPriority: 2
  filterSuggestions: true

  getSuggestions: (request) ->
    completions = []
    for index, autocomplete of autocompletes when checkConditions(autocomplete.conditions, request)
      completions.push(autocomplete.suggestion)
    completions
  dispose: ->

checkConditions = (conditions, request) ->
  if request.prefix
    if hasScope(conditions.scope, request.scopeDescriptor)
      firstCharsEqual(request.prefix,conditions.prefix)

hasScope = (scopeConditions, scopeDescriptor) ->
  if scopeConditions
    scopesArray = scopeDescriptor.getScopesArray()
    scopeFound = false
    for scope in scopeConditions
      if !scopeFound
        scopeFound = scopesArray.indexOf(scope) isnt -1
    scopeFound

firstCharsEqual = (str1, str2) ->
  str1[0].toLowerCase() is str2[0].toLowerCase()
