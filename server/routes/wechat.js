// 这里是把 express.Router 的实例赋值给 index
const express = require('express')
const wx = express.Router()
const wechatUser = require('../models/wechatUser')
const {log} = require('../utils/utils')
const request = require('request')

const {appId, appSecret} = require('../config')

// 封装 request promise
const rp = (option) => {
	return new Promise(function(resolve, reject) {
		request(option, function(error, response, body) {
			if(error) {
				console.log('request 报错了')
				reject(error)
			} else {
				resolve(JSON.parse(body))
			}
		})
	})
}

wx.get('/', (request, response) => {
	// 通过 session 获取当前用户 显示用户昵称
	// 如果没登录则显示游客
	response.render('index/index.html')
})

wx.post('/openid', async(req, res) => {
	const code = req.body.code
	const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
	const openidForm = {
		url,
		data: code,
		method: 'get'
	}
	// 获取 openid
	const openidData = await rp(openidForm)
	const openid = openidData.openid
	// 获取用户信息 之后处理
	const sendData = {
		openid,
	}
	// 保存 openid
	const reuslt =  await wechatUser.createByOpenid(sendData)
	res.send(reuslt)
})
//通过openid 查询更新用户信息
wx.post('/userInfo', async (req, res) => {
	const form = req.body
	const u = await wechatUser.update(form)
	res.send('success')
})
module.exports = wx