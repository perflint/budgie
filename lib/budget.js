'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var debug    = require('debug'),
    _        = require('lodash'),
    templatePerflint = require('./template/perflint.json')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:budget')


//------------------------------------------------------------------------------
// Initialisation
//------------------------------------------------------------------------------
function fastestCustomiser(a, b) {
  debug('Calculating Fastest competitor')
  if(_.isObject(a)) {
    return _.merge({}, a, b, fastestCustomiser)
  } else {
    return Math.min(a, b)
  }
}

function slowestCustomiser(a, b) {
  if(_.isObject(a)) {
    return _.merge({}, a, b, slowestCustomiser)
  } else {
    return Math.max(a, b)
  }
}

function calculateMetricBudget(target, results) {
  return new Promise(function(resolve) {
    debug('Calculating Target: ' + target)

    var args = [],
        parsed = {}

    switch(target){
      case 'fastest':
        args = _.flatten([{}, results, fastestCustomiser])
        parsed = _.merge.apply(_, args)
        break
      case 'average':
        Object.keys(results[0]).forEach(function(key) {
          parsed[key] = Math.floor(_.meanBy(results, function(o) { return o[key] }))
        })
        break
      case 'slowest':
        args = _.flatten([{}, results, slowestCustomiser])
        parsed = _.merge.apply(_, args)
        break
      default:
        // It will never get here - hopefully!
        console.log('How did you get here?!')
    }
    resolve(parsed)
  })
}

function filterMetrics(metrics, results) {
  return new Promise(function(resolve) {
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

    debug('Filtering Metrics: ' +  toPick)

    var filteredMetrics = []
    for (var i = 0; i < results.length; i++) {
      filteredMetrics.push(_.pick(results[i], toPick))
    }

    resolve(filteredMetrics)
  })
}

function isInArray(value, array) {
  return array.indexOf(value) > -1
}

var budget = {
  generate: function(opts, results) {
    return new Promise(function(resolve) {
      var base = templatePerflint

      base.URL = opts.userUrls
      base.location = opts.location
      base.connectivity = opts.connectivity

      filterMetrics(opts.metrics, results)
        .then(function(filteredResults) {
          return calculateMetricBudget(opts.target, filteredResults)
        })
        .then(function(budgetTargets) {
          base.rules = _.mapValues(budgetTargets, function(v) {
            return [ { 'max': v }, 'error' ]
          })
          resolve(base)
        })
    })
  }
}

module.exports = budget
