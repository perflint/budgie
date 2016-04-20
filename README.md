[![NPM version](https://img.shields.io/npm/v/budgie.svg?style=flat)](https://www.npmjs.com/package/budgie)
[![NPM dependencies](https://david-dm.org/perflint/budgie.svg)](https://david-dm.org/perflint/budgie)

# Budgie
A tool to help build a website's [PerfLint](https://github.com/perflint/perflint) performance budget.

## Install

`npm install -g budgie`

## Usage

Run the following in your terminal;

`budgie`

### Available Options

`-h`, `--help`          Displays available options.

`-v`, `--version`       Displays version.

`-o`, `--output `       Output path of the generated PerfLint config. Defaults to stdout.

`-t`, `--timeout `      Define the timeout of WebPageTest requests.

## Further Reading

The categories for metrics are based on [Tim Kadlec's](https://github.com/tkadlec) [brilliant article on performance budgets](https://timkadlec.com/2014/11/performance-budget-metrics/).

The generated configurations are only rough guides, to add your own metrics see the [PerfLint Rules documentation](https://perflint.readme.io/docs/rules) for available metrics. For further configuration options see the [Configuring PerfLint documentation](https://perflint.readme.io/docs/configuring-perflint).
