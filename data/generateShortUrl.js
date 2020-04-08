//載入 url model
const Url = require('../models/url')

let generateShortUrl = new Promise((resolve, reject) => {
  let shortUrl = 'localhost:3000/redirect/'

  // 產生亂數
  let combination = ''
  let i = 0
  while (i < 5) {
    let randomNum = Math.floor(Math.random() * 123) // 0-123

    if ((randomNum >= 48 && randomNum <= 57) || (randomNum >= 65 && randomNum <= 90) || (randomNum >= 97 && randomNum <= 122)) {
      console.log(randomNum)
      combination += String.fromCharCode(randomNum)
      i++
    }
  }
  shortUrl += combination
  Url.find({ shortenUrl: shortUrl })
    .lean()
    .exec((url) => {
      if (!url) {
        return resolve(shortUrl)
      }
      //如果重複再跑一次
      generateShortUrl
        .then(shortUrl => {
          return resolve(shortUrl)
        })
    })
})


module.exports = generateShortUrl