'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var debug    = require('debug'),
    templatePerflint = require('./template/perflint.json')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:budget')


//------------------------------------------------------------------------------
// Initialisation
//------------------------------------------------------------------------------
function calculateMetricBudget(target, results) {
  console.log(results)
  switch(target){
    case 'fastest':
      break
    case 'average':
      break
    case 'slowest':
      break
    default:
      // It will never get here - hopefully!
      console.log('How did you get here?!')
  }
}

function filterMetrics(metrics, results) {
  var toPick = []
  if (isInArray('milestone', metrics)) {
    toPick.push('loadTime', 'domContentLoadedEventStart', 'render')
  }
  if (isInArray('speedindex', metrics)) {
    toPick.push('SpeedIndex')
  }
  if (isInArray('quantity', metrics)) {
    toPick.push('bytesIn', 'requestsFull', 'requestsDoc', 'requestsHTML', 'requestsJS', 'requestsCSS', 'requestsImage', 'requestsFlash', 'requestsFont', 'requestsOther')
  }
  if (isInArray('rule', metrics)) {
    toPick.push('pageSpeed')
  }
  console.log(results)
  return toPick
}

function isInArray(value, array) {
  return array.indexOf(value) > -1
}

var budget = {
  generate: function(opts, results) {
    return new Promise(function(resolve) {
      var base = templatePerflint

      base.URL = results.userSite
      base.location = results.location
      base.connectivity = results.connectivity

      var filteredResults = filterMetrics(opts.metrics, results)

      calculateMetricBudget(opts.target, filteredResults)

      resolve()
    })
  }
}

module.exports = budget
