const crypto = require('crypto')

const Model = require('./main')
const { secretKey } = require('../utils/utils')

class Session extends Model {
	constructor(form={}) {
		super()
		this.key = secretKey
		this.algorithm = 'aes-256-cbc'
		this.input = 'utf8'
		this.output = 'hex'
		this.content = form
	}

	decrypt(c) {
		var decipher = crypto.createDecipher(this.algorithm, secretKey)
		var d = decipher.update(c, this.output, this.input)
		d += decipher.final(this.input)
		const r = JSON.parse(d)
		return r
	}

	encrypt(form) {
		const s = JSON.stringify(form)
		const cipher = crypto.createCipher(this.algorithm, secretKey)
		let c = cipher.update(s, this.input, this.output)
		c += cipher.final(this.output)
		return c
	}
}

const session = new Session()


module.exports = session