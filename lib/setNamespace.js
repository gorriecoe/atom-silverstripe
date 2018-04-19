'use babel'

module.exports = function (editor, namespaces) {
  for (let namespacekey in namespaces) {
    let namespace = namespaces[namespacekey],
        text = editor.getText(),
        index = 0,
        use = 'use ' + namespace + ";\n"

    if (text.includes(use)) {
      break
    }

    lines = text.split('\n')
    for (let key in lines) {
      let line = lines[key].trim()

      if (line.indexOf('namespace') == 0) {
        editor.setTextInBufferRange([[index+2,0], [index+2, 0]], use)
        break
      } else if (line != "" && line.indexOf("<?") != 0) {
        editor.setTextInBufferRange([[index,0], [index, 0]], use)
        break
      }

      index++
    }
  }
}
