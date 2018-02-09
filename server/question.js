const fs = require('fs')
class Question {
	constructor(index) {
		this.path = './questionsdb.js'
	}
	static load() {
		const data = fs.readFileSync('./questionsdb.js', 'utf-8')
		const d = JSON.parse(data)
		return d
	}

	static save(data) {
		let saveData = JSON.stringify(data, null, 2)
		fs.writeFileSync(this.path, saveData)
	}
	// 随机
	static randomInt(min, max) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	}
	static randomQuestion() {
		let q = this.load()
		let length = q.length -1
		let index = this.randomInt(0, length)
		return q[index]
	}
}

module.exports = Question