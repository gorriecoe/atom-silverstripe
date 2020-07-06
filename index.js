const sanchez = require('silverstripe-sanchez')
let build = null

module.exports = {
  activate () {
    const paths = atom.workspace.project.getPaths()
    build = sanchez.init({
      // .silverstripe_sanchez
      configPaths: paths,
      // composer.lock
      composerPaths: paths,
      // package-lock.json
      nodePaths: paths
    })
  },

  deactivate () {
    build = null
  },

  getProvider () {
    return {
      selector: '*',
      disableForSelector: '.comment',
      inclusionPriority: 1,
      suggestionPriority: 2,

      getSuggestions (request) {
        return sanchez.conditions(
          // Full list of available snippets built during activate.
          build.snippets,
          // Scope e.g. .text.html.php
          request.scopeDescriptor.scopes,
          // Prefix e.g getcmsfields
          request.prefix,
          // Full list of available composer packages found during activate.
          build.composerPackages,
          // Full list of available node packages found during activate.
          build.nodePackages
        ).map(snippet => {
          const suggestion = snippet.suggestion
          suggestion.rightLabelHTML = suggestion.information
          suggestion.displayText = suggestion.name
          suggestion.iconHTML = '<i class="icon-ss"></i>'
          if (build.comments) {
            suggestion.snippet = suggestion.comment + suggestion.body
          } else {
            suggestion.snippet = suggestion.body
          }
          return suggestion
        })
      },

      onDidInsertSuggestion ({editor, suggestion}) {
        if (suggestion.namespaces && build.namespacing) {
          // Get a list of locations to apply namespacing
          sanchez.namespace(
            editor.getText(),
            suggestion.namespaces
          ).forEach(namespace => {
            editor.setTextInBufferRange(
              [
                // Start position
                // @param row
                // @param column
                [namespace.line, 0],
                // End position
                // @param row
                // @param column
                [namespace.line, 0]
              ],
              namespace.body
            )
          })
        }
      }
    }
  }
}
