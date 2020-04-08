// 設定資料庫
const db = require('../models')
const Url = db.OriginalUrl
const { Op } = require("sequelize");

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
  console.log(shortUrl)
  Url.findAll({ where: { shortenUrl: shortUrl } })
    .then((url) => {
      if (url) {
        //如果重複再跑一次
        generateShortUrl
          .then(shortUrl => {
            return resolve(shortUrl)
          })
      }

      return resolve(shortUrl)

    })

})


module.exports = generateShortUrl