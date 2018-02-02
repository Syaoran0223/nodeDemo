const {Sequelize, sequelize} = require('./sequelize')
const wechatUser = sequelize.define('wechatuser', {
		id: {
			autoIncrement: true,
			type: Sequelize.STRING(50),
			primaryKey: true,

		},
		nickName: Sequelize.STRING,
		// password: Sequelize.STRING,
		phone: Sequelize.BIGINT,
		openid: Sequelize.STRING,
		session: Sequelize.STRING,
		ct: Sequelize.DATE,
		ut: Sequelize.DATE,
		email: Sequelize.STRING,
		avatarUrl: Sequelize.STRING,
	},
	{
		// 套路写法，避免自带的时间数据报错
		timestamps: false,
	})

const test = async() => {


}
if (require.main === module) {
	test()
}

 module.exports = wechatUser

