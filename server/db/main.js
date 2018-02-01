// 引入数据库连接
const {pool} = require('./config')
const {log} = require('../utils/utils')
const query = (sql, data) => {
	return new Promise(function(resolve, reject) {
		pool.query(sql, data, function(err, result) {
			if (err) {
				log('err', err)
				reject('err', err)
			} else {
				log('success', result)
				resolve(result)
			}
		})
	})
}

// 查找
const sqlFind = async(condition = '*', data = '', table = 'todos') => {
	const sql = `select ${condition} = ? from ${table}`
	log('find sql', sql)
	const r = await query(sql, data)
	return r
}

// 增加 辅助
const formatAdd = (form, table) => {
	let o = {
		key: '',
		value: '',
	}
	o.key = String(Object.keys(form))
	let val = Object.values(form)
	for (var i = 0; i < val.length; i++) {
		var v = val[i]
		o.value += `'${v}',`
	}
	o.value = o.value.slice(0, -1)
	const sql = `INSERT INTO ${table}(${o.key}) VALUES(${o.value})`
	return sql
}

// 增加
const sqlAddOne = async(form, table = 'todos') => {
	const sql = formatAdd(form, table)
	log('sql', sql)
	// const sql = `INSERT INTO todos(title, completed) VALUES('todo_demo111', 1)`
	pool.query(sql, (err, result) => {
		if(err) {
			log('err', err)
		} else {
			log('result', result)
		}
	})
}

// 更新 - 辅助
const formatUpdate = (formUpdate) => {
	let keys = Object.keys(formUpdate)
	let value = Object.values(formUpdate)
	let set = `${keys[0]} = ?`
	let o = {
		id: 'id = ?',
		set: set,
		data: value,
	}
	return o
}

// 更新 待优化
const sqlUpdateById = async(form, table = 'todos') => {
	const condition = formatUpdate(form)
	const sql = `UPDATE ${table} SET ${condition.set} WHERE ${condition.id}`
	let data = condition.data
	pool.query(sql, data)
}

// 删除 辅助
const formatDelete = (form, table) => {
	let keys = Object.keys(form)
	let value = form[keys]
	const sql = `DELETE FROM ${table} WHERE ${keys} = '${form[keys]}'`
	log('sql', sql)
	return sql
}

// 删除
const sqlDelete = async(form, table = 'todos') => {
	const sql = formatDelete(form, table)
	pool.query(sql, function(err, result) {
		if (err) {
			log(err)
		}
	})
}

// 测试
const test = async() => {
	// 查询
	const s = await sqlFind('title')
	log('s', s)

	// // 增加
	const formAdd = {
		title: 'add new todo',
		completed: false,
	}
	// sqlAddOne(formAdd)

	// 更新
	const formUpdate = {
		title: 'edit todo',
		id: 2,
	}
	// sqlUpdateById(formUpdate)
	// 删除
	const formDelete = {
		id: '2',
	}
	// sqlDelete(formDelete)
}

if (require.main === module) {
	test()
}


module.exports = {
	query,
	sqlFind,
	sqlAddOne,
	sqlDelete,
	sqlUpdateById,
}

