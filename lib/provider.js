'use babel'

import autocompletes from './autocompletes'

export default {
  selector: '*',
  disableForSelector: '.comment',
  inclusionPriority: 1,
  suggestionPriority: 2,

  getSuggestions (request) {
    if (!(request.prefix ? request.prefix.length : undefined)) { return }
    const suggestions = []
    for (let index in autocompletes) {
      const autocomplete = autocompletes[index]
      if (checkConditions(autocomplete.conditions, request)) {
        autocomplete.suggestion.replacementPrefix = request.prefix
        suggestions.push(autocomplete.suggestion)
      }
    }
    return suggestions
  },
  dispose () {}
}

var checkConditions = (conditions, request) => hasScope(conditions.scope, request.scopeDescriptor) && firstCharsEqual(conditions.prefix, request.prefix)

var hasScope = function (scopeConditions, scopeDescriptor) {
  if (scopeConditions) {
    const scopesArray = scopeDescriptor.getScopesArray()
    let scopeFound = false
    for (let scope of scopeConditions) {
      if (!scopeFound) {
        scopeFound = scopesArray.indexOf(scope) !== -1
      }
    }
    return scopeFound
  }
}

var firstCharsEqual = (str1, str2) => str1.toLowerCase().startsWith(str2.toLowerCase())
