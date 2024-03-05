// 这是路由处理函数模块
// 导入数据库操作模块
const db = require("../db/index");
// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${(
    "0" + date.getHours()
  ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${(
    "0" + date.getSeconds()
  ).slice(-2)}`;
  const strForm = JSON.stringify(formattedDate);
  const data = {
    name: req.body.name,
    alias: req.body.alias,
    type: req.body.type,
    nickname: req.user.nickname,
    time: strForm,
    user_id: req.user.id,
  };
  // 定义插入文章分类的 SQL 语句
  const sql = `insert into ev_article_cate set ?`;
  // 执行插入文章分类的 SQL 语句
  db.query(sql, data, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) return res.cc("新增文章分类失败！");
    res.send({
      message: "新增文章成功！",
      status: 0,
    });
  });
};
// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
  // 定义标记删除的 SQL 语句
  const sql = `update ev_article_cate set is_delete=1 where id=?`;
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    const sql2 = `update new_table set is_delete=1 where id=?`;
    db.query(sql2, req.params.id, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      res.cc("删除文章分类成功！", 0);
    });
  });
};

// 根据 Id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
  // 定义根据 ID 获取文章分类数据的 SQL 语句
  const sql = `select * from ev_article_cate where id=?`;
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("获取文章分类数据失败！");
    res.send({
      status: 0,
      message: "获取文章分类数据成功！",
      data: results[0],
    });
  });
};
// 根据 Id 更新用户文章列表作者姓名
exports.updateArtCateById = (req, res) => {
  // 定义根据 ID 获取文章分类数据的 SQL 语句
  const sql = `update ev_article_cate set nickname='${req.body.nickname}' where user_id=?`;
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, req.body.user_id, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "更新用户文章列表作者姓名成功！",
    });
  });
};
// 根据 Id 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  // 定义查重的 SQL 语句
  const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`;
  // 调用 db.query() 执行查重的 SQL 语句
  db.query(
    sql,
    [req.body.Id, req.body.name, req.body.alias],
    (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err);
      // 判断名称和别名被占用的4种情况
      if (results.length === 2)
        return res.cc("分类名称与别名被占用，请更换后重试！");
      if (
        results.length === 1 &&
        results[0].name === req.body.name &&
        results[0].alias === req.body.alias
      )
        return res.cc("分类名称与别名被占用，请更换后重试！");
      if (results.length === 1 && results[0].name === req.body.name)
        return res.cc("分类名称被占用，请更换后重试！");
      if (results.length === 1 && results[0].alias === req.body.alias)
        return res.cc("分类别名被占用，请更换后重试！");
      // 定义更新文章分类的 SQL 语句
      const sql = `update ev_article_cate set ? where Id=?`;
      // 执行更新文章分类的 SQL 语句
      db.query(sql, [req.body, req.body.Id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("更新文章分类失败！");
        res.cc("更新文章分类成功！", 0);
      });
    }
  );
};
// 插入文章封面url
exports.updateAvatar2 = (req, res) => {
  const avatarUrl = `http://43.138.70.109:8010/${
    req.file.destination.split("/")[1]
  }/${req.file.originalname.replace(/\s/g, "")}`;
  const data = {
    title_url: avatarUrl,
    file: "show",
    user_id: req.user.id,
  };
  const insertAvatarSql = "insert into new_table set ?";
  db.query(insertAvatarSql, data, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      message: "上传封面成功",
      status: 0,
      data: [req.user.id, avatarUrl],
    });
  });
};

// 根据id修改封面url
exports.updateAvatar1 = (req, res) => {
  const avatarUrl = `http://43.138.70.109:8010/${
    req.file.destination.split("/")[1]
  }/${req.file.originalname.replace(/\s/g, "")}`;
  const updateAvatarSql = `update new_table set title_url='${avatarUrl}',file='show' where id=?`;
  const id = parseInt(req.query.id);
  db.query(updateAvatarSql, id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      message: "更新封面成功！",
      status: 0,
      data: [req.user.id, avatarUrl],
    });
  });
};

