# Shorten URL WEB Application

由Node.js, express及MongoDB&Mongoose 打造而成的縮網址網頁工具

## 預覽

### 登入首頁

![image](https://github.com/hijerry1007/myAccount/blob/master/photos/login.png)

### 首頁

![image](https://github.com/hijerry1007/myAccount/blob/master/photos/homepage.png)


## 需求
Node.js
MongoDB

## 套件
此專案使用到以下JS-library，請使用npm I 指令安裝:
express
express-handblebars
body-parser
methodoverride
express-session
passport
passport-local
passport-facebook
bcryptjs
connect-flash
handlebars-helpers
handlebars
mongoose

## 安裝

1. 打開你的Termianl，複製此專案至本機電腦 
2. 開啟終端機，進入存放此專案的資料夾myAccount
3. 在Terminal輸入npm install指令安裝所需的套件

## 設定與執行

1.	此專案有使用Facebook API，請至Facebook developer設定一個網頁應用程式，並於根目錄建立一個.env把以下資訊填入:
// .env
FACEBOOK_ID=xxxxxxxx
FACEBOOK_SECRET=xxxxxxxx
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
2.	請開啟MYSQL WORKBENCH，依以下指令建立資料庫
drop database if exists myAccount;
create database myAccount;
3.	輸入以下指令建立專案所需資料庫的資料表及欄位
npx sequelize db:migrate
4.	輸入npm run seeder 建立種子檔案
5. Termianl輸入 npm run dev指令
6. 輸入本機地址localhost:3000 即可瀏覽

## 功能列表

開放帳戶註冊
可使用Facebook帳號連結

使用者可自行新增自己的支出項目並計算支出總金額

目前類別為五種: 家居物業/運輸交通/休閒娛樂/餐飲食品/其他
搜尋: 可依據時間或分類搜尋支出項目
