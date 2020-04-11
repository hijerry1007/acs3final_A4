const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const generateShortUrl = require('./data/generateShortUrl.js')
const flash = require('connect-flash')


// 設定資料庫
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Url', { useNewUrlParser: true, useUnifiedTopology: true })   // 設定連線到 mongoDB

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//載入 url model
const Url = require('./models/url')


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(flash())

// 首頁
app.get('/', (req, res) => {
  res.render('index')
})

// 新增一個縮網址
app.post('/urls', (req, res) => {
  // 要求網址格式
  let regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  if (regexp.test(req.body.originUrl)) {
    Url.find({ originUrl: req.body.originUrl })
      .lean()
      .exec((err, url) => {
        if (err) return console.error(err)

        if (Object.keys(url).length === 0) {
          generateShortUrl
            .then((shortUrl) => {
              console.log(shortUrl)
              const url = new Url({
                originUrl: req.body.originUrl,
                shortenUrl: shortUrl
              })

              url.save(err => {
                if (err) return console.error(err)
                return res.render('index', { shortenUrl: shortUrl })
              })
            })
            .catch(error => console.log('錯誤訊息', error))
        }
        else {

          let s_Url = url[0].shortenUrl
          return res.render('index', { shortenUrl: s_Url })
        }

      })
  } else {
    let errors = [];
    errors.push({ message: '網址形式有誤!請重新輸入!' })
    if (errors.length > 0) {
      res.render('index', {
        errors
      })
    }
  }

})

// 利用縮網址轉址
app.get('/redirect/:url', (req, res) => {
  // console.log(req.params)
  let short_url = 'localhost:3000/redirect/'
  short_url += req.params.url
  // console.log(short_url)
  if (req.params.url !== '/favicon.ico') {
    Url.find({ shortenUrl: short_url })
      .lean()
      .exec((err, url) => {
        if (err) return console.error(err)
        let o_Url = url[0].originUrl
        return res.redirect(`${o_Url}`)
      })
  }
})


app.listen(port, () => {
  console.log(`app is running on port:${port}`)
})