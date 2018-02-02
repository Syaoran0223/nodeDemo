const log = console.log.bind(console, '>>>>')
const now = Date.now()
log('now', now)
module.exports = {
	log,
	now,
}