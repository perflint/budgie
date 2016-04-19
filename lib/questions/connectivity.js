'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var debug    = require('debug'),
    inquirer = require('inquirer'),
    chalk = require('chalk')


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug('budgie:connectivity')

var questions = [
  {
    type: 'list',
    name: 'connectivity',
    message: 'Select test connectivity',
    choices: [
      {
        name: 'FIOS   — ' + chalk.green('↓ 20Mbps') + '   ' + chalk.red('↑ 5Mbps') + '    4ms first-hop RTT',
        value: 'FIOS'
      },
      {
        name: 'Cable  — ' + chalk.green('↓ 5Mbps') + '    ' + chalk.red('↑ 1Mbps') + '    28ms first-hop RTT',
        value: 'Cable',
        checked: true
      },
      {
        name: '3GFast — ' + chalk.green('↓ 1.6Mbps') + '  ' + chalk.red('↑ 768Kbps') + '  150ms first-hop RTT',
        value: '3GFast'
      },
      {
        name: '3G     — ' + chalk.green('↓ 1.6Mbps') + '  ' + chalk.red('↑ 768Kbps') + '  300ms first-hop RTT',
        value: '3G'
      },
      {
        name: 'DSL    — ' + chalk.green('↓ 1.5Mbps') + '  ' + chalk.red('↑ 384Kbps') + '  50ms first-hop RTT',
        value: 'DSL'
      },
      {
        name: 'Dial   — ' + chalk.green('↓ 49Kbps') + '   ' + chalk.red('↑ 30Kbps') + '   120ms first-hop RTT',
        value: 'Dial'
      },
      {
        name: 'Native — No synthetic traffic shaping applied'
      }
    ]
  }
]

function connectivity() {
  debug('Connectivity')
  return new Promise(function(resolve) {
    inquirer.prompt(questions).then(function(answers) {
      debug('Onwards!')
      resolve(answers.connectivity)
    })
  })
}
module.exports = connectivity
