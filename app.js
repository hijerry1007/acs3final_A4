const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')


// 設定資料庫
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Url', { useNewUrlParser: true, useUnifiedTopology: true })   // 設定連線到 mongoDB

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

app.get('/favicon.ico', (req, res) => {
  res.redirect('/')
})

// 新增一個縮網址
app.post('/', (req, res) => {
  // 要求網址格式

  let regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  if (regexp.test(req.body.originUrl)) {
    Url.find({ originUrl: req.body.originUrl })
      .lean()
      .exec((err, url) => {
        if (err) return console.error(err)

        if (Object.keys(url).length === 0) {
          let error = false

          let generateShortUrl = new Promise((resolve, reject) => {
            setTimeout(() => {
              if (error) {
                return reject('error happened')
              }

              let shortUrl = ''
              let combination = ''
              let i = 0
              // 產生亂數
              while (i < 5) {
                let randomNum = Math.floor(Math.random() * 123) // 0-123

                if ((randomNum >= 48 && randomNum <= 57) || (randomNum >= 65 && randomNum <= 90) || (randomNum >= 97 && randomNum <= 122)) {

                  combination += String.fromCharCode(randomNum)
                  i++
                }
              }
              shortUrl += combination

              Url.find({ shortenUrl: shortUrl })
                .lean()
                .exec((url) => {
                  console.log(url)
                  if (!url) {
                    console.log(1)
                    console.log(shortUrl)
                    return resolve(shortUrl)
                  }
                  //如果重複再跑一次 防止重複的網址出現
                  generateShortUrl
                    .then(shortUrl => {
                      console.log(2)
                      console.log(shortUrl)
                      return resolve(shortUrl)
                    })
                })
            }, 100)

          })

          generateShortUrl
            .then((shortUrl) => {
              console.log(shortUrl)
              const newUrl = new Url({
                originUrl: req.body.originUrl,
                shortenUrl: shortUrl
              });

              newUrl.save(err => {
                if (err) return console.error(err)
                return res.render('index', { shortenUrl: shortUrl })
              });
            })
            .catch(error => console.log('錯誤訊息', error))
        }
        else {
          let s_Url = url[0].shortenUrl
          return res.render('index', { shortenUrl: s_Url })
        }

      })
  } else {
    // 沒有輸入要提示使用者輸入
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
app.get('/:url', (req, res) => {
  console.log(req.params.url)
  if (req.params.url === '') {
    res.redirect('/')
  }
  else {
    let short_url = req.params.url

    if (req.params.url !== '/favicon.ico') {
      Url.find({ shortenUrl: short_url })
        .lean()
        .exec((err, url) => {
          if (err) return console.error(err)

          if (Object.keys(url).length === 0) {

            let errors = [];
            errors.push({
              message: 'Your page is not found'
            })
            if (errors.length > 0) {
              res.render('index', {
                errors
              })
            }
          }
          else {
            let o_Url = url[0].originUrl
            return res.redirect(`${o_Url}`)
          }

        })
    }
  }

})




app.listen(process.env.PORT || port, () => {
  console.log(`app is running on port:${port}`)
})