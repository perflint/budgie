'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var cli      = require('cli'),
    debug    = require('debug'),
    path     = require('path'),
    options  = require('./options'),

    // Question Sets
    competitors  = require('./questions/competitors'),
    metrics      = require('./questions/metrics'),
    connectivity = require('./questions/connectivity')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:cli')


//------------------------------------------------------------------------------
// Initialisation
//------------------------------------------------------------------------------

var currentAnswers = {
      competitors: [],
      metrics: [],
      connectivity: ''
    },
    command = {
      interpret: function(args) {
        debug('Beep bop beep .. starting up..')
        cli.setArgv(args)
        cli.options = {}

        cli.enable('version', 'glob', 'help')
        cli.setApp(path.resolve(__dirname + '/../package.json'))

        var opts = cli.parse(options)

        command.run(opts)
      },

      run: function() {
        var questions = new Promise(function(resolve) {
              resolve(currentAnswers)
            })
        questions
          .then(competitors)
          .then(function(answers) {
            currentAnswers['competitors'].push(answers)
            return metrics()
          })
          .then(function(answers) {
            currentAnswers['metrics'].push(answers)
            return connectivity()
          })
          .then(function(answers) {
            currentAnswers['connectivity'] = answers
            console.log('Answers: ', currentAnswers)
          })
      }
    }

module.exports = command
