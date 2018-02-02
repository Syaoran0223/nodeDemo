const log = console.log.bind(console, '>>>>')
const host = 'http://www.syaoran.cc/wx'
const apiUrl = function (url) {
	var result = host + url
	return result
}
const api = {
	login: apiUrl('/login'),
	test: apiUrl('/test')


}

module.exports = {
	log,
	api,
}