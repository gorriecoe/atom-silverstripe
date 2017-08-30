'use babel'

import cson from 'season'
import path from 'path'
import format from './stringformat'
import packageInfo from '../package.json'
import packages from './packages'

const packagePath = atom.packages.resolvePackagePath(packageInfo.name)
const completionsPath = path.join(packagePath, 'completions.cson')
const completions = {}
let iteration = 0

const Autocompletes = function () {
  const object = cson.readFileSync(completionsPath)
  for (let name in object) {
    const options = object[name]
    if (options.variations) {
      for (let key in options.variations) {
        const variation = options.variations[key]
        buildAutoComplete({
          snippet: variation.body,
          definitions: variation.definitions ? variation.definitions : options.definitions,
          name,
          prefix: options.prefix,
          scopes: variation.scope ? variation.scope : options.scope,
          module: variation.module ? variation.module : options.module,
          minVersion: variation.minVersion ? variation.minVersion : options.minVersion,
          maxVersion: variation.maxVersion ? variation.maxVersion : options.maxVersion,
          description: variation.description ? variation.description : options.description,
          url: variation.url ? variation.url : options.url
        })
      }
    } else {
      buildAutoComplete({
        snippet: options.body,
        definitions: options.definitions,
        name,
        prefix: options.prefix,
        scopes: options.scope,
        module: options.module,
        minVersion: options.minVersion,
        maxVersion: options.maxVersion,
        description: options.description,
        url: options.url
      })
    }
  }
  return completions
}

var buildAutoComplete = function ({snippet, definitions, name, prefix, scopes, module, minVersion, maxVersion, description, url}) {
  if (checkConditions(module, minVersion, maxVersion)) {
    completions[iteration] = {
      conditions: {
        prefix: buildPrefix(prefix, module, minVersion, maxVersion),
        scope: buildScope(scopes)
      },
      suggestion: {
        snippet: format(snippet, definitions),
        displayText: name,
        rightLabelHTML: buildRightLabel(module, minVersion, maxVersion),
        description,
        descriptionMoreURL: url,
        type: 'snippet',
        iconHTML: '<i class="icon-ss"></i>',
        className: 'suggestion-ss'
      }
    }
    iteration++
  }
}

var checkConditions = function (module, minVersion, maxVersion) {
  // Allow all autocompletes if composer packages aren't found
  if (!Object.keys(packages).length) {
    return true
  }
  // Filter modules
  if (!packages.hasOwnProperty(module)) {
    return false
  }
  // Now filer module versions
  const moduleVersion = parseFloat(packages[module])
  minVersion = (minVersion) ? moduleVersion >= parseFloat(minVersion) : true
  maxVersion = (maxVersion) ? moduleVersion < parseFloat(maxVersion) : true
  return maxVersion && minVersion
}

var buildScope = function (scopes) {
  if (scopes) {
    if (scopes.indexOf(',') > -1) {
      scopes = scopes.split(',')
    } else {
      scopes = [scopes]
    }
  } else {
    scopes = []
  }

  const cleaned = []
  for (let scope of scopes) {
    cleaned.push(scope.trim().replace(/^./, ''))
  }
  return cleaned
}

var buildPrefix = function (prefix, module, minVersion, maxVersion) {
  prefix = [prefix.trim()]
  if (module) { prefix.push(moduleName(module)) }
  if ((minVersion) || (maxVersion)) {
    prefix.push(moduleVersionString(minVersion, maxVersion))
  }
  return prefix.join('_')
}

var buildRightLabel = function (module, minVersion, maxVersion) {
  const label = []
  if (module) { label.push(moduleName(module)) }
  if ((minVersion) || (maxVersion)) {
    label.push(moduleVersionString(minVersion, maxVersion))
  }
  return label.join(' ')
}

var moduleName = module => module.replace(/^[\w-]*\//, '')

var moduleVersionString = function (minVersion, maxVersion) {
  const string = []
  if (minVersion) { string.push(minVersion) } else { string.push('0') }
  if (maxVersion) { string.push(`-${maxVersion}`) } else { string.push('+') }
  return string.join('')
}

export default new Autocompletes
