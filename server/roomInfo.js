const fs = require('fs')
const {log} = require('./utils/utils')
const _ = require('lodash')
class RoomInfo {
	constructor(user1, user2) {
		this.path = './roominfodb.js'
		this.room = this.load()
		this.roomNameBase = 'group'
		this.index = 0
	}

	load() {
		const data = fs.readFileSync(this.path)
		const d = JSON.parse(data)
		return d
	}
	length() {
		let room = this.load()
		let l = []
		for(let r in room) {
			l.push(r)
		}
		return l.length
	}
	save(data) {
		let saveData = JSON.stringify(data, null, 2)
		fs.writeFileSync(this.path, saveData)
	}
	createRoom(user1, user2) {
		let room = this.load()
		let includeStatus = false
		let s = _.find(room, function(o) {
			o.forEach((a) => {
				if(a.username == user1.username || a.username == user2.username) {
					includeStatus = true
				}
			})

		})
		// if(includeStatus == true) {
		// 	log('用户已在房间内')
		// 	return false
		// }
		let o = []
		log('user1', user1)
		log('user2', user2)
		o.push(user1)
		o.push(user2)
		// 得到房间号
		let index = this.length()
		let roomName = `${this.roomNameBase}${index}`
		room[roomName] = o
		// 将用户添加进房间列表 方便检查当前房间有多少用户
		// room[roomName] = l
		this.save(room)
		// 返回房间号
		return roomName
	}
	findRoom(roomName) {
		let room = this.load()
		let roomInfo = room[roomName]
		let length = roomInfo.length
		let users = roomInfo.map((r) => {
			return r.username
		})
		log(`房间内有${length}人, 「${users[0]},${users[1]}」`)
	}
}
const test = () => {
	const roomInfo = new RoomInfo()
	let form = {
		username: '小明1',
		userId: 'TnJbXN8j2hn3dK8fAAAC',
		status: false,
	}
	let form1 = {
		username: '小明2',
		userId: 'TnJbXN8j2hn3dK8fAAAC',
		status: false,
	}
	let s = roomInfo.length()
	// let s = roomInfo.load()
	// roomInfo.findRoom('group0')
	// log('s', s)
}
if (require.main === module) {
	test()
}
module.exports = RoomInfo