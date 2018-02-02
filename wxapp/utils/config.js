const log = console.log.bind(console, '>>>>')
const host = 'http://127.0.0.1:4000'
const apiUrl = function (url) {
	var result = host + url
	return result
}
const api = {
	login: apiUrl('/wx/login')

}

module.exports = {
	log,
	api,
}