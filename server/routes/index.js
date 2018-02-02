// 这里是把 express.Router 的实例赋值给 index
const express = require('express')
const index = express.Router()
// const User = require('../models/user')
const {log} = require('../utils/utils')
index.get('/', (request, response) => {
	// 通过 session 获取当前用户 显示用户昵称
	// 如果没登录则显示游客
	response.render('index/index.html')
})
index.post('/login', async (request, response) => {
	const form = request.body
	log('login form', form)
	const r =  await User.login(form)
	log('result', r)
	// response.send('登录成功')
})

module.exports = index