const _ = require('lodash')
const {log} = require('../utils/utils')

class UserList {
	constructor(form) {
		this.userList = [
			{
				username: '小红',
				userId: 'OeyI9UQen-7wQ9bgAAAB',
			},
			{
				username: '老王',
				userId: 'OeyI9UQen-7wQ9bgAAAB',
			},
			{
				username: '小明',
				userId: 'TnJbXN8j2hn3dK8fAAAC',
			}]
		// this.userList = []
	}

	// 随机
	randomInt(min, max) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	// 增加用户
	addUser(form) {
		this.userList.push(form)
	}

	// 删除用户「用户断开是使用」
	removeUser(form) {
		let userList = this.userList
		_.remove(userList, form)
	}

	// 查找列表中的其他用户「可对战列表」
	findUser(form) {
		let newList = this.userList.filter(function(u) {
			return u.username !== form.username
		})
		// 随机返回一个用户
		let length = newList.length
		let index = this.randomInt(0, length)
		return newList[index]

	}
}

const userList = new UserList()
module.exports = userList
const test = () => {
	let form = {
		username: '小明',
		userId: 'TnJbXN8j2hn3dK8fAAAC',
	}
	let u = userList.findUser(form)

}
if (require.main === module) {
	test()
}