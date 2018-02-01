const mysql = require('mysql')
const pool = {
	// connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '123',
	database: 'test',
	// debug: true,
}

module.exports = pool