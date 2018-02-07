const log = console.log.bind(console, '>>>>')
// 服务器 ajax 地址
// const host = 'http://45.77.28.242:3555/wx'
// const host = 'http://127.0.0.1:3555/wx'
const host = 'http://192.168.1.125:3666/wx'

// socket 测试地址
const socketUrl = "ws://192.168.1.125:3666"
// const socketUrl = "ws://45.77.28.242:3555"

// 返回完成api链接
const apiUrl = function (url) {
	var result = host + url
	return result
}
const api = {
	openid: apiUrl('/openid'),
	userInfo: apiUrl('/userInfo'),
}
const ajax = (api, data, method = 'post', callback )=> {
	wx.request({
		url: api,
		data: data,
		method: method,
		header: {
			'content-type': 'application/json' // 默认值
		},
		success: function (res) {
			console.log(`${api}`, res)
			callback()
		}
	})
}

module.exports = {
	log,
	api,
	ajax,
	socketUrl,
}