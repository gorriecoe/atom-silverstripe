const Enginez = require('silverstripe-sanchez')
const { CompositeDisposable } = require('atom')
const packageDeps = require('atom-package-deps')
const packageInfo = require('../package.json')

let sanchez = null

module.exports = {
  activate () {
    packageDeps.install(
      packageInfo.name,
      false
    )
    this.subscriptions = new CompositeDisposable()
    this.interval = null
  },

  consumeSignal (registry) {
    const sanchezProvider = registry.create()
    this.subscriptions.add(sanchezProvider)

    const atomconfig = {
      comments: atom.config.get('atom-silverstripe.comments'),
      useItems: atom.config.get('atom-silverstripe.useItems')
    }

    // if null use `.silverstripe_sanchez` file config if available either in
    // the home directory or active project
    if (atomconfig.comments === 'null') {
      delete atomconfig.comments
    }

    // if null use `.silverstripe_sanchez` file config if available either in
    // the home directory or active project
    if (atomconfig.useItems === 'null') {
      delete atomconfig.useItems
    }

    let sanchezBuilt = false
    this.interval = setInterval(() => {
      if (sanchezBuilt) {
        clearInterval(this.interval)
        sanchezProvider.add('Silverstripe complete')
        sanchezProvider.clear()
      } else {
        sanchezProvider.add('Initializing Silverstripe')
        sanchez = new Enginez({
          rootPaths: atom.workspace.project.getPaths(),
          // atom settings override .silverstripe_sanchez
          config: atomconfig
        })
        sanchezBuilt = true
      }
    }, 1000)
  },

  deactivate () {
    sanchez = null
    this.subscriptions.dispose()
    clearInterval(this.interval)
  },

  getProvider () {
    return {
      selector: '*',
      disableForSelector: '.comment',
      inclusionPriority: 1,
      suggestionPriority: 2,

      getSuggestions (request) {
        return sanchez.snippets({
          // Scope e.g. .text.html.php
          scope: request.scopeDescriptor.scopes,
          // Prefix e.g getcmsfields
          prefix: request.prefix,
          // Atom doesn't use language so just pass it.
          language: true
        }).map(snippet => {
          const suggestion = snippet.suggestion
          suggestion.rightLabelHTML = suggestion.information
          suggestion.displayText = suggestion.name
          suggestion.iconHTML = '<i class="icon-ss"></i>'
          if (sanchez.data.comments === 'true') {
            suggestion.snippet = suggestion.comment + suggestion.body
          } else {
            suggestion.snippet = suggestion.body
          }
          return suggestion
        })
      },

      onDidInsertSuggestion ({ editor, suggestion }) {
        // Get a list of locations to safely apply use items from sanchez.
        // Then insert in the given locations.
        sanchez.getUseItemLoc({
          text: editor.getText(),
          useItems: suggestion.useItems
        }).forEach(useItem => {
          editor.setTextInBufferRange(
            [
              // Start position
              // @param row
              // @param column
              [useItem.line, 0],
              // End position
              // @param row
              // @param column
              [useItem.line, 0]
            ],
            useItem.body
          )
        })
      }
    }
  }
}
