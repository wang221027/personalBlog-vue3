// 导入 express
const express = require('express')
// 创建服务器的实例对象
const app = express()
const joi = require('joi')
// 导入数据库操作模块
const db = require('./db/index')
// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 托管静态资源文件
app.use(express.static('image'))
// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})
// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))
// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') {
    console.log(err.message);
    return res.cc(err)
  }
  res.cc(err)
})
const { createServer } = require("http"); 
// 创建 socket.io 服务器 
const httpServer = createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: ["http://wyuanlin.site", "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});
let userArr = []
io.on('connection', function (socket) {
   /* 监听用户登录事件,并将数据放到socket实例的属性上 */
    socket.on('login', (data) => {
        socket.name = data.name;
        if (data && data.name && data.avatar) {
            const sql = 'select * from user_room where user_id=?';
            db.query(sql, data.user_id, (err, results) => {
                if (err) return console.log({ status: 500, message: err.message });
                if (results.length > 0) {
                    const sql = 'update user_room set is_delete=0 where user_id=?'
                    db.query(sql, data.user_id, (err, results) => {
                        if (err) return console.log(err.message);
                        const sql = 'select * from user_room';
                        db.query(sql, (err, results) => {
                            if (err) console.log(err.message);
                            userArr = results;
                            io.emit("loginData", userArr);
                        });
                    })
                    return
                }
                const sql = 'insert into user_room set ?'
                db.query(sql, data, (err, results) => {
                    if (err) return console.log({ status: 500, message: err.message });
                    console.log('插入成功！');
                    const sql = 'select * from user_room';
                    db.query(sql, (err, results) => {
                        if (err) console.log(err.message);
                        userArr = results;
                        io.emit("loginData", userArr);
                    });
                });
            });
        }
        const sql = 'select * from user_room';
        db.query(sql, (err, results) => {
            if (err) console.log(err.message);
            userArr = results;
            io.emit("loginData", userArr);
        });
    });
    // 从数据库中更新用户头像 url
    socket.on("updateUserAvatar", (avatar, user_id) => {
        const sql = 'update user_room set avatar=? where user_id=?';
        db.query(sql, [avatar, user_id], (err, results) => {
            if (err) console.log(err.message);
            userArr = results;
            io.emit("loginData", userArr);
            io.emit("updateUser");
        })
    })
    // 监听群聊事件
    socket.on('groupChat', (data) => {
        // 发送给所有客户端，除了发送者
        data.type = 'user'; // 修改源数据的属性
        socket.broadcast.emit('updateChatMessageList', data);
    });
    /* 监听私聊事件 */
    socket.on('privateChat', data => {
        const sql = 'select * from user_room';
        db.query(sql, (err, results) => {
            if (err) console.log(err.message);
            userArr = results;
        });
        /* 找到对应的私聊对象 */
        io.sockets.sockets.forEach(iss => {
            if (iss.name == data.receiver) {
                data.type = 'user';
                io.to(iss.id).emit('updateChatMessageList2', data);
            }
        });
    });
    // 用户发送消息后插入数据库
    socket.on("insertUserInfo", (data) => {
        const sql = 'insert into chat_room set ?'
        db.query(sql, data, (err, results) => {
            if (err) return console.log({ status: 500, message: err.message });
        });
    })
    socket.on("reqUserList", () => {
        const sql2 = 'select * from chat_room';
        db.query(sql2, (err, results) => {
            if (err) console.log(err.message);
            io.emit("reqUserInfoList", results)
        });
    })
    let id = null;
    socket.on("getUserId", user_id => {
        id = user_id;
    })
    /* 用户掉线 */
    socket.on('disconnect', () => {
        /* 删除用户 */
        const sql = 'select * from user_room where user_id=?'
        db.query(sql, id, (err, results) => {
            if (err) return console.log(err.message);
            if (results.is_delete != 1) {
                db.query(sql, id, (err, results) => {
                    const sql = 'update user_room set is_delete=1 where user_id=?'
                    db.query(sql, id, (err, results) => {
                        if (err) return console.log(err.message);
                    })
                })
            }
            setTimeout(() => {
                const sql = 'select * from user_room';
                db.query(sql, (err, results) => {
                    if (err) console.log(err.message);
                    userArr = results;
                    io.emit("loginData", userArr);
                });
                io.emit("loginData", userArr);
            }, 100)
        })

    });
});

// 启动服务器 
httpServer.listen(8010, () => { 
    console.log('http://43.138.70.109:8010'); 
});

// 启动服务器
// server = app.listen(8010, () => {
//   console.log('api server running at http://43.138.70.109:8010');
// });