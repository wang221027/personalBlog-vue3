// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')
// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义查询用户信息的 SQL 语句
  const sql = `select * from ev_users where id=?`
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, req.user.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询的结果可能为空
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    // 用户信息获取成功
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0],
    })
  })
}
// 根据用户id获取文章列表
exports.getUserIdList = (req, res) => {
	// 获取列表上传的图片地址
	const sql = 'select * from ev_article_cate where user_id=?';
	db.query(sql, req.user.id, (err, results) => {
		if (err) return res.cc(err, 1)
		res.send({
			status: 0,
			message: '获取列表上传图片成功！',
			data: results
		})
	})
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  // 定义待执行的 SQL 语句
  const sql = `update ev_users set ? where id=?`
  // 调用 db.query() 执行 SQL 语句并传递参数
  db.query(sql, [req.body, req.user.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败！')
    const sql = 'select * from ev_users where id=?'
    db.query(sql, req.user.id, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '更新用户信息成功！',
        data: results
      })
    })
  })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
  // 根据 id 查询用户的信息
  const sql = `select * from ev_users where id=?`
  // 执行根据 id 查询用户的信息的 SQL 语句
  db.query(sql, req.user.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 判断结果是否存在
    if (results.length !== 1) return res.cc('用户不存在！')
    // 判断密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!compareResult) return res.cc('旧密码错误！')
    // 定义更新密码的 SQL 语句
    const sql = `update ev_users set password=? where id=?`
    // 对新密码进行加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // 判断影响的行数
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')
      // 成功
      res.cc('更新密码成功', 0)
    })
  })
}
// 更新头像
exports.updateAvatar = (req, res) => {
  console.log(req.user.id);
  const checkAvatarSql = 'select * from avatars where id = ?;';
  const avatarUrl = `http://127.0.0.1:8010/${req.file.destination.split('/')[1]}/${req.file.originalname}`
  db.query(checkAvatarSql, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length == 0) {
      const insertAvatarSql = 'insert into avatars (title_url, id) values (?, ?);';
      db.query(insertAvatarSql, [avatarUrl, req.user.id], (err, results) => {
        if (err) {
          return res.cc(err);
        }
        res.send({
          message: '首次上传头像成功！',
          status: 0,
          data: [avatarUrl, req.user.id]
        })
      });
    } else {
      const updateAvatarSql = 'update avatars set title_url=? where id=?;';
      db.query(updateAvatarSql, [avatarUrl, req.user.id], (err, results) => {
        if (err) {
          return res.cc(err);
        }
        res.send({
          message: '更换头像成功！',
          status: 0,
          data: [avatarUrl, req.user.id]
        })
      });
    }
  });
}

// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
  // 定义查询分类列表数据的 SQL 语句
  const sql = `select * from ev_article_cate where id=?;`
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, req.params.id, (err, results) => {
    console.log('results', results);
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: results,
    })
  })
}

// 更新文章分类用户昵称
exports.postArtCates = (req, res) => {
  // 获取用户输入的分类信息
  const { nickname } = req.body;
  // 定义更新分类信息的 SQL 语句
  const sql = `update ev_article_cate set nickname=? where user_id=?`;
  // 调用 db.query() 执行 SQL 语句并传递参数
  db.query(sql, [nickname, req.user.id], (err, results) => {
    if (err) {
      // 执行 SQL 语句失败
      return res.status(500).json({
        status: 500,
        message: err.message
      });
    }
    // 执行 SQL 语句成功
    res.status(200).json({
      status: 0,
      message: '更新用户昵称成功！'
    });
  });
};