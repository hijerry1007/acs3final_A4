const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')



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

app.get('/', (req, res) => {
  res.send('hi')
})

app.listen(port, () => {
  console.log(`app is running on port:${port}`)
})