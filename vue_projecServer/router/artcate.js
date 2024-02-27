// 这是文章分类的路由模块

const express = require('express')
const router = express.Router()

// 导入文章分类的路由处理函数模块
const artCate_handler = require('../router_handler/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')


// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artCate_handler.addArticleCates)
// 根据 Id 删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artCate_handler.deleteCateById)
// 根据 Id 获取文章分类的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artCate_handler.getArtCateById)
// 根据 Id 更新文章分类的路由
router.post('/upHead', expressJoi(update_cate_schema), artCate_handler.updateCateById)
// 上传封面
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/head');
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname.replace(/\s/g, '');
        cb(null, originalname);
    }
});
const upload = multer({ storage: storage });
router.post('/avatar', upload.single('avatar'), artCate_handler.updateAvatar2);
router.post('/avatar1', upload.single('avatar'), artCate_handler.updateAvatar1);
router.post('/avatar2',artCate_handler.updateAvatar3);
// 获取用户发布的文章
router.get('/userInfo', artCate_handler.userInfo);
// 获取用户列表封面url
router.get('/userInfo2', artCate_handler.userInfo2);
// 获取用户头像url
router.get('/userInfo3', artCate_handler.userInfo3);
// 发表评论
router.post('addComment', artCate_handler.addComment)
module.exports = router
