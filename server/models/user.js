const Model = require('./main')
const {log, now } = require('../utils/utils')
const table = 'users'
const db = require('../db/dbUser')

class User extends Model{
	constructor(form={}) {
		super()
		this.username = form.username
		this.password = form.password
		this.phone = form.phone || ''
		this.grade = form.grade || ''
		this.openid = form.openid || ''
		this.session = form.session || ''
		this.score = form.score || 0
	}
	static register (form) {
		const u = super.create(form)
		db.useRelate.userCreat(form)
	}
	static async login(form) {
		const dbuser = await db.useRelate.userFind(form)
		// 得到的 dbuser 是实例 取不到值 待解决
		// dbuser = [ user { username: 'xxxx', ....}]
		const u = JSON.parse(JSON.stringify(dbuser))
		let result = '没结果'
		if(u.length > 0) {
			const userLogic = form.username == u[0].username
			const pwdLogic = form.password == u[0].password
			const login =  userLogic && pwdLogic
			if (login == true) {
				result = '登录成功'
			} else {
				result = '登录失败,密码错误'
			}
		} else {
			result =  '登录失败,帐号不存在'
		}
		return result
	}
	static async currentUser (form) {
		// 通过 session 获取 uid, 如果没有的话就设置成空字符串
		// 如何设置 session
	}
}

const  test = async () => {
	const form = {
		username: 'feng0',
		password: '123',
	}
	const u = User.login(form)

}
if (require.main === module) {
	test()
}
module.exports = User