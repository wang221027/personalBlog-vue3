<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const $route = useRoute()
const $router = useRouter()
// 引入 根据id获取文章列表 api
import { reqArticleList, reqUserNickName, reqUserMessageHead } from '@/api/ArticleCover'
// 存储根据id获取文章列表的数据
let ArticleListData: any = ref([])
// 存储用户头像 url
let avatarUrl: any = ref(null)
// 存储用户昵称
let userNickName = ref('')
// 发请求根据id获取文章列表数据
let getInIdArticleList = async () => {
    const id: any = $route.query.id;
    const results: any = await reqArticleList(id)
    ArticleListData.value = results.data;
    getAvatarUrl()
}
// 发请求根据id获取用户昵称
let getUserNickName = async () => {
    const id: any = $route.query.id;
    if (id) {
        const results: any = await reqUserNickName(id)
        userNickName.value = results.data[0].nickname;
    }
}
// 发请求根据id获取用户头像
let getAvatarUrl = async () => {
    if (ArticleListData && ArticleListData.value && ArticleListData.value.length > 0 && ArticleListData.value[0].user_id) {
        const results = await reqUserMessageHead(ArticleListData.value[0].user_id)
        if (results.data[0] && results.data[0].title_url) {
            avatarUrl.value = results.data[0].title_url;
        }
    }
}
// 点击发布博文去发布文章路由
let goIssue = () => {
    $router.push({ name: 'article' })
}
onMounted(() => {
    // 发请求根据id获取文章列表数据
    getInIdArticleList()
    // 发请求根据id获取用户昵称
    getUserNickName()
    // 从本地获取用户头像url
    getAvatarUrl()
})
</script>
<template>
    <div class="container">
        <!-- 背景 -->
        <div class="container_bg"></div>
        <!-- 返回上一级 -->
        <GoBack color="red" content="文章详情" width="1400px" class="go_back" />
        <!-- 主体内容 -->
        <div class="main">
            <!-- 左边内容 -->
            <div class="main_left">
                <div style="background-color: goldenrod;width: 100%;padding: 20px;display:flex;box-sizing: border-box;">
                    <!-- 用户头像 -->
                    <div style="width: 80px;height: 80px;">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                            v-if="avatarUrl == null"></el-avatar>
                        <el-avatar :src="avatarUrl" v-if="avatarUrl"></el-avatar>
                    </div>
                    <!-- 用户姓名 -->
                    <div class="top_content">
                        <h1 class="top_h1">{{ userNickName }}</h1>
                    </div>
                </div>
                <!-- 左边发布博文背景 -->
                <div class="main_bg" @click="goIssue"></div>
            </div>
            <!-- 右边文章列表 -->
            <div class="main_right" v-if="ArticleListData && ArticleListData.length >= 1">
                <!-- 文章标题 -->
                <h1>{{ ArticleListData[0].name }}</h1>
                <div></div>
                <!-- 文章内容 -->
                <p>{{ ArticleListData[0].alias }}</p>
                <!-- 文章类型 -->
                <span>文章类型：{{ ArticleListData[0].type }}</span><br>
                <!-- 发布日期 -->
                <span>发布日期：{{ ArticleListData[0].time }}</span>
            </div>

        </div>
    </div>
</template>
<style lang='less' scoped>
// 容器
.container {
    width: 100%;

    .container_bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        opacity: .8;
        background: url(./images/feng03.webp) no-repeat;
        background-size: cover;
    }

    // 主体
    .main {
        width: 1400px;
        display: flex;
        justify-content: space-between;
        margin: 20px auto;
        opacity: .8;

        .main_left {
            flex: 0.34;

            // 个人头像
            .el-avatar {
                width: 100px;
                height: 100px;
                border: 2px solid #ccc;
            }

            // 用户姓名
            .top_h1 {
                margin-left: 20px;
                margin-top: 20px;
            }

            // 个人头像
            .el-avatar {
                width: 80px;
                height: 80px;
                border: 2px solid #ccc;
            }

            // 用户姓名
            .top_h1 {
                margin-left: 20px;
                margin-top: 20px;
            }

            // 左边发布博文背景
            .main_bg {
                background-color: #fff;
                width: 100%;
                padding: 20px;
                display: flex;
                box-sizing: border-box;
                margin-top: 20px;
                background: url(./images/bg_post.png) no-repeat;
                background-size: cover;
                height: 200px;
                cursor: pointer;
            }
        }

        // 右边文章列表
        .main_right {
            padding: 20px;
            flex: 0.65;
            background-color: #fff;

            h1 {
                font-size: 30px;
                margin: 10px 0;
            }

            p {
                margin: 10px 0;
                font-size: 20px;
            }

            span {
                font-size: 14px;
            }
        }
    }
}

// 响应式 1500px
@media screen and (max-width: 1500px) {

    // 主体
    .main {
        width: 1200px !important;
    }
}

// 1300px
@media screen and (max-width: 1300px) {

    // 主体
    .main {
        width: 1050px !important;
    }
}

// 1100px
@media screen and (max-width: 1100px) {

    // 主体
    .main {
        display: block !important;
        width: 900px !important;
    }

    // 发布博文
    .main_bg {
        display: none !important;
    }
    // 文章详情
    .main_right {
        margin-top: 20px;
    }
}

// 996px
@media screen and (max-width: 996px) {

    // 主体
    .main {
        width: 700px !important;
    }
    // 返回上一级
    .go_back {
        display: none;
    }
}

// 768px
@media screen and (max-width: 768px) {
    // 主体
    .main {
        width: 600px !important;
    }
}

// 600px
@media screen and (max-width: 650px) {
     // 主体
     .main {
        width: 500px !important;
    }
}

// 500px
@media screen and (max-width: 500px) {
     // 主体
     .main {
        width: 400px !important;
    }
}
</style>