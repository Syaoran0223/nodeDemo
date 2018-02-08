const _ = require('lodash')
const {log} = require('./utils/utils')
const fs = require('fs')


class UserList {
	constructor(form) {
		this.path = './userlistdb.js'
		this.list = this.load()
	}

	load() {
		const data = fs.readFileSync(this.path)
		const d = JSON.parse(data)
		return d
	}

	save(data) {
		let saveData = JSON.stringify(data, null, 2)
		fs.writeFileSync(this.path, saveData)
	}

	// 随机
	randomInt(min, max) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	// 增加用户
	addUser(form) {
		log('addUser form', form)
		let newList = this.load()
		let r = true
		for (var i = 0; i < newList.length; i++) {
			var l = newList[i]
			if (l.username == form.username || form.username == null) {
				log(`addUser 用户：${form.username}，已存在`)
				r = false
			}
		}
		if (r == false ) {
			return
		} else {
			newList.push(form)
			this.save(newList)
		}
	}

	// 删除用户「用户断开是使用」
	removeUser(form) {
		let list = this.load()
		_.remove(list, form)
		this.save(list)

	}

	// 查找列表中的其他用户「可对战列表」
	findUser(form) {
		let list = this.load()
		let newList = list.filter(function(u) {
			let usernameLoigc = u.username !== form.username
			let userStatuc = u.waitStatus == true
			// let userStatuc = true
			if (usernameLoigc && userStatuc) {
				return u
			}
		})
		// 随机返回一个用户
		let length = newList.length - 1
		let index = this.randomInt(0, length)
		log( 'index', index, '查找的结果', newList[index])
		return newList[index]
	}
	// 查找自己
	findSelf(form) {
		let list = this.load()
		let r = false
		for (var i = 0; i < list.length; i++) {
			var l = list[i]
			if(l.username == form.username) {
				r = true
			}
		}
		return r
	}
	ready(form) {
		let list = this.load()
		let newList = list.map((e)=> {
			if(e.username == form.username) {
				// e.waitStatus = false
				e.ready = true

			}
			return e
		})
		this.save(newList)
	}
	cancel(form) {
		let list = this.load()
		//初始化 返回[]则返回
		if(list.length == 0 ) {
			log('cancel list empt', list)
			return
		}
		let newList = list.map((e)=> {
			if(e.username == form.username) {
				e.waitStatus = false
				log('更改了准备状态 waitStatus', e)
			}
			return e
		})
		this.save(newList)
	}
	cancelAll(form) {
		let list = this.load()
		let newList = list.map((e)=> {
			// if(e.username == form.username) {
				e.waitStatus = false
			// }
			return e
		})
		this.save(newList)
	}
	log() {
		log('检查当前列表', this.load())
	}
}

const userList = new UserList()
const test = () => {
	let form = {
		username: '小明1',
		userId: 'TnJbXN8j2hn3dK8fAAAC',
		waitStatus: false,
	}
	// userList.ready()
	// userList.removeUser(form)
	// log('u', userList.load())
}
if (require.main === module) {
	test()
}
module.exports = UserList