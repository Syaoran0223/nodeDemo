const Model = require('./main')
const {log, now } = require('../utils/utils')
const table = 'wechatuser'
const wx = require('../db/wechatUser')

class WechatUser extends Model {
	constructor(form) {
		super()
		this.username = form.username || ''
		this.password = form.password || ''
		this.phone = form.phone || ''
		this.grade = form.grade || ''
		this.openid = form.openid || ''
		this.session = form.session || ''
		this.score = form.score || 0
		this.ct = now
		this.ut = now
	}
	static async FindByOpenid (form) {
		const u = await wx.findAll({
			where: {
				openid: form.openid,
			},
			raw: true
		})
		return u
	}
	// 初始化通过 openid 新增用户
	static async createByOpenid (form) {
		const u = await this.FindByOpenid(form)
		if (u.length == 0) {
			const userInit = super.create(form)
			const u = await wx.create(userInit)
			log(`${form.openid} 创建成功`)
			// return form.openid
			let result = {
				code: -1,
				msg: '新注册用户 需补全信息',
				openid: 'form.openid',
			}
			return result
		} else {
			log(`${form.openid} 已存在`)
			return {
				code: 0,
				msg: '成功',
				openid: form.openid,
			}
		}
	}

	// 更新用户信息
	static async update(form, openid) {
		// 根据 openid 找到用户 然后更新信息
		const u = await wx.find({
			where: {
				openid: form.openid
			}
		})
		log('update status', u)
		let list = ['nickName', 'avatarUrl']
		for(let f in form) {
			if(list.includes(f)) {
				log('xxxx f', f)
				log('debug f', form[f])
				log('debug uf', u[f])
				u[f] = form[f]
			}
		}


		await u.save()
		// 如何更新数据
	}
}

const  test = async () => {
	// const form = {
	// 	username: 'feng10',
	// 	password: '123',
	// }
	// const u = User.login(form)
	// const u = User.register(form)

}
if (require.main === module) {
	test()
}
module.exports = WechatUser