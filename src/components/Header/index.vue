<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';
// 引入全局事件总线
import $bus from '@/utils/event-bus'
import { userToken } from '@/api/header'
// 引入 根据id获取文章列表 api
import { reqArticleCover, unDateUserCover } from '@/api/header'
// 引入 获取用户token 方法
import { GET_TOKEN } from '@/utils/user'
// 引入 Element-plus message消息提示
import { ElMessage } from 'element-plus'
// 引入类型判断
import type { userType } from '@/api/header/type'
// 引入获取文章列表api
import { reqArticle } from '@/api/home'
// 获取路由器对象
let $router = useRouter();
// 登录注册按钮是否显示
let isLoginAndRegisterShow: any = ref('true')
// 用户头像是否显示
let isShow = ref(false)
// 存储用户头像url
let avatarUrl = ref(null)
// 用户选择的头像地址
let file: any = ref(null)
// 导航栏是否加类名
let isBoxActive = ref()
let isLogoActive = ref()
// 搜索框
const state = ref('')
// 存储文章列表数据
let userListData: any = ref([])
interface LinkItem {
    value: string,
    link: string
}
const links = ref<LinkItem[]>([])
const loadAll = () => {
    return userListData.value.map((item: any) => {
        return {
            value: item.name,
            link: item.id
        }
    })
}
let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
    const results = queryString
        ? links.value.filter(createFilter(queryString))
        : links.value
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        cb(results)
    }, 1000 * Math.random())
}
const createFilter = (queryString: string) => {
    return (restaurant: LinkItem) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}
