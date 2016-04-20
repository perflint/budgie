'use strict'

//------------------------------------------------------------------------------
// Initialisation
//------------------------------------------------------------------------------

var options = {
  'debug': ['d', 'Enable debugging', 'bool', false],
  'timeout': [ 't', 'Define duration before timeout when obtaining results (seconds)', 'int', 120],
  'output': [ 'o', 'Define where to output JSON', 'file', false]
}

module.exports = options
