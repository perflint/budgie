'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var debug    = require('debug'),
    inquirer = require('inquirer')


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:APIkey')

var questions = [
  {
    type: 'password',
    name: 'apiKey',
    message: 'Enter your WepPageTest API key:',
    validate: function(input) {
      return new Promise(function(done) {
        if (input.length < 1) {
          done('You must enter an API key to run WebPageTests. See: https://www.webpagetest.org/getkey.php')
        }
        done(true)
      })
    }
  }
]

function apiKey() {
  debug('API Key')
  return new Promise(function(resolve) {
    inquirer.prompt(questions).then(function(answers) {
      debug('Onwards!')
      resolve(answers.apiKey)
    })
  })
}
module.exports = apiKey
