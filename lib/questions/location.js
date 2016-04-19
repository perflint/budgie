'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var debug    = require('debug'),
    inquirer = require('inquirer'),
    request = require('request')


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:location')

function location() {
  debug('Connectivity')
  return new Promise(function(resolve) {
    debug('Getting locations')
    get('http://www.webpagetest.org/getLocations.php?f=json&k=A.').then(function(availableLocations) {
      debug('Locations obtained')
      var filteredLocations = Object.keys(availableLocations.data)
      filteredLocations.push(new inquirer.Separator())
      var questions = [
        {
          type: 'list',
          name: 'location',
          message: 'Select test location (' + (filteredLocations.length - 1) + ' available)',
          choices: filteredLocations
        }
      ]

      inquirer.prompt(questions).then(function(answers) {
        debug('Onwards!')
        resolve(answers.location)
      })
    })
  })
}

function get(url) {
  return new Promise(function(resolve, reject) {
    request({ url: url, json: true }, function (error, res, body) {
      if (res.statusCode == 200) {
        resolve(body)
      }
      else {
        reject(res.statusText)
      }
      if(error) {
        reject(error)
      }
    })
  })
}

module.exports = location
