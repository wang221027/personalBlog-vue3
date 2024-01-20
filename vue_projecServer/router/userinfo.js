const express = require('express')
const router = express.Router()

// 挂载路由

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema,delete_cate_schema } = require('../schema/user')
// 获取文章分类列表数据的路由
router.get('/list/:id', expressJoi(delete_cate_schema), userinfo_handler.getArtCates)
router.post('/list2', userinfo_handler.postArtCates)
// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户信息的路由
router.post('/userinfo', userinfo_handler.updateUserInfo)
// 根据用户id获取文章列表
router.post('/getUserIdList', userinfo_handler.getUserIdList)

// 更新密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
// 更新头像
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })
router.post('/avatar', upload.single('avatar'), userinfo_handler.updateAvatar)
module.exports = router