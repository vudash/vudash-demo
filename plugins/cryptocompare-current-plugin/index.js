'use strict'

const got = require('got')
const moment = require('moment')
const { reach } = require('hoek')
const { Promise } = require('bluebird')

class CryptocompareCurrentDatasource {

  constructor (options) {
    this.symbol = options.symbol
    this.history = []
  }

  getData () {
    return got(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${this.symbol}&tsyms=GBP`,
      { json: true }
    )
  }

  fetch () {
    return this.getData()
    .then(({ body }) => {
      const price = reach(body, `RAW.${this.symbol}.GBP.PRICE`)

      if (this.history.length > 50) {
        this.history.shift()
      }
      this.history.push(price)

      return this.history
    })
  }
}

exports.register = function (options) {
  return new CryptocompareCurrentDatasource(options)
}
