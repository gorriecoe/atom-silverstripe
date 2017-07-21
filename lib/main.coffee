path = require 'path'
fs = require 'fs'
json = require 'json-file'

autocompletes = require './autocompletes'
provider = require './provider'

module.exports =
  activate:  -> autocompletes
  getProvider: -> provider
