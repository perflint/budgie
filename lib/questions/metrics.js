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
    message: 'Select Budget Metrics',
    choices: [
      {
        name: 'Milestone timings',
        value: 'milestone'
      },
      {
        name: 'SpeedIndex',
        value: 'speedindex',
        checked: true
      },
      {
        name: 'Quantity based',
        value: 'quantity'
      }
      // {
      //   name: 'Rule based',
      //   value: 'rule'
      // }
    ],
    validate: function(input) {
      return new Promise(function(done) {
        if (input.length < 1) {
          done('You must choose at least one budget metric.')
        }
        done(true)
      })
    }
  },
  {
    type: 'list',
    name: 'target',
    message: 'What is your target?',
    choices: [
      {
        name: 'Better than fastest competitor',
        value: 'fastest'
      },
      {
        name: 'Better than average of all competitors',
        value: 'average'
      },
      {
        name: 'Better than slowest of all competitor',
        value: 'slowest'
      }
    ]
  }
]

function metrics() {
  debug('Budget Metrics')
  return new Promise(function(resolve) {
    inquirer.prompt(questions).then(function(answers) {
      debug('Onwards!')
      resolve(answers)
    })
  })
}
module.exports = metrics