exports.updateAvatar3 = (req, res) => {
  const data = {
    title_url: req.body.title_url,
    file: "del",
    user_id: req.user.id,
  };
  const insertAvatarSql = "insert into new_table set ?";
  db.query(insertAvatarSql, data, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      message: "上传封面成功",
      status: 0,
      data: [req.user.id, data.title_url],
    });
  });
};
// 获取用户发布的文章
exports.userInfo = (req, res) => {
  const getUserInfo = "SELECT * FROM ev_article_cate WHERE user_id=?";
  const id = req.user.id;
  db.query(getUserInfo, id, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error retrieving user information",
      });
    }
    res.status(200).json({ message: "获取用户信息成功", data: results });
  });
};
// 获取用户列表封面url
exports.userInfo2 = (req, res) => {
  const getUserInfo = "SELECT * FROM new_table WHERE user_id=?";
  const id = req.user.id;
  db.query(getUserInfo, id, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error retrieving user information",
      });
    }
    res.status(200).json({
      message: "获取用户信息成功",
      data: results,
    });
  });
};
// 获取用户头像url
exports.userInfo3 = (req, res) => {
  const getUserInfo = "SELECT * FROM avatars WHERE id=?";
  const id = req.user.id;
  db.query(getUserInfo, id, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error retrieving user information",
      });
    }
    res.status(200).json({
      message: "获取用户信息成功",
      data: results,
    });
  });
};

// 发表评论
exports.addComment = (req, res) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${(
    "0" + date.getHours()
  ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${(
    "0" + date.getSeconds()
  ).slice(-2)}`;
  const strForm = JSON.stringify(formattedDate);
  const data = {
    alias: req.body.alias,
    time: strForm,
  };
  // 定义插入文章分类的 SQL 语句
  const sql = `insert into user_comment set ?`;
  // 执行插入文章分类的 SQL 语句
  // db.query(sql, data, (err, results) => {
  //   if (err) {
  //     return res.cc(err)
  //   }
  //   if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
  //   res.send({
  //     message: '新增文章成功！',
  //     status: 0
  //   })
  // })
};

// 点赞
exports.like = (req, res) => {
  // 定义插入文章分类的 SQL 语句
  const sql = `update ev_article_cate set isBlock='false' where id=?`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) return res.cc("点赞失败！");
    res.send({
      message: "ok",
      status: 0,
    });
    // 定义插入文章分类的 SQL 语句
    // const sql = `update ev_article_cate set likeNum='${num}' where id=?`;
    // // 执行插入文章分类的 SQL 语句
    // db.query(sql, data, (err, results) => {
    //   if (err) {
    //     return res.cc(err);
    //   }
    //   if (results.affectedRows !== 1) return res.cc("点赞失败！");
    //   res.send({
    //     message: "点赞成功！",
    //     status: 0,
    //   });
    // });
  });
};

// 点赞
exports.like = (req, res) => {
  // 定义插入文章分类的 SQL 语句
  const sql = `update ev_article_cate set isBlock='false' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) return res.cc("点赞失败！");
    const sql = "SELECT * from ev_article_cate where id=?";
    db.query(sql, req.params.id, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      res.send({
        message: "ok",
        status: 0,
        data: results,
      });
    });
  });
};
exports.reqLike = (req, res) => {
  // 定义插入文章分类的 SQL 语句
  const sql = `update ev_article_cate set likeNum='${req.params.num}' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    const sql = "SELECT * from ev_article_cate where id=?";
    db.query(sql, req.params.id, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      res.send({
        message: "ok",
        status: 0,
        data: results,
      });
    });
  });
};
exports.like2 = (req, res) => {
  // 定义插入文章分类的 SQL 语句
  const sql = `update ev_article_cate set isBlock='false' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) return res.cc("点赞失败！");
    const sql = "SELECT * from ev_article_cate where id=?";
    db.query(sql, req.params.id, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      res.send({
        message: "ok",
        status: 0,
        data: results,
      });
    });
  });
};
exports.reqLike2 = (req, res) => {
  // 定义插入文章分类的 SQL 语句
  const sql = `update ev_article_cate set likeNum='${req.params.num}' where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    const sql = "SELECT * from ev_article_cate where id=?";
    db.query(sql, req.params.id, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      res.send({
        message: "ok",
        status: 0,
        data: results,
      });
    });
  });
};


// 点赞
exports.like = (req, res) => {
  // 更新文章分类的点赞状态
  const sql = `UPDATE ev_article_cate SET isLiked = 1 WHERE id = ?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("点赞失败！");
    }
    
    // 更新点赞用户列表
    const sql2 = `UPDATE ev_article_cate SET likeUserId = CONCAT(likeUserId, ?) WHERE id = ?`;
    db.query(sql2, [req.params.userId + '/', req.params.id], (err, results) => {
      if (err) {
        return res.cc(err);
      }
      
      // 查询更新后的文章分类信息并返回
      const sql3 = "SELECT * FROM ev_article_cate WHERE id = ?";
      db.query(sql3, req.params.id, (err, results) => {
        if (err) {
          return res.cc(err);
        }
        res.send({
          message: "点赞成功",
          status: 0,
          data: results[0],
        });
      });
    });
  });
};