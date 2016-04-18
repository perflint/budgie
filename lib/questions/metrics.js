'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var debug    = require('debug'),
    inquirer = require('inquirer')


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:metrics')

var questions = [
  {
    type: 'checkbox',
    name: 'metrics',
    message: 'Select Budget Metrics (space to select)',
    choices: [
      {
        name: 'Milestone timings',
        value: 'milestone'
      },
      {
        name: 'SpeedIndex',
        value: 'speedindex'
      },
      {
        name: 'Quantity based',
        value: 'quantity'
      },
      {
        name: 'Rule based',
        value: 'rule'
      }
    ],
    validate: function(input) {
      return new Promise(function(done) {
        if (input.length < 1) {
          done('You must choose at least one budget metric.')
        }
        done(true)
      })
    }
  }
]

function metrics() {
  debug('Budget Metrics')
  return new Promise(function(resolve) {
    inquirer.prompt(questions).then(function(answers) {
      debug('Onwards!')
      resolve(answers.metrics)
    })
  })
}
module.exports = metrics
