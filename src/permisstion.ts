//路由鉴权:就是路由能不能被访问到权限设置->全局守卫完成
//引入路由器
import router from "@/routes";
//存储用户未登录可以访问路由得路径
let whiteList = ["/home", "/cover", "/login", "/register"];
// 引入 Element-plus message消息提示
import { ElMessage } from 'element-plus'
//添加相应的全局守卫
//前置守卫
router.beforeEach((to, _, next) => {
    //动态设置网页左上角的标题
    document.title = `${to.meta.title}`;
    //判断用户是否登录-token
    let token = localStorage.getItem("token");
    //用户登陆了
    if (token) {
        next();
    } else {
        //用户未登录
        if (whiteList.includes(to.path)) {
            next();
        } else {
            ElMessage({
                message: '请登录后操作！',
                type: "error",
                offset:100
            })
            next({ path: '/home' })
        }
    }
});