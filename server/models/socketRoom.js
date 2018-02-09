const {io, roomInfo} = require('../appTest')
const {log } = require('../utils/utils')
const questionList = require('../questionsdb')

class SocketRoom {
	constructor(index, io, s) {
		this.index = index
		console.log('io', io)
		console.log('s', s)
	}
	// 返回随机输
	static randomInt(min, max) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	}
	// 根据题库长度随机返回题目
	static radomQuestion() {
		const length = questionList.length - 1
		const index = this.randomInt(0, length)
		const question = questionList[index]
		return question
	}
	static createRoom(index, io, s) {
		console.log('createRoom', index, typeof(index))
		// let roomId = index
		const that = this
		// 双方答题状态 获取双方信息
		// const users = roomInfo[index]
		log('users', roomInfo, index)
		// 进入房间 并确发送第一题
		s.on(index, function(data) {
			s.join(index, () => {
				io.to(index).emit(index, `已经进入${index}`)
				let q = that.radomQuestion()
				io.to(index).emit(index, q)
			})
		})


	}

	static test(s) {
		console.log('s', s)
	}

	static create(form) {
		return new this(form)
	}
}

module.exports = SocketRoom