const handleSelect = (item: Record<string, any>) => {
    // console.log(item)
    $router.push({ name: 'cover', query: { id: item.link } })
    state.value = ''
}
// 发布文章
const goArticle = () => {
    $router.push({ name: 'article' })
}
// 点击登录跳转到登录路由
let goLogin = () => {
    $router.push({ name: 'login' })
}
// 点击注册跳转到注册路由
let goRegister = () => {
    $router.push({ name: 'register' })
}
// 根据 token 判断是否发请求获取用户信息欢迎用户回来
let getUserLogin = async () => {
    let token = GET_TOKEN();
    if (token) {
        const result: userType = await userToken();
        const id: string = result.data.id.toString();
        if (result.status == 0) {
            localStorage.setItem("userId", id)
            ElMessage({
                message: `欢迎回来${result.data.nickname}`,
                type: 'success',
                offset: 100
            })
        }
        isShow.value = true;
        $bus.emit("isLoginShow", "false");
    } else {
        isShow.value = false;
        $bus.emit("isLoginShow", "true");
    }
}
// 发请求根据id获取用户头像url
let getInIdArticleCover = async () => {
    const id: any = localStorage.getItem("userId");
    if (id) {
        const results: any = await reqArticleCover(id)
        avatarUrl.value = results.data[0]?.title_url;
        localStorage.setItem("avatarUrl", results.data[0]?.title_url)
    }
}
// 点击个人头像跳转到个人主页
let goPersonalCenter = () => {
    $router.push({ name: 'PersonalCenter' })
}
// 退出登录
let quit = () => {
    localStorage.clear();
    ElMessage({
        message: `退出成功`,
        type: 'success',
        offset: 100
    })
    $bus.emit("getUserId")
    setTimeout(() => {
        $router.push({ name: 'HomePage' })
    }, 1000)
}
// 更换头像
let handleFileUpload = (event: any) => {
    file.value = event.target.files[0];
    uploadAvatar()
}
let uploadAvatar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    let formData = new FormData();
    formData.append("avatar", file.value);
    const results = await unDateUserCover(formData)
    localStorage.setItem("avatarUrl", results.data[0].title_url)
    getInIdArticleCover()
    $bus.emit("updateCoverUrl");
    $bus.emit("updateUserUrl")
}
let handleScroll = () => {
    var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrolltop > 100) {
        isBoxActive.value = true;
        isLogoActive.value = true;
    } else {
        isBoxActive.value = false;
        isLogoActive.value = false;
    }
}
// 获取文章列表
let getUserList = async () => {
    const results = await reqArticle()
    userListData.value = results.data;
    links.value = loadAll()
}
onMounted(() => {
    // 获取文章列表
    getUserList()
    // 绑定事件
    $bus.on("isLoginShow", (bool) => {
        isLoginAndRegisterShow.value = bool;
    })
    // 判断是否有token，如果有就显示用户欢迎回来
    getUserLogin()
    // 发请求根据id获取用户头像url
    getInIdArticleCover()
    // 绑定全局事件总线：如果登录登录成功向服务器发请求获取用户id
    $bus.on("getUserId", () => {
        getUserLogin()
    })
    // 绑定全局事件总线：如果登录登录成功向服务器发请求获取用户头像url
    $bus.on("getUserCover", () => {
        getInIdArticleCover()
    })
    // 更换头像
    $bus.on("changeCover", () => {
        uploadAvatar()
    })
    // 退出登录
    $bus.on("myQuit", () => {
        quit()
    })
    window.addEventListener("scroll", handleScroll);
})
onBeforeUnmount(() => {
    window.addEventListener("scroll", handleScroll);
})
</script>
<template>
    <!-- 头部顶盒子 -->
    <div class="header">
        <!-- 固定定位大盒子 -->
        <div class="position_fixed"
            :style="{ height: isBoxActive ? '60px' : '', background: isBoxActive ? '#BFEFFF' : '' }">
            <!-- 导航栏 -->
            <div class="nav">
                <!-- 列表 -->
                <ul>
                    <li><router-link to="/home"><img src="./images/logo.png" alt=""></router-link></li>
                    <li><router-link to="/home"><el-link type="success">文章</el-link></router-link></li>
                    <li><router-link to="/ChatRoom"><el-link type="success">聊天室</el-link></router-link></li>
                    <li><router-link to="/MessageBoard"><el-link type="success">留言板</el-link></router-link></li>
                    <li><el-link type="success">社区</el-link></li>
                    <li>
                        <a href="https://github.com/wang221027/vue3-ts-vite.git" target="_blank">
                            <el-link type="success">GitHub<el-icon>
                                    <Promotion />
                                </el-icon></el-link>
                        </a>
                    </li>
                </ul>
                <!-- 搜索框 -->
                <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" placeholder="请输入您要搜索的内容"
                    @select="handleSelect" class="input_box" />
                <!-- 发布文章 -->
                <div @click="goArticle" class="goArticle">
                    <button style="cursor: pointer;">
                        <span class="text" style="color: #000;">发布文章</span>
                        <span class="shimmer"></span>
                    </button>
                </div>

                <!-- 登录注册 -->
                <div class="userOperate" v-if="isLoginAndRegisterShow == 'true'">
                    <!-- 登录 -->
                    <el-button type="primary" @click="goLogin">登录</el-button>
                    <!-- 注册 -->
                    <el-button type="success" @click="goRegister">注册</el-button>
                </div>
                <!-- 用户头像 -->
                <div class="listContent" style="cursor: pointer;" v-if="isShow">
                    <el-avatar :src="avatarUrl" v-if="avatarUrl" style="border: 2px solid #ccc;"
                        @click="goPersonalCenter"></el-avatar>
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                        style="border: 2px solid #ccc;" v-if="avatarUrl == null" @click="goPersonalCenter"></el-avatar>
                    <ul class="listNone" ref="listNone">
                        <li><el-button type="primary" @click="goPersonalCenter">个人主页</el-button></li>
                        <li><el-button type="success" @click="quit">退出登录</el-button></li>
                        <li>
                            <label for="file2" class="changeFile">更换头像</label>
                            <input type="file" id="file2" style="display: none;" @change="handleFileUpload">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang='less' scoped>
