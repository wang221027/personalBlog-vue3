// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')
// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
	// 定义查询分类列表数据的 SQL 语句，使用 LIMIT 10 限制结果数量
	const sql = `SELECT * FROM ev_article_cate;`
	// 调用 db.query() 执行 SQL 语句
	db.query(sql, (err, results) => {
		if (err) {
			return res.cc(err)
		}
		res.send({
			status: 0,
			message: '获取文章分类数据成功！',
			data: results,
		})
	})
}
exports.getTitle = (req, res) => {
	// 获取列表上传的图片地址
	const sql = 'select * from new_table';
	db.query(sql, (err, results) => {
		if (err) return res.cc(err, 1)
		res.send({
			status: 0,
			message: '获取列表上传图片成功！',
			data: results
		})
	})
}
// 根据文章id获取文章列表
exports.getList = (req, res) => {
	// 获取列表上传的图片地址
	const sql = 'select * from ev_article_cate where id=?';
	db.query(sql, req.body.id, (err, results) => {
		if (err) return res.cc(err, 1)
		res.send({
			status: 0,
			message: '获取列表上传图片成功！',
			data: results
		})
	})
}

// 根据id更新文章列表
exports.upArticle = (req, res) => {
	const date = new Date();
	const formattedDate =
		`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
	const strForm = JSON.stringify(formattedDate)
	const data = {
		name: req.body.name,
		alias: req.body.alias,
		type: req.body.type,
		time: strForm,
	}
	// 定义更新文章分类的 SQL 语句
	const sql =
		`update ev_article_cate set name='${data.name}', alias='${data.alias}', type='${data.type}', time='${data.time}' where id=?`
	// 执行更新文章分类的 SQL 语句
	db.query(sql, req.body.id, (err, results) => {
		if (err) {
			return res.cc(err)
		}
		if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
		res.send({
			message: '更新文章分类成功！',
			status: 0
		})
	})
}
// 根据id更新封面url
exports.updateAvatar = (req, res) => {
	const upAvatar = `update new_table set title_url='',file='del' where id=?`;
	db.query(upAvatar, req.body.id, (err, results) => {
		if (err) {
			console.log('err', err.message);
			return res.cc(err);
		}
		res.send({
			message: '更新封面成功！',
			status: 0,
		});
	});
};
// 根据id获取用户姓名
exports.reqUserMessage = (req, res) => {
	const sql = 'select * from ev_article_cate where id=?';
	db.query(sql, req.body.id, (err, results) => {
		if (err) return res.cc(err, 1)
		res.send({
			status: 0,
			message: '获取用户姓名成功！',
			data: results
		})
	})
};
// 根据id获取用户头像url
exports.reqUserMessage2 = (req, res) => {
	console.log(req.body.id);
	const sql = 'select * from avatars where id=?';
	db.query(sql, req.body.id, (err, results) => {
		console.log(results);
		if (err) return res.cc(err, 1)
		res.send({
			status: 0,
			message: '获取用户头像URL成功！',
			data: results
		})
	})
};
// 注册新用户的处理函数
exports.regUser = (req, res) => {
	// 获取客户端提交到服务器的用户信息
	const userinfo = {
		"nickname": req.body.nickname,
		"username": req.body.username,
		"password": req.body.password
	}
	// 定义 SQL 语句，查询用户名是否被占用
	const sqlStr = 'select * from ev_users where username=?'
	db.query(sqlStr, userinfo.username, (err, results) => {
		// 执行 SQL 语句失败
		if (err) {
			return res.cc(err)
		}
		// 判断用户名是否被占用
		if (results.length > 0) {
			return res.cc('用户名被占用，请更换其他用户名！')
		}
		// 调用 bcrypt.hashSync() 对密码进行加密
		userinfo.password = bcrypt.hashSync(userinfo.password, 10)
		// 定义插入新用户的 SQL 语句
		const sql = 'insert into ev_users set ?'
		// 调用 db.query() 执行 SQL 语句
		db.query(sql, {
			username: userinfo.username,
			password: userinfo.password,
			nickname: userinfo.nickname
		}, (err, results) => {
			if (err) return res.cc(err)
			if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
			// 注册用户成功
			res.send({
				status: 0,
				message: '注册成功！',
				data: userinfo.username
			})
		})
	})
}

// 登录的处理函数
exports.login = (req, res) => {
	// 接收表单的数据
	const userinfo = {
		"username": req.body.username,
		"password": req.body.password
	}
	// 定义 SQL 语句
	const sql = `select * from ev_users where username=?`
	// 执行 SQL 语句，根据用户名查询用户的信息
	db.query(sql, userinfo.username, (err, results) => {
		// 执行 SQL 语句失败
		if (err) return res.cc(err)
		// 执行 SQL 语句成功，但是获取到的数据条数不等于 1
		if (results.length !== 1) return res.cc('用户名或密码错误！')
		// TODO：判断密码是否正确
		const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
		if (!compareResult) return res.cc('密码错误！')
		// TODO：在服务器端生成 Token 的字符串
		const user = {
			...results[0],
			password: '',
			user_pic: ''
		}
		// 对用户的信息进行加密，生成 Token 字符串
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiresIn
		})
		// 调用 res.send() 将 Token 响应给客户端
		res.send({
			status: 0,
			message: '登录成功！',
			token: 'Bearer ' + tokenStr,
			nickname: user.nickname,
			id: user.id
		})
	})
}