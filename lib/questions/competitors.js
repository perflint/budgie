'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var debug    = require('debug'),
    inquirer = require('inquirer')


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:competitors')

var questions = [
  {
    type: 'input',
    name: 'comparisonUrls',
    message: 'Enter a competitor\'s URL:',
    validate: function(input) {
      return new Promise(function(done) {
        var urlCheck = new RegExp('^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$')
        if (!urlCheck.test(input)) {
          done('Please enter a valid URL')
          return
        }
        done(true)
      })
    }
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: 'Enter another competitor\'s URL (just hit enter for YES)?',
    default: true
  }
],
completeAnswers = []

function competitors() {
  debug('Competitors')
  return new Promise(function(resolve) {
    inquirer.prompt(questions).then(function(answers) {
      completeAnswers.push(answers.comparisonUrls)
      if (answers.askAgain) {
        debug('Asking again..')
        resolve(competitors())
      } else {
        debug('Onwards!')
        resolve(completeAnswers)
      }
    })
  })
}
module.exports = competitors
