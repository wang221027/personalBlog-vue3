<script setup lang='ts'>
import { watch } from 'vue'
// 引入路由构造器
import { useRoute } from 'vue-router'
const $route = useRoute()
// 引入全局事件总线
import $bus from './utils/event-bus'
// 监视路由跳转，如果从其他路由跳转到home，通知tabBar组件把高亮调为第一个
watch($route, () => {
  if ($route.path == '/home') {
    $bus.emit("isCountOne")
  }
})
</script>
<template>
  <Header />
  <router-view></router-view>
  <footerTab />
</template>

<style lang='less'>


// 768px
@media screen and (max-width: 768px) {

  // 导航栏
  .nav {
    width: 600px !important;
  }

  .nav ul li {
    display: none !important;
  }

  .nav ul li:nth-child(1) {
    display: block !important;
  }

  // 搜索框
  /deep/ .el-input__inner {
    width: 300px !important;
    height: 40px !important;
    font-size: 16px !important;
  }

  // 导航栏li
  /deep/ .el-link__inner {
    margin: 0 6px !important;
  }

  // 发布文章
  .goArticle {
    display: none !important;
  }

  // 经过头像时显示的列表
  .listNone {
    display: none !important;
  }
}</style>