// 头部顶盒子
.header {
    width: 100%;
    height: 80px;

    // 固定定位大盒子
    .position_fixed {
        position: fixed;
        display: flex;
        width: 100vw;
        align-items: center;
        height: 80px;
        top: 0;
        z-index: 99;
        transition: all .5s;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background-color: #fff;

        // 导航栏
        .nav {
            width: 1400px;
            display: flex;
            height: 80px;
            justify-content: space-between;
            align-items: center;
            margin: 0 auto;

            // 列表
            ul {
                display: flex;

                li {

                    // logo
                    a {
                        img {
                            width: 50px;
                            transform: scale(1.2);
                            margin: 0 8px;
                        }
                    }

                    /deep/ .el-link__inner {
                        margin: 0 8px;
                        font-size: 16px;
                    }
                }
            }

            // 搜索框
            /deep/ .el-input__inner {
                width: 400px;
                height: 40px;
            }
        }
    }

    .listContent {
        display: flex;
        align-items: center;
        width: 40px;
        height: 80px;
        position: relative;
    }

    .listContent:hover .listNone {
        height: 160px !important;
    }

    // 鼠标经过头像时显示
    .listNone {
        position: absolute;
        left: -40px;
        top: 80px;
        width: 120px;
        text-align: center;
        height: 0;
        background: #fff;
        z-index: 9999;
        border-radius: 2px;
        flex-wrap: wrap;
        justify-content: center;
        transition: all .5s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        overflow: hidden;

        li {
            margin: 6px 0;
            display: block;

            .changeFile {
                display: inline-block;
                line-height: 1;
                white-space: nowrap;
                cursor: pointer;
                text-align: center;
                box-sizing: border-box;
                outline: 0;
                transition: .1s;
                font-weight: 500;
                padding: 10px 16px;
                font-size: 14px;
                border-radius: 4px;
                color: #FFF;
                background-color: #F56C6C;
                border-color: #F56C6C;
            }
        }
    }
}

// 响应式 1500px
@media screen and (max-width: 1500px) {

    // 导航栏
    .nav {
        width: 1200px !important;
    }
}

// 1300px
@media screen and (max-width: 1300px) {

    // 导航栏
    .nav {
        width: 1000px !important;
    }

    // 搜索框
    /deep/ .el-input__inner {
        width: 300px !important;
    }
}

// 1100px
@media screen and (max-width: 1100px) {

    // 导航栏
    .nav {
        width: 800px !important;
    }

    // 搜索框
    /deep/ .el-input__inner {
        width: 200px !important;
        height: 30px !important;
        font-size: 14px !important;
    }

    // 导航栏li
    /deep/ .el-link__inner {
        margin: 0 4px !important;
        font-size: 14px !important;
    }
}

// 996px
@media screen and (max-width: 996px) {

    // 导航栏
    .nav {
        width: 700px !important;
    }

    // 搜索框
    /deep/ .el-input__inner {
        width: 150px !important;
        height: 30px !important;
        font-size: 14px !important;
    }

    // 导航栏li
    /deep/ .el-link__inner {
        margin: 0 2px !important;
    }
}

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
        width: 280px !important;
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

    .changeFileNone {
        display: inline-block;
        width: 100px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        text-align: center;
        background: orange;
        border-radius: 4px;
        cursor: pointer;
    }
}

// 600px
@media screen and (max-width: 600px) {

    // 导航栏
    .nav {
        width: 450px !important;
    }

    .nav ul li {
        display: none !important;
    }

    .nav ul li:nth-child(1) {
        display: block !important;
    }

    // 搜索框
    /deep/ .el-input__inner {
        display: none !important;
    }

    // 导航栏li
    /deep/ .el-link__inner {
        margin: 0 6px !important;
    }

    /deep/ .el-input {
        display: none;
    }

    .changeFileNone {
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 30px;
    }
}

