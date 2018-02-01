const { log} = require('../utils/utils')
class Model {
	constructor() {

	}
	static create(form) {
		return  new this(form)
	}
}

module.exports = Model