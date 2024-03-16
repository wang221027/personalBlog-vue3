//vue3框架提供的方法createApp方法,可以用来创建应用实例方法
import { createApp } from "vue";
//引入清除默认样式
import "@/style/style.css";
//引入根组件App
import App from "@/App.vue";
//引入vue-router核心插件并安装
import router from "@/routes";
//引入element-plus插件
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//国际化文件
//@ts-ignore
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
//利用createApp方法创建应用实例,且将应用实例挂载到挂载点上
const app = createApp(App);
//引入pinia仓库
// import pinia from '@/store'
// 引入 element-plus 图标样式
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入粒子背景
import Particles from "vue3-particles";
// 引入全局组件
// 返回上一级 --- 面包屑
import GoBack from "@/components/GoBack/index.vue";
// 头部
import Header from "@/components/Header/index.vue";
// 底部
import Bottom from "@/components/Bottom/index.vue";
// 引入 pinia创库
import pinia from "./store";
// 底部tab
import footerTab from "@/components/footerTab/index.vue";
// import VueSocketIO from 'vue-socket.io-next';
// 网页打开立马执行路由守卫
import "@/permisstion";
// 注册 element-plus 图标样式
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 引入swiper样式
import "swiper/css";
// 将头部组件注册为全局组件
app.component("Header", Header);
// 将返回上一级 --- 面包屑注册为全局组件
app.component("GoBack", GoBack);
// 将底部组件注册为全局组件
app.component("Bottom", Bottom);
// 将底部tab组件注册为全局组件
app.component("footerTab", footerTab);
// 注册 pinia 创库
app.use(pinia);
//安装vue-router
app.use(router);
// 注册粒子背景插件
app.use(Particles);
//安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
});
//挂载
app.mount("#app");
