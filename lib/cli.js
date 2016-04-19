'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var cli      = require('cli'),
    debug    = require('debug'),
    path     = require('path'),
    options  = require('./options'),

    // Question Sets
    apikey  = require('./questions/apikey'),
    competitors  = require('./questions/competitors'),
    metrics      = require('./questions/metrics'),
    connectivity = require('./questions/connectivity'),
    location = require('./questions/location')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:cli')


//------------------------------------------------------------------------------
// Initialisation
//------------------------------------------------------------------------------

var currentAnswers = {
      apiKey: '',
      competitors: [],
      metrics: [],
      connectivity: '',
      location: ''
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
          .then(apikey)
          .then(function(answers) {
            currentAnswers['apiKey'] = answers
            return competitors()
          })
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
            return location()
          })
          .then(function(answers) {
            currentAnswers['location'] = answers
            console.log('Answers: ', currentAnswers)
          })
      }
    }

module.exports = command
