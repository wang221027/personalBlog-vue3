const express = require('express')
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { reg_login_schema, reg_login_register } = require('../schema/user')
// 首页
router.get('/index.html', (req, res) => {
    res.send(`<h1>hello word</h1>`)
})
// 获取文章分类列表数据的路由
router.get('/list', user_handler.getArtCates)
// 获取列表上传的图片地址
router.get('/getTitleUrl', user_handler.getTitle)
// 根据文章id获取文章列表
router.post('/getList', user_handler.getList)

// 根据id更新文章列表
router.post('/updateArticle', user_handler.upArticle)
// 根据id更新封面url
router.post('/updateAvatar', user_handler.updateAvatar)
// 根据id获取用户姓名
router.post('/reqUserMessage', user_handler.reqUserMessage)
// 根据id获取用户头像url
router.post('/reqUserMessage2', user_handler.reqUserMessage2)
// 注册新用户
// router.post('/postTitleUrl', user_handler.postTitle)

router.post('/reguser', expressJoi(reg_login_register), user_handler.regUser)
// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)
// router.post('/login', user_handler.login)

module.exports = router
