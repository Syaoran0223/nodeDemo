//app.js
const { log, api } = require('./utils/config.js')
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		// 登录
		wx.login({
			success: codeData => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				let code = {
					code: codeData.code
				}
				wx.request({
					url: api.openid,
					data: code,
					method: 'post',
					success: function (openidData) {
						log('openidData', openidData)
						wx.getSetting({
							success: res => {
								log('res', res)
								if (res.authSetting['scope.userInfo']) {
									// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
									wx.getUserInfo({
										success: ress => {
											let that = this
											console.log('ress', ress)
											let userInfo = ress.userInfo
											// 可以将 res 发送给后台解码出 unionId
											// that.globalData.userInfo = ress.userInfo
											wx.setStorageSync('userInfo', userInfo)
											// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
											// 所以此处加入 callback 以防止这种情况
											if (that.userInfoReadyCallback) {
												that.userInfoReadyCallback(ress)
											}
											// 保存openid
											userInfo.openid = openidData.data.openid
											log('new userInfo', userInfo)
											wx.request({
												url: api.userInfo,
												data: userInfo,
												method: 'post',
												success: (r) => {
													log('发送用户信息', r)
												}
											})
										}
									})
								}
							}
						})

					}
				})
			}
		})

		// 获取用户信息
		// wx.getSetting({
		//   success: res => {
		//     if (res.authSetting['scope.userInfo']) {
		//       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		//       wx.getUserInfo({
		//         success: res => {
		//           // 可以将 res 发送给后台解码出 unionId
		//           this.globalData.userInfo = res.userInfo

		//           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
		//           // 所以此处加入 callback 以防止这种情况
		//           if (this.userInfoReadyCallback) {
		//             this.userInfoReadyCallback(res)
		//           }
		//         }
		//       })
		//     }
		//   }
		// })
	},
	globalData: {
		userInfo: null
	}
})