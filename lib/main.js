'use babel'

import autocompletes from './autocompletes'
import provider from './provider'

export default {
  activate () {
    return autocompletes
  },
  getProvider () {
    return provider
  }
}
