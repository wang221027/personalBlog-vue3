// 对外暴露常量路由
export const constantRoute = [
  // 文章
  {
    name: "home",
    path: "/home",
    component: () => import("@/pages/MyHome/index.vue"),
    meta: { title: "文章" },
  },
  // 发布文章
  {
    name: "article",
    path: "/article",
    component: () => import("@/pages/PublishArticle/index.vue"),
    meta: { title: "发布文章" },
  },
  // 文章详情
  {
    name: "cover",
    path: "/cover",
    component: () => import("@/pages/ArticleCover/index.vue"),
    meta: { title: "文章详情" },
  },
  // 登录
  {
    name: "login",
    path: "/login",
    component: () => import("@/pages/Login/index.vue"),
    meta: { title: "登录" },
  },
  // 注册
  {
    name: "register",
    path: "/register",
    component: () => import("@/pages/register/index.vue"),
    meta: { title: "注册" },
  },
  // 个人主页
  {
    name: "PersonalCenter",
    path: "/PersonalCenter",
    component: () => import("@/pages/PersonalCenter/index.vue"),
    meta: { title: "个人主页" },
  },
  // 修改个人简介
  {
    name: "EditData",
    path: "/EditData",
    component: () => import("@/pages/EditData/index.vue"),
    meta: { title: "修改个人简介" },
  },
  // 聊天室
  {
    name: "ChatRoom",
    path: "/ChatRoom",
    component: () => import("@/pages/ChatRoom/index.vue"),
    meta: { title: "聊天室" },
    redirect: "/ChatRoom/message",
    children: [
      {
        path: "message",
        component: () => import("@/pages/ChatRoom/Chat/index.vue"),
      },
      // 好友列表
      {
        path: "userList",
        component: () => import("@/pages/ChatRoom/Users/index.vue"),
      },
    ],
  },
  // 留言板
  {
    name: "MessageBoard",
    path: "/MessageBoard",
    component: () => import("@/pages/MessageBoard/index.vue"),
    meta: { title: "留言板" },
  },
  // 后台管理
  {
    name: "layout",
    path: "/layout",
    component: () => import("@/pages/layout/index.vue"),
    meta: { title: "后台管理" },
    redirect: '/layoutHome',
    children: [
      // 后台首页
      {
        path: "/layoutHome",
        component: () => import("@/pages/layout/layoutHome/index.vue"),
        meta: { title: "后台管理/首页" },
      },
      // 用户管理
      {
        path: "/layoutUser",
        component: () => import("@/pages/layout/layoutUser/index.vue"),
        meta: { title: "后台管理/用户管理" },
      },
      // 文章管理
      {
        path: "/layoutArticle",
        component: () => import("@/pages/layout/layoutArticle/index.vue"),
        meta: { title: "后台管理/文章管理" },
      },
      // 接口管理
      {
        path: "/layoutApi",
        component: () => import("@/pages/layout/layoutApi/index.vue"),
        meta: { title: "后台管理/接口管理" },
      },
    ],
  },
  // 后台管理系统登录
  {
    name: "adminLogin",
    path: "/adminLogin",
    component: () => import("@/pages/adminLogin/index.vue"),
    meta: { title: "后台管理系统登录" },
  },
  // 重定向，在项目跑起来的时候，访问/, 立马让他重定向到首页
  {
    path: "/",
    redirect: "/home",
  },
];
