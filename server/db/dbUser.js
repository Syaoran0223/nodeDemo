const {Sequelize, sequelize} = require('./sequelize')
const DbUser = sequelize.define('user', {
		id: {
			autoIncrement: true,
			type: Sequelize.STRING(50),
			primaryKey: true,

		},
		username: Sequelize.STRING,
		password: Sequelize.STRING,
		phone: Sequelize.BIGINT,
		grade: Sequelize.BIGINT,
		openid: Sequelize.STRING,
		session: Sequelize.STRING,
		ct: Sequelize.DATE,
		ut: Sequelize.DATE,
		email: Sequelize.STRING,
	},
	{
		// 套路写法，避免自带的时间数据报错
		timestamps: false,
	})
const useRelate =  {
	userFind: async(form) => {
		// 查询
		let result = ''
		const u = await DbUser.findAll({
			where: {
				username: form.username,
			},
			raw: true
		})
		return u
	},
	userCreat: async function(form) {
		const that = this
		let result
		const exists = await this.userFind(form)
		if (exists.length == 0) {
			DbUser.create(form)
			result =  `${form.username}注册成功`
		} else {
			result =  `注册失败`
		}
		// console.log(`注册结果: ${form.username} ${result}`)
		return result
	},
	userLogin: async function(form) {

	}
}
const test = async() => {
	const form = {
		username: 'feng1',
		password: '123',
	}
	useRelate.userExists(form)
	// DbUser.create(form).then((p) => {
	// 	console.log('p', p)
	// })
	// const u = User.register(form)

}
if (require.main === module) {
	test()
}
const obj = {
	DbUser,
	useRelate,
}
 module.exports = obj

