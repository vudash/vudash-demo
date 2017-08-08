'use strict'

const got = require('got')
const moment = require('moment')
const { reach } = require('hoek')
const { Promise } = require('bluebird')

class CryptocompareDatasource {

  constructor (options) {
    this.symbols = options.symbols
  }

  getTimestamp (daysAgo) {
    return moment().subtract(daysAgo, 'days').unix()
  }

  getUrlsForSymbol (symbol) {
    return Promise.map([7,6,5,4,3,2,1], daysAgo => {
      const timestamp = this.getTimestamp(daysAgo)
      return this.getPriceUrl(symbol, timestamp)
    })
  }

  getData (symbol) {
    const reqs = this.getUrlsForSymbol(symbol)

    return Promise.map(reqs, url => {
      return got(url, { json: true })
      .then(({ body }) => {
        return reach(body, `${symbol}.GBP`)
      })
    })
  }

  getPriceUrl (symbol, ts) {
    return `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${symbol}&tsyms=GBP&ts=${ts}`
  }

  fetch () {
    return Promise.reduce(this.symbols, (curr, symbol) => {
      return this.getData(symbol)
        .then((history) => {
          curr[symbol] = history
          return curr
        })
    }, {})
  }
}

exports.register = function (engine) {
  engine.contributeDatasource(CryptocompareDatasource)
}