const log = console.log.bind(console, '>>>>')
// const host = 'http://www.syaoran.cc:3555/wx'
// const host = 'http://127.0.0.1:3555/wx'
const host = 'http://192.168.1.124:3555/wx'
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
}