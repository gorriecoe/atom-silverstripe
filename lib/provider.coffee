packages = require('./packages');
autocompletes = require('./autocompletes');

module.exports =
  selector: '*'
  disableForSelector: '.comment, .string'
  inclusionPriority: 1
  suggestionPriority: 2
  filterSuggestions: true

  getSuggestions: (request) ->
    return unless request.prefix?.length
    suggestions = []
    for index, autocomplete of autocompletes when checkConditions(autocomplete.conditions, request)
      autocomplete.suggestion.replacementPrefix = request.prefix
      suggestions.push(autocomplete.suggestion)
    suggestions
  dispose: ->

checkConditions = (conditions, request) ->
  hasScope(conditions.scope, request.scopeDescriptor) and firstCharsEqual(conditions.prefix, request.prefix)

hasScope = (scopeConditions, scopeDescriptor) ->
  if scopeConditions
    scopesArray = scopeDescriptor.getScopesArray()
    scopeFound = false
    for scope in scopeConditions
      if !scopeFound
        scopeFound = scopesArray.indexOf(scope) isnt -1
    scopeFound

firstCharsEqual = (str1, str2) ->
  str1.startsWith(str2)
