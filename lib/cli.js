'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var cli      = require('cli'),
    debug    = require('debug'),
    path     = require('path'),
    options  = require('./options'),

    competitors = require('./questions/competitors')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:cli')


//------------------------------------------------------------------------------
// Initialisation
//------------------------------------------------------------------------------

var currentAnswers = {
      competitors: []
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
            console.log('Answers: ', currentAnswers)
          })
      }
    }

module.exports = command
