import { createRouter, createWebHashHistory } from 'vue-router';
//createRouter方法,用于创建路由器实例，可以管理多个路由
export default createRouter({
    //路由的模式的设置
    history: createWebHashHistory(),
    //管理路由
    routes: [
        // 首页
        {
            name: 'HomePage',
            path: '/HomePage',
            component: () => import('@/pages/HomePage/index.vue'),
            meta: { title: '首页' },
        },
        // 文章
        {
            name: 'home',
            path: '/home',
            component: () => import('@/pages/MyHome/index.vue'),
            meta: { title: '文章' },
        },
        // 发布文章
        {
            name: 'article',
            path: '/article',
            component: () => import('@/pages/PublishArticle/index.vue'),
            meta: { title: '发布文章' },
        },
        // 文章详情
        {
            name: 'cover',
            path: '/cover',
            component: () => import('@/pages/ArticleCover/index.vue'),
            meta: { title: '文章详情' },
        },
        // 登录
        {
            name: 'login',
            path: '/login',
            component: () => import('@/pages/Login/index.vue'),
            meta: { title: '登录' },
        },
        // 注册
        {
            name: 'register',
            path: '/register',
            component: () => import('@/pages/register/index.vue'),
            meta: { title: '注册' },
        },
        // 个人主页
        {
            name: 'PersonalCenter',
            path: '/PersonalCenter',
            component: () => import('@/pages/PersonalCenter/index.vue'),
            meta: { title: '个人主页' },
        },
        // 修改个人简介
        {
            name: 'EditData',
            path: '/EditData',
            component: () => import('@/pages/EditData/index.vue'),
            meta: { title: '修改个人简介' },
        },
        // 聊天室
        {
            name: 'ChatRoom',
            path: '/ChatRoom',
            component: () => import('@/pages/ChatRoom/index.vue'),
            meta: { title: '聊天室' },
        }, 
        // 联机游戏
        {
            name: 'onlineGame',
            path: '/onlineGame',
            component: () => import('@/pages/onlineGame/index.vue'),
            meta: { title: '联机游戏' },
        },
         // 留言板
         {
            name: 'MessageBoard',
            path: '/MessageBoard',
            component: () => import('@/pages/MessageBoard/index.vue'),
            meta: { title: '留言板' },
        },
        // 重定向，在项目跑起来的时候，访问/, 立马让他重定向到首页
        {
            path: "/",
            redirect: "/HomePage"
        }
    ],
    //滚动行为:控制滚动条的位置
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})
