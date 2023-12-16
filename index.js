const crayon = require('tiny-crayon')
const reduceUA = require('reduce-user-agent')

const DATE = { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }

module.exports = function (opts = {}) {
  return async function (req, res, next) {
    if (opts.enable === false) {
      next()
      return
    }

    let remoteAddress = null
    const country = opts.cloudflare && req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : ''

    if (opts.trustProxy) remoteAddress = (req.headers['x-forwarded-for'] || '').split(',').shift()
    else remoteAddress = req.connection.remoteAddress

    remoteAddress = trim(remoteAddress)

    if (opts.ignoreIPs && opts.ignoreIPs.indexOf(remoteAddress) > -1) {
      next()
      return
    }

    if (opts.ignoreURLs && opts.ignoreURLs.find(url => req.url.startsWith(url))) {
      next()
      return
    }

    const o = crayon.gray(crayon.bold('['))
    const c = crayon.gray(crayon.bold(']'))

    const log = [
      '- Request',
      o + crayon.white((new Date().toLocaleString(opts.locale || 'en-GB', DATE))) + c,
      o + crayon.yellow(remoteAddress) + (country ? ' ' + crayon.gray(country) : '') + c,
      o + crayon.cyan(req.method), crayon.green(req.url) + c
    ]

    if (opts.headers) log.push(req.headers)
    if (opts.body) log.push(req.body)
    if (opts.userAgent !== false) log.push(crayon.gray(reduceUA(req.headers['user-agent'])))

    console.log(...log)

    next()
  }
}

function trim (addr) {
  if (addr.startsWith('::ffff:')) addr = addr.slice(7)
  return addr
}
