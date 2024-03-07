// 导入 express
const express = require("express");
// 创建服务器的实例对象
const app = express();
// 导入数据库操作模块
const db = require("./db/index");
// 导入并配置 cors 中间件
const cors = require("cors");
app.use(cors());
// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }));
const { createServer } = require("http");
// 创建 socket.io 服务器
const httpServer = createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://wyuanlin.site", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  /* 监听用户登录事件,并将数据放到socket实例的属性上 */
  socket.on("login", (data) => {});
  socket.on("sendInfo", (data) => {
    if (data) {
      // socket.broadcast.emit("reqUserInfo", data);
      let { content, userId, avatar } = data;
      const newData = {
        content,
        userId,
        avatar,
        type: "my",
      };
      const sql = "insert into chat_room set ?";
      db.query(sql, newData, (err, results) => {
        if (err) return console.log({ status: 500, message: err.message });
        console.log("插入成功！");
        const sql = "select * from chat_room";
        db.query(sql, (err, results) => {
          if (err) console.log(err.message);
          console.log(results);
        });
      });
    }
  });
  // 监听群聊事件
  socket.on("groupChat", (data) => {});
  /* 监听私聊事件 */
  socket.on("privateChat", (data) => {});

  /* 用户掉线 */
  socket.on("disconnect", () => {});
});

// 启动服务器
httpServer.listen(3000, () => {
  console.log("http://43.138.70.109:8010");
});

// 启动服务器
// server = app.listen(8010, () => {
//   console.log('api server running at http://43.138.70.109:8010');
// });
