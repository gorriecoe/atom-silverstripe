const format = require('string-template'),
    ref = require('loophole'),
    allowUnsafeEval = ref.allowUnsafeEval;

/**
 * It is based on `eval` function. You should be in charge of the security with injection risks.
 *
 * @param {String} pattern
 * @param {Object} [variables]
 * @return {Boolean}
 */
module.exports = (pattern, variables) => {
    return allowUnsafeEval(function() {
        if (typeof variables.version != 'undefined') {
            return eval(format(pattern, variables));
        }
    });
};
