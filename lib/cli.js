'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var cli      = require('cli'),
    debug    = require('debug'),
    path     = require('path'),
    options  = require('./options'),

    // Question Sets
    apikey       = require('./questions/apikey'),
    userUrls  = require('./questions/user-urls'),
    competitors  = require('./questions/competitors'),
    metrics      = require('./questions/metrics'),
    connectivity = require('./questions/connectivity'),
    location     = require('./questions/location'),

    webpagetest = require('./service/webpagetest'),
    budget      = require('./budget')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:cli')


//------------------------------------------------------------------------------
// Initialisation
//------------------------------------------------------------------------------

var currentAnswers = {
      apiKey: '',
      userUrls: [],
      competitors: [],
      metrics: [],
      target: '',
      connectivity: '',
      location: '',
      runs: '1',
      server: 'www.webpagetest.org'
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

      run: function(opts) {
        var questions = new Promise(function(resolve) {
              currentAnswers.timeout = opts.timeout
              resolve(currentAnswers)
            })
        questions
          .then(apikey)
          .then(function(answers) {
            currentAnswers['apiKey'] = answers
            return userUrls()
          })
          .then(function(answers) {
            currentAnswers['userUrls'] = answers
            return competitors()
          })
          .then(function(answers) {
            currentAnswers['competitors'] = answers
            return metrics()
          })
          .then(function(answers) {
            currentAnswers['metrics'] = answers.metrics
            currentAnswers['target'] = answers.target
            return connectivity()
          })
          .then(function(answers) {
            currentAnswers['connectivity'] = answers
            return location()
          })
          .then(function(answers) {
            currentAnswers['location'] = answers
            return currentAnswers
          })
          .then(webpagetest.getResults)
          .then(function(results) {
            return budget.generate(currentAnswers, results)
          })
          .then(function(generated) {
            console.log(generated)
            process.exit(1)
          })
      }
    }

module.exports = command
