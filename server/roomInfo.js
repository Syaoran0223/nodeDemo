const fs = require('fs')
const {log} = require('./utils/utils')
class RoomInfo {
	constructor(user1, user2) {
		this.path = './roominfodb.js'
		this.room = this.load()
		this.roomNameBase = 'group'
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
	createRoom(user1, user2) {
		let room = this.load()
		let l = []
		l.push(user1)
		l.push(user2)
		// 得到房间号
		let roomName = `${this.roomNameBase}${room.length}`
		// 将用户添加进房间列表 方便检查当前房间有多少用户
		room[roomName] = l
		this.save(room)
		// 返回房间号
		return roomName
	}
}
const test = () => {
	const roomInfo = new RoomInfo()
	let form = {
		username: '小明1',
		userId: 'TnJbXN8j2hn3dK8fAAAC',
		status: false,
	}
	let s = roomInfo.createRoom()
	log('s', s)
}
if (require.main === module) {
	test()
}
module.exports = RoomInfo