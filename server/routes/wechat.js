// 这里是把 express.Router 的实例赋值给 index
const express = require('express')
const route = express.Router()
const User = require('../models/user')
const {log} = require('../utils/utils')
const request = require('request')
route.get('/', (request, response) => {
	// 通过 session 获取当前用户 显示用户昵称
	// 如果没登录则显示游客
	response.render('index/index.html')
})
route.post('/login', (req, res) => {
	const form = req.body
	log('code', form)
	res.send(form)

})

route.post('/test', (req, res) => {
	const form = req.body
	log('test', form)
	res.send('success')
})
module.exports = route