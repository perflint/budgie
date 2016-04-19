'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var progress    = require('progress'),
    debug       = require('debug'),
    async       = require('async'),
    WebPageTest = require('webpagetest'),
    chalk       = require('chalk')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
debug = debug('budgie:wpt')

function validateResults(err, data) {
  return new Promise(function(resolve, reject) {
    if (err) {
      /* istanbul ignore if */
      if (err.error && err.error.code === 'TIMEOUT') {
        reject('Error: Test timed out.')
      } else {
        reject('Error: Test request failed - ' + (err.statusText))
      }

      return 1
    }

    /* istanbul ignore if */
    if (data.statusCode !== 200) {
      reject('Error: ' + data.statusText)
    }

    debug('Test Summary: ' + data.data.summary)

    var parsed = wpt.translateResults(data.data)
    resolve(parsed)
  })
}

var wpt = {
  translateResults: function(results) {
    debug('Converting WebPageTest results to common format')
    var average = 'median',
        view = 'firstView'

    var filtered = results[average][view]

    return {
      URL: results.url,
      summary: results.summary,
      loadTime: filtered.loadTime ? filtered.loadTime : '',
      TTFB: filtered.TTFB ? filtered.TTFB : '',
      bytesOut: filtered.bytesOut ? filtered.bytesOut : '',
      bytesOutDoc: filtered.bytesOutDoc ? filtered.bytesOutDoc : '',
      bytesIn: filtered.bytesIn ? filtered.bytesIn : '',
      bytesInDoc: filtered.bytesInDoc ? filtered.bytesInDoc : '',
      connections: filtered.connections ? filtered.connections : '',
      requestsFull: filtered.requestsFull ? filtered.requestsFull : '',
      requestsDoc: filtered.requestsDoc ? filtered.requestsDoc : '',
      requestsHTML: filtered.breakdown && filtered.breakdown.html ? filtered.breakdown.html : '',
      requestsJS: filtered.breakdown && filtered.breakdown.js ? filtered.breakdown.js : '',
      requestsCSS: filtered.breakdown && filtered.breakdown.css ? filtered.breakdown.css : '',
      requestsImage: filtered.breakdown && filtered.breakdown.image ? filtered.breakdown.image : '',
      requestsFlash: filtered.breakdown && filtered.breakdown.flash ? filtered.breakdown.flash : '',
      requestsFont: filtered.breakdown && filtered.breakdown.font ? filtered.breakdown.font : '',
      requestsOther: filtered.breakdown && filtered.breakdown.other ? filtered.breakdown.other : '',
      responses_200: filtered.responses_200 ? filtered.responses_200 : '',
      responses_404: filtered.responses_404 ? filtered.responses_404 : '',
      responses_other: filtered.responses_other ? filtered.responses_other : '',
      result: filtered.result ? filtered.result : '',
      render: filtered.render ? filtered.render : '',
      fullyLoaded: filtered.fullyLoaded ? filtered.fullyLoaded : '',
      cached: filtered.cached ? filtered.cached : '',
      docTime: filtered.docTime ? filtered.docTime : '',
      domTime: filtered.domTime ? filtered.domTime : '',
      score_cache: filtered.score_cache ? filtered.score_cache : '',
      score_cdn: filtered.score_cdn ? filtered.score_cdn : '',
      score_gzip: filtered.score_gzip ? filtered.score_gzip : '',
      score_cookies: filtered.score_cookies ? filtered.score_cookies : '',
      score_keepAlive: filtered['score_keep-alive'],
      score_minify: filtered.score_minify ? filtered.score_minify : '',
      score_combine: filtered.score_combine ? filtered.score_combine : '',
      score_compress: filtered.score_compress ? filtered.score_compress : '',
      score_etags: filtered.score_etags ? filtered.score_etags : '',
      score_progressive_jpeg: filtered.score_progressive_jpeg ? filtered.score_progressive_jpeg : '',
      gzip_total: filtered.gzip_total ? filtered.gzip_total : '',
      gzip_savings: filtered.gzip_savings ? filtered.gzip_savings : '',
      minify_total: filtered.minify_total ? filtered.minify_total : '',
      minify_savings: filtered.minify_savings ? filtered.minify_savings : '',
      image_total: filtered.image_total ? filtered.image_total : '',
      image_savings: filtered.image_savings ? filtered.image_savings : '',
      optimization_checked: filtered.optimization_checked ? filtered.optimization_checked : '',
      aft: filtered.aft ? filtered.aft : '',
      domElements: filtered.domElements ? filtered.domElements : '',
      pageSpeedVersion: filtered.pageSpeedVersion ? filtered.pageSpeedVersion : '',
      titleTime: filtered.titleTime ? filtered.titleTime : '',
      loadEventStart: filtered.loadEventStart ? filtered.loadEventStart : '',
      loadEventEnd: filtered.loadEventEnd ? filtered.loadEventEnd : '',
      domContentLoadedEventStart: filtered.domContentLoadedEventStart ? filtered.domContentLoadedEventStart : '',
      domContentLoadedEventEnd: filtered.domContentLoadedEventEnd ? filtered.domContentLoadedEventEnd : '',
      lastVisualChange: filtered.lastVisualChange ? filtered.lastVisualChange : '',
      SpeedIndex: filtered.SpeedIndex ? filtered.SpeedIndex : '',
      visualComplete: filtered.visualComplete ? filtered.visualComplete : '',
      firstPaint: filtered.firstPaint ? filtered.firstPaint : '',
      docCPUms: filtered.docCPUms ? filtered.docCPUms : '',
      fullyLoadedCPUms: filtered.fullyLoadedCPUms ? filtered.fullyLoadedCPUms : '',
      docCPUpct: filtered.docCPUpct ? filtered.docCPUpct : '',
      fullyLoadedCPUpct: filtered.fullyLoadedCPUpct ? filtered.fullyLoadedCPUpct : '',
      browser_process_count: filtered.browser_process_count ? filtered.browser_process_count : '',
      browser_main_memory_kb: filtered.browser_main_memory_kb ? filtered.browser_main_memory_kb : '',
      browser_other_private_memory_kb: filtered.browser_other_private_memory_kb ? filtered.browser_other_private_memory_kb : '',
      browser_working_set_kb: filtered.browser_working_set_kb ? filtered.browser_working_set_kb : '',
      effectiveBps: filtered.effectiveBps ? filtered.effectiveBps : '',
      effectiveBpsDoc: filtered.effectiveBpsDoc ? filtered.effectiveBpsDoc : ''
    }
  },

  getResults: function(opts) {
    var url = opts.competitors,
        key = opts.apiKey,
        timeout = opts.timeout,
        requestTest = new WebPageTest(opts.server, key),
        bar = new progress(chalk.bold.blue('[:bar] :elapsed Timeout at ' + timeout + 's'), { total: timeout * 10, width: 40, clear: true }),
        timer = setInterval(function () {
          bar.tick()
          if (bar.complete) {
            clearInterval(timer)
          }
        }, 100)

    var urls = [],
        processedResults = []

    if (typeof(url) === 'string') {
      urls.push(url)
    } else {
      urls = url
    }

    return new Promise(function(resolve, reject) {
      async.eachSeries(urls,
        function(site, done) {
          debug('Get WebPageTest results for: ' + site)
          bar = new progress(chalk.underline(site) + ': ' + chalk.bold.blue('[:bar] :elapsed Timeout at ' + timeout + 's'), { total: timeout * 10, width: 40, clear: true }),
          timer = setInterval(function () {
            bar.tick()
            if (bar.complete) {
              clearInterval(timer)
            }
          }, 100)
          requestTest.runTest(site,
            {
              pollResults: 5,
              timeout: timeout,
              breakDown: true,
              domains: true,
              requests: false,
              pageSpeed: true,
              runs: opts.runs,
              location: opts.location,
              connectivity: opts.connectivity,
              label: 'Budgie Test'
            },
            function (err, data) {
              bar.tick(timeout * 10)

              validateResults(err, data)
                .catch(function(err) {
                  done(err)
                })
                .then(function(validated){
                  processedResults.push(validated)
                  done()
                })
            }
          )
        },
        function(err) {
          if (err) {
            reject(err)
          }
          resolve(processedResults)
        }
      )
    })
  }
}

module.exports = wpt
