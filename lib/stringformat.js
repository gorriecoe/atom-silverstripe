'use babel'

const nargs = /\{{([0-9a-zA-Z_]+)\}}/g

const format = function (string) {
  let args = undefined
  if ((arguments.length === 2) && (typeof arguments[1] === 'object')) {
    args = arguments[1]
  } else {
    args = new Array(arguments.length - 1)
    let i = 1
    while (i < arguments.length) {
      args[i - 1] = arguments[i]
      ++i
    }
  }
  if (!args || !args.hasOwnProperty) {
    args = {}
  }
  return string.replace(nargs, function (match, i, index) {
    let result = undefined
    if ((string[index - 1] === '{') && (string[index + match.length] === '}')) {
      return i
    } else {
      result = args.hasOwnProperty(i) ? args[i] : null
      if ((result === null) || (result === undefined)) {
        return ''
      }
      return result
    }
  })
}

export default format