// 500px
@media screen and (max-width: 500px) {

    // 导航栏
    .nav {
        width: 350px !important;
    }

    .nav ul li {
        display: none !important;
    }

    .nav ul li:nth-child(1) {
        display: block !important;
    }

    // 搜索框
    /deep/ .el-input__inner {
        width: 150px !important;
        height: 30px !important;
        font-size: 12px !important;
    }

    // 导航栏li
    /deep/ .el-link__inner {
        margin: 0 6px !important;
    }

    .changeFileNone {
        display: inline-block;
        width: 60px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
}

// 发布文章
:root {
    --glow-hue: 222deg;
    --shadow-hue: 180deg;
    --spring-easing: linear(0, 0.002, 0.01 0.9%, 0.038 1.8%, 0.156, 0.312 5.8%, 0.789 11.1%, 1.015 14.2%,
            1.096, 1.157, 1.199, 1.224 20.3%, 1.231, 1.231, 1.226, 1.214 24.6%,
            1.176 26.9%, 1.057 32.6%, 1.007 35.5%, 0.984, 0.968, 0.956, 0.949 42%,
            0.946 44.1%, 0.95 46.5%, 0.998 57.2%, 1.007, 1.011 63.3%, 1.012 68.3%,
            0.998 84%, 1);
    --spring-duration: 1.33s;
}

@property --shimmer {
    syntax: "<angle>";
    inherits: false;
    initial-value: 33deg;
}

@keyframes shimmer {
    0% {
        --shimmer: 0deg;
    }

    100% {
        --shimmer: 360deg;
    }
}

@keyframes shine {
    0% {
        opacity: 0;
    }

    15% {
        opacity: 1;
    }

    55% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes text {
    0% {
        background-position: 100% center;
    }

    100% {
        background-position: -100% center;
    }
}

.goArticle button {
    color: var(--bg);
    font-weight: 600;
    /*     background-image: linear-gradient(90deg, #fcecfe, #fbf6e7, #e6fcf5); */
    background-image: linear-gradient(315deg,
            #ffc4ec -10%,
            #efdbfd 50%,
            #ffedd6 110%);
    padding: .8em 1.4em;
    position: relative;
    isolation: isolate;
    box-shadow: 0 2px 3px 1px hsl(var(--glow-hue) 50% 20% / 50%), inset 0 -10px 20px -10px hsla(var(--shadow-hue), 10%, 90%, 95%);
    border-radius: 0.66em;
    scale: 1;
    transition: all var(--spring-duration) var(--spring-easing);
}

.goArticle button:hover:not(:active),
.goArticle button.active {
    transition-duration: calc(var(--spring-duration)*0.5);
    scale: 1.2;
    box-shadow: 0 4px 8px -2px hsl(var(--glow-hue) 50% 20% / 50%), inset 0 0 0 transparent;
}

.goArticle button:active {
    scale: 1.1;
    transition-duration: calc(var(--spring-duration)*0.5);
}

.shimmer {
    position: absolute;
    inset: -40px;
    border-radius: inherit;
    mask-image: conic-gradient(from var(--shimmer, 0deg),
            transparent 0%,
            transparent 10%,
            black 36%,
            black 45%,
            transparent 50%,
            transparent 60%,
            black 85%,
            black 95%,
            transparent 100%);
    mask-size: cover;
    mix-blend-mode: plus-lighter;
    animation: shimmer 1s linear infinite both;
}

.goArticle button:hover .shimmer::before,
.goArticle button:hover .shimmer::after,
.goArticle button.active .shimmer::before,
.goArticle button.active .shimmer::after {
    opacity: 1;
    animation: shine 1.2s ease-in 1 forwards;
}

.shimmer::before,
.shimmer::after {
    transition: all 0.5s ease;
    opacity: 0;
    content: "";
    border-radius: inherit;
    position: absolute;
    mix-blend-mode: color;
    inset: 40px;
    pointer-events: none;
}

.shimmer::before {
    box-shadow: 0 0 3px 2px hsl(var(--glow-hue) 20% 95%),
        0 0 7px 4px hsl(var(--glow-hue) 20% 80%),
        0 0 13px 4px hsl(var(--glow-hue) 50% 70%),
        0 0 25px 5px hsl(var(--glow-hue) 100% 70%);
    z-index: -1;
}

.shimmer::after {
    box-shadow: inset 0 0 0 1px hsl(var(--glow-hue) 70% 95%),
        inset 0 0 2px 1px hsl(var(--glow-hue) 100% 80%),
        inset 0 0 5px 2px hsl(var(--glow-hue) 100% 70%);
    z-index: 2;
}

.goArticle button .text {
    color: transparent;
    background-clip: text;
    background-color: var(--bg);
    background-image: linear-gradient(120deg, transparent, hsla(var(--glow-hue), 100%, 80%, 0.66) 40%, hsla(var(--glow-hue), 100%, 90%, .9) 50%, transparent 52%);
    background-repeat: no-repeat;
    background-size: 300% 300%;
    background-position: center 200%;
}

.goArticle button:hover .text,
.goArticle button.active .text {
    animation: text .66s ease-in 1 both;
}</style>