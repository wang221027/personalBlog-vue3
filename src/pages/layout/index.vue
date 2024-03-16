<script lang="ts" setup>
import { reactive } from 'vue'
let routes = reactive([
    {
        title: '首页',
        icon: 'House',
        path: '/layoutHome'
    },
    {
        title: '用户管理',
        icon: 'Avatar',
        path: '/layoutUser'
    },
    {
        title: '文章管理',
        icon: 'Notebook',
        path: '/layoutArticle'
    },
    {
        title: '接口管理',
        icon: 'Cpu',
        path: '/layoutApi'
    }
])
</script>
<template>
    <!-- 容器 -->
    <section class="container">
        <!-- 左侧导航栏 -->
        <div class="container_left">
            <!-- 头部 -->
            <div class="container_header">
                <img src="/public/logo.jpg" alt="">
                <h4>博客系统后台管理</h4>
            </div>
            <ul>
                <li v-for="route in routes">
                    <router-link :to="route.path" active-class="router_active">
                        <div>
                            <el-icon size="20">
                                <component :is="route.icon"></component>
                            </el-icon>
                        </div>
                        {{ route.title }}
                    </router-link>
                </li>
            </ul>
        </div>
        <!-- 内容 -->
        <div class="container_right">
            <router-view></router-view>
        </div>
    </section>
</template>
<style scoped lang="less">
.container {
    display: flex;
    width: 100vw;
    height: calc(100vh - 80px);

    // 左侧导航栏
    .container_left {
        flex: .2;
        background-color: #001529;

        // 头部
        .container_header {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;

            img {
                width: 24px;
                margin-right: 8px;
            }

            h4 {
                color: #fff;
                font-size: 18px;
                font-weight: 400;
            }
        }

        ul {
            li {
                transition: all .3s;
                overflow: hidden;
                /* 隐藏超出部分的文本内容 */
                text-overflow: ellipsis;
                /* 使用省略号表示被隐藏的文本内容 */
                white-space: nowrap;
                /* 防止文本换行 */
                a {
                    display: flex;
                    align-items: center;
                    color: #fff;
                    font-size: 14px;
                    height: 50px;
                    padding-left: 20px;

                }
                .router_active {
                    background-color: #4e5465;
                }
                div {
                    display: flex;
                    align-items: center;
                    margin-right: 10px;

                }
                a:hover {
                    background-color: #4e5465;
                }
            }
        }
    }
    // 内容
    .container_right {
        flex: .8;
        background-color: #eceff3;
    }
}</style>
