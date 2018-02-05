const {io} = require('../app')
class socketRoom {
	constructor(index, io, s) {
		this.index = index
		console.log('io',io)
		console.log('s', s)
	}
	static createRoom(index,io, s) {
		console.log('createRoom', index)
		s.on(index, function(data) {
			s.join(index, ()=> {
				console.log('执行了')
				io.to(index).emit(index, `这里是来自${index}的信息`)
				io.to(index).on(index, (res) => {
					console.log('自动添加的问题')
				})
			})
		})
	}
	static test(s) {
		console.log('s', s)
	}
}

module.exports = socketRoom