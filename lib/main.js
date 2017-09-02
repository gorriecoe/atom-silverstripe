'use babel'

import AllAutocompletes from './allAutocompletes'
import ComposerPackages from './composerPackages'
import checkConditions from './checkConditions'
import { CompositeDisposable } from 'atom'

let composer = null
let autocompletes = null

export default {
  activate () {
    this.subscriptions = new CompositeDisposable()
    this.interval = null
  },
  consumeSignal (registry) {
    const provider = registry.create()
    this.subscriptions.add(provider)
    this.interval = setInterval(function () {
      if (!autocompletes) {
        provider.add('Processing silverstripe autocompletes')
        autocompletes = new AllAutocompletes()
      } else {
        provider.clear()
      }
      if (!composer) {
        provider.add('Checking composer file for silverstripe modules')
        composer = new ComposerPackages()
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
        if (autocompletes == null) { return }
        if (!(request.prefix ? request.prefix.length : undefined)) { return }
        const suggestions = []
        for (let index in autocompletes) {
          const autocomplete = autocompletes[index]
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
