import { createRouter, createWebHashHistory } from "vue-router";
// 引入常量路由
import { constantRoute } from "./routes";
//createRouter方法,用于创建路由器实例，可以管理多个路由
export default createRouter({
  //路由的模式的设置
  history: createWebHashHistory(),
  //管理路由
  routes: constantRoute,
  //滚动行为:控制滚动条的位置
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});
