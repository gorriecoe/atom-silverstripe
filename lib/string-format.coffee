nargs = /\{{([0-9a-zA-Z_]+)\}}/g

format = (string) ->
  args = undefined
  if arguments.length == 2 and typeof arguments[1] == 'object'
    args = arguments[1]
  else
    args = new Array(arguments.length - 1)
    i = 1
    while i < arguments.length
      args[i - 1] = arguments[i]
      ++i
  if !args or !args.hasOwnProperty
    args = {}
  string.replace nargs, (match, i, index) ->
    result = undefined
    if string[index - 1] == '{' and string[index + match.length] == '}'
      i
    else
      result = if args.hasOwnProperty(i) then args[i] else null
      if result == null or result == undefined
        return ''
      result

module.exports = format
