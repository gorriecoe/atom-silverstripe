'use babel'

import AllAutocompletes from './allAutocompletes'
import ComposerPackages from './composerPackages'
import checkConditions from './checkConditions'
import setNamespace from './setNamespace'
import { CompositeDisposable } from 'atom'
import packageInfo from '../package.json'

let composer = null
let autocompletes = null

export default {
  activate () {
    require('atom-package-deps').install(packageInfo.name, false)
    this.subscriptions = new CompositeDisposable()
  },
  consumeSignal (registry) {
    const autocompleteProvider = registry.create()
    const composerProvider = registry.create()
    this.subscriptions.add(autocompleteProvider)
    this.subscriptions.add(composerProvider)
    this.interval = setInterval(function () {
      if (!autocompletes) {
        autocompleteProvider.add('Processing silverstripe autocompletes')
        autocompletes = new AllAutocompletes()
      } else {
        autocompleteProvider.clear()
      }
      if (!composer) {
        composerProvider.add('Checking composer file for silverstripe modules')
        composer = new ComposerPackages()
      } else {
        composerProvider.clear()
      }
    }, 1000)
  },
  deactivate () {
    this.subscriptions.dispose()
    autocompletes = null
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
      onDidInsertSuggestion ({editor, triggerPosition, suggestion}) {
        if (suggestion.useNamespace) {
          setNamespace(editor, suggestion.useNamespace)
        }
      },
      dispose () {}
    }
  }
}
