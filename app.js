const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const generateShortUrl = require('./data/generateShortUrl.js')



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

// 首頁
app.get('/', (req, res) => {
  res.render('index')
})

// 新增一個縮網址
app.post('/urls', (req, res) => {
  // 要求網址格式
  console.log(req.body.originUrl)
  Url.find({ originUrl: req.body.originUrl })
    .lean()
    .exec((err, url) => {
      if (err) return console.error(err)

      if (!url) {
        generateShortUrl
          .then(shortUrl => {
            console.log(shortUrl)
            let url = shortUrl
            Url.create({
              originUrl: req.body.originUrl,
              shortenUrl: url
            })

            return res.render('index', { shortenUrl: url })
          })
          .catch(error => console.log('錯誤訊息', error))
      }
      else {
        return res.render('index', { shortenUrl: url.shortenUrl })
      }
    })
})

// 利用縮網址轉址
app.get('/redirect/:url', (req, res) => {
  console.log(req.params.url)
  let short_url = 'localhost:3000/redirect/'
  short_url += req.params.url
  console.log(short_url)
  if (req.params.url !== '/favicon.ico') {
    Url.find({ shortenUrl: short_url })
      .lean()
      .exec((err, url) => {
        if (err) return console.error(err)

        return res.redirect(`${url.originUrl}`)
      })
  }
})


app.listen(port, () => {
  console.log(`app is running on port:${port}`)
})