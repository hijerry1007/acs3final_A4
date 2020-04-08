const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  originUrl: {
    type: String
  },
  shortenUrl: {
    type: String
  }
})

module.exports = mongoose.model('Url', urlSchema)
