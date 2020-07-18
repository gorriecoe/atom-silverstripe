const Enginez = require('silverstripe-sanchez')
let sanchez = null

module.exports = {
  activate () {
    const paths = atom.workspace.project.getPaths()
    sanchez = new Enginez({
      // .silverstripe_sanchez
      configPaths: paths,
      // composer.lock
      composerPaths: paths,
      // package-lock.json
      nodePaths: paths
    })
  },

  deactivate () {
    sanchez = null
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
          if (sanchez.data.comments) {
            suggestion.snippet = suggestion.comment + suggestion.body
          } else {
            suggestion.snippet = suggestion.body
          }
          return suggestion
        })
      },

      onDidInsertSuggestion ({editor, suggestion}) {
        // Get a list of locations to apply use items.
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
