'use babel'

module.exports = function (conditions, request, packages) {
  if (firstCharsEqual(conditions.prefix, request.prefix)) {
    if (hasScope(conditions.scope, request.scopeDescriptor)) {
      if (checkPackageExists(conditions, packages)) {
        return true
      }
    }
  }
}

const checkPackageExists = function ({module, minVersion, maxVersion}, packages) {
  // Allow all autocompletes if composer packages aren't found
  if (!packages || !Object.keys(packages).length) {
    return true
  }

  // Filter modules
  if (!packages.hasOwnProperty(module)) {
    return false
  }

  // Now filter module versions
  const moduleVersion = parseFloat(packages[module])
  minVersion = (minVersion) ? moduleVersion >= parseFloat(minVersion) : true
  maxVersion = (maxVersion) ? moduleVersion < parseFloat(maxVersion) : true
  return maxVersion && minVersion
}

const hasScope = function (scopeConditions, scopeDescriptor) {
  if (scopeConditions) {
    const scopesArray = scopeDescriptor.getScopesArray()
    let scopeFound = false
    for (let scope of scopeConditions) {
      if (!scopeFound) {
        scopeFound = scopesArray.indexOf(scope) !== -1
      }
    }
    return scopeFound
  }
}

const firstCharsEqual = (str1, str2) => str1.toLowerCase().startsWith(str2.toLowerCase())
