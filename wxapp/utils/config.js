const log = console.log.bind(console, '>>>>')
const host = '45.77.28.242'
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