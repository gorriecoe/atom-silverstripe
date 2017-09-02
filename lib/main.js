'use babel'

import allAutocompletes from './allAutocompletes'
import composerPackages from './composerPackages'
import checkConditions from './checkConditions'
import { CompositeDisposable } from 'atom'

let composer = null

export default {
  activate () {
    this.subscriptions = new CompositeDisposable()
    this.interval = null
  },
  consumeSignal (registry) {
    const provider = registry.create()
    this.subscriptions.add(provider)
    this.interval = setInterval(function () {
      if (!composer) {
        provider.add('Checking composer file')
        composer = composerPackages
      } else {
        provider.clear()
      }
    }, 5000)
  },
  deactivate () {
    this.subscriptions.dispose()
    composer = null
    clearInterval(this.interval)
  },
  getProvider () {
    return {
      selector: '*',
      disableForSelector: '.comment',
      inclusionPriority: 1,
      suggestionPriority: 2,

      getSuggestions (request) {
        if (!(request.prefix ? request.prefix.length : undefined)) { return }
        const suggestions = []
        for (let index in allAutocompletes) {
          const autocomplete = allAutocompletes[index]
          if (checkConditions(autocomplete.conditions, request, composer)) {
            autocomplete.suggestion.replacementPrefix = request.prefix
            suggestions.push(autocomplete.suggestion)
          }
        }
        return suggestions
      },
      dispose () {}
    }
  }
}
