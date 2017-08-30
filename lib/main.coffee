autocompletes = require './autocompletes'
provider = require './provider'

module.exports =
  activate:  -> autocompletes
  getProvider: -> provider
