<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入路由构造器
import { useRouter, useRoute } from 'vue-router'
// 注册路由构造器
const $router = useRouter()
const $route = useRoute()
// 引入全局事件总线
import $bus from '@/utils/event-bus'
// 引入 Element-plus message消息提示
import { ElMessage } from 'element-plus'
// 引入根据用户id获取文章列表和封面api
import { getUserIdList, getUserIdCover, delUserList, reqUserEmail } from '@/api/PersonalCenter'
// 存储用户文章列表
let userListData: any = ref([])
// 列表封面url集合
let userIdCoverData: any = ref([])
// 用户个人简介
let userInfo = ref('您还没有设置个人简介~')
// 存储用户列表总数量
let total = ref<number>(0)
// 用户头像url
let avatarUrl: any = ref(null)
// 用户昵称
let nickname: any = ref("")
// 根据用户id获取文章列表
let getUserIdListData = async () => {
    const results: any = await getUserIdList()
    const filterResults = results
    filterResults.data.forEach((item: any, index: number) => {
        item.init_id = (index + 1);
    });
    userListData.value = results.data.sort((a: any, b: any) => {
        return b.id - a.id;
    });
    total.value = userListData.value.length;
}
// 根据用户id获取文章封面
let getUserIdCoverData = async () => {
    const results: any = await getUserIdCover()
    const filterResults = results;
    filterResults.data.forEach((item: any, index: number) => {
        item.init_id = (index + 1);
    });
    userIdCoverData.value = results.data;
}
// 从本地获取用户头像url
let getUserIdCoverUrl = () => {
    const getAvatarUrl = localStorage.getItem("avatarUrl");
    avatarUrl.value = getAvatarUrl
}
// 从本地获取用户昵称
let getUserNickName = () => {
    const getUserNickName = localStorage.getItem("nickname");
    nickname.value = getUserNickName
}
// 删除文章
let removeArticle = async (id: number) => {
    const results = await delUserList(id)
    if (results.status == 0) {
        ElMessage({
            message: '删除成功！',
            type: "success",
            offset: 100
        })
        getUserIdListData()
    }
}
// 获取用户个人简介
let getUserEmail = async () => {
    const results = await reqUserEmail()
    if (results.status == 0 && results.data.email) {
        userInfo.value = results.data.email;
        localStorage.setItem("nickname", results.data.nickname)
        getUserNickName()
    }
}
// 点击编辑资料跳转到编辑个人资料路由
let goEditData = () => {
    $router.push({ name: 'EditData' })
}
// 点击标题跳转到对应的文章详情
let goArticleCover = (id: number) => {
    $router.push({ name: 'cover', query: { id } })
}
// 更换头像
let handleFileUpload = () => {
    $bus.emit("changeCover")
}
// 退出登录
let quit = () => {
    $bus.emit("myQuit")
}
onMounted(() => {
    // 根据用户id获取文章列表
    getUserIdListData();
    // 根据用户id获取文章封面
    getUserIdCoverData();
    // 从本地获取用户头像url
    getUserIdCoverUrl();
    // 定义全局事件总线更新用户头像url
    $bus.on("updateCoverUrl", () => {
        // 从本地获取用户头像url
        setTimeout(() => {
            getUserIdCoverUrl();
        }, 500)
    })
    // 从本地获取用户昵称
    getUserNickName();
    // 获取用户个人简介
    getUserEmail()
    // 判断是否是从修改个人简介跳转过来的,重新获取用户昵称
    const getIsGetUserInfo: any = $route.query.isGetUserInfo;
    if (getIsGetUserInfo) {
        getUserEmail()
    }
})
// 编辑
let compile = (id: string, name: string, type: string, alias: string) => {
    $router.push({ name: 'article', query: { isShow: 'true', id, name, type, alias } })
}
</script>
<template>
    <main>
        <!-- 返回上一级 -->
        <GoBack color="#000" content="个人主页" width="1400px" class="go_back" />
        <!-- 上边用户信息 -->
        <div class="content_top">
            <div style="display: flex;">
                <div class="demo-type">
                    <!-- 用户头像 -->
                    <div style="width: 100px;height: 100px;transform: translateY(-36px);" class="avatar">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                            v-if="avatarUrl == 'undefined'"></el-avatar>
                        <el-avatar :src="avatarUrl" v-if="avatarUrl != 'undefined'"></el-avatar>
                    </div>
                </div>
                <!-- 用户姓名 -->
                <div class="top_content" style="display: flex;">
                    <h1 class="top_h1">{{ nickname }}</h1>
                    <div style="display: flex;transform: translate(768px, -27px);">
                        <el-row class="top_compile"><el-button round @click="goEditData"><i
                                    class="el-icon-edit-outline"></i>编辑资料</el-button></el-row>
                        <div style="display:flex;margin-top: 20px;">
                            <el-row style="margin-left: 20px;margin-top: 8px;">
                                <label for="file2" class="changeFile">更换头像</label>
                                <input type="file" id="file2" style="display: none;" @change="handleFileUpload">
                            </el-row>
                            <el-row style="margin-left: 20px;margin-top: 8px;">
                                <label class="changeFile" @click="quit">退出登录</label>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 个人简介 -->
            <div class="personageResume">个人简介：<h6 class="user_info">{{ userInfo }}</h6>
            </div>
        </div>
        <!-- 主体内容 -->
        <div class="main">
            <!-- 左边内容 -->
            <div class="personal">
                <el-calendar>
                    <template #date-cell="{ data }">
                        <p :class="data.isSelected ? 'is-selected' : ''">
                            {{ data.day.split('-').slice(1).join('-') }}
                            {{ data.isSelected ? '✔️' : '' }}
                        </p>
                    </template>
                </el-calendar>
            </div>
            <!-- Element-UI组件，如果数据为空显示 -->
            <div v-if="userListData.length <= 0" style="flex: 0.6;background-color: #fff;" class="ui_flex">
                <el-empty description="您还没有发布文章"></el-empty>
            </div>
            <!-- 文章列表 -->
            <div class="box" v-if="userListData.length > 0">
                <ul>
                    <li v-for="item in userListData" :key="item.id" :style="{}">
                        <div class="title_flex" :style="{
                            height: userIdCoverData[item.init_id - 1]?.file == 'show' ? '280px' : ''
                        }"
                            v-if="userListData[total - item.init_id] && userListData[total - item.init_id].is_delete == 0">
                            <div class="title_bg" :style="{
                                backgroundImage: item.id === userListData[total - item.init_id]?.id ? `url(${userIdCoverData[item.init_id - 1]?.title_url})` : '',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                margin: '0 auto'
                            }" v-if="userIdCoverData[item.init_id - 1]?.file === 'show'">
                            </div>
                            <div class="title_content"
                                :style="{ flex: userIdCoverData[item.init_id - 1]?.file === 'show' ? '0.6' : '1' }"
                                :data-title-id="item.id">
                                <el-link type="primary" class="link-h1" @click="goArticleCover(item.id)">{{ item.name
                                }}</el-link>
                                <br>
                                <el-link type="info" @click="goArticleCover(item.id)">{{ item.alias }}</el-link>
                                <div style="position: relative;height: 32px;display: flex;justify-content: space-between; align-items: center;"
                                    class="title_span">
                                    <span>作者：{{ item.nickname }}</span>
                                    <span>文章类型：{{ item.type }}</span>
                                    <span class="putTime_none">发布日期：{{ item.time }}</span>
                                </div>
                                <div class="compile">
                                    <!-- 编辑 -->
                                    <el-button type="primary" plain
                                        @click="compile(item.id, item.name, item.type, item.alias)">编辑</el-button>
                                    <!-- 删除 -->
                                    <el-popconfirm title="确认要删除吗？" @confirm="removeArticle(item.id)">
                                        <template #reference>
                                            <el-button>删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </main>
</template>
<style scoped lang="less">
// 上边用户信息
.content_top {
    width: 1400px;
    margin: 0 auto;
    margin-top: 40px;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;

    // 个人头像
    .el-avatar {
        width: 100px;
        height: 100px;
        border: 2px solid #ccc;
    }

    // 用户姓名
    .top_h1 {
        margin-left: 20px;
        font-size: 24px;
    }

    // 编辑资料
    .top_compile {
        margin-left: 86px;
        margin-top: 26px;
    }

    // 个人简介
    .personageResume {
        display: flex;
        flex-wrap: wrap;
        margin-left: 120px;
        margin-top: -50px;
        font-size: 15px;
    }

    // 个人简介内容
    .user_info {
        font-size: 16px;
    }
}

main {
    padding-top: 20px;
    background-color: #ccc;
}
.ui_flex {
    height: 300px;
}
// 主体内容
.main {
    width: 1400px;
    margin: 0px auto;
    padding: 20px;
    display: flex;
    justify-content: space-between;

    //左边内容
    .personal {
        flex: 0.38;
        // 日历
        .is-selected {
            color: #1989fa;
        }
    }
    // 列表
    .box {
        width: 850px;
        background-color: #fff;
        padding: 20px;
        flex: 0.6;

        ul {
            li {
                .title_flex {
                    height: 180px;
                    padding: 10px;
                    border-bottom: 2px solid #ccc;
                    align-items: center;
                }

                .link-h1,
                p {
                    cursor: pointer;
                    margin: 8px 0;
                    font-size: 16px;
                }

                p {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .link-h1 {
                    font-size: 18px;
                    font-weight: bold;
                    display: inline-block;
                }

                div {
                    span {
                        display: inline-block;
                        margin: 8px 0;
                    }
                }
            }

            li:hover {
                background: #fafafa;
            }

            li:hover .compile {
                opacity: 1;
            }

            .title_flex {
                display: flex;
                justify-content: space-between;
            }

            .el-col-14 {
                width: 100%;
                border-radius: 10px;
            }

            .title_bg {
                width: 180px;
                height: 100px;
                overflow: hidden;
                border: 1px solid #ccc;
                flex: 0.3;
            }

            .title_content {
                flex: 0.6;
                overflow: hidden;

                // 编辑和删除按钮样式
                .compile {
                    float: right;
                    cursor: pointer;
                    color: green;
                    font-size: 16px;
                    opacity: 0;
                    margin: 4px 0;
                }

                /deep/ .el-link__inner {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    white-space: normal;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                }

                // 个人简介
                .title_span {
                    flex-wrap: wrap;

                    span {
                        font-size: 14px;
                    }
                }
            }

        }
    }
}

.changeFile {
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background-color: #1C86EE;
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
    color: #fff;
}

// 响应式 1500px
@media screen and (max-width: 1500px) {

    // 上边用户信息、主体
    .content_top,
    .main {
        width: 1200px;
    }
}

// 1300px
@media screen and (max-width: 1300px) {

    // 上边用户信息、主体
    .content_top,
    .main {
        width: 1000px;
    }

    // 返回上一级
    .go_back {
        display: none;
    }

    .compile {
        margin-top: 34px !important;
    }
}

// 1100px
@media screen and (max-width: 1100px) {

    // 上边用户信息、主体
    .content_top,
    .main {
        width: 900px;
    }

    .compile {
        margin-top: 34px;
    }

    .putTime {
        font-size: 14px;
    }

    .compile {
        opacity: 1 !important;
    }
}

// 996px
@media screen and (max-width: 996px) {

    // 上边用户信息、主体
    .content_top,
    .main {
        width: 700px;
    }

    .personal {
        display: none;
    }

    .box {
        flex: 1 !important;
    }

    // 如果没有发布文章，显示element-ui组件
    .ui_flex {
        flex: 1 !important;
    }
}

// 768px
@media screen and (max-width: 768px) {

    // 上边用户信息、主体
    .content_top,
    .main {
        width: 550px;
    }

    .top_h1 {
        margin-left: 12px !important;
        margin-top: 12px !important;
        font-size: 24px !important;
    }

    .top_compile {
        margin-left: 51px !important;
        margin-top: 8px !important;
    }

    .title_flex {
        display: block !important;
    }

    // 用户头像
    .avatar {
        width: 50px !important;
        height: 50px !important;

        span {
            width: 50px !important;
            height: 50px !important;
        }
    }

    // 个人简介
    .personageResume {
        margin: 0 !important;
    }

    // 用户姓名
    .top_h1 {
        font-size: 16px !important;
    }

}

// 600px
@media screen and (max-width: 600px) {

    // 上边用户信息、主体
    .content_top,
    .main {
        width: 400px;
    }
}

// 500px
@media screen and (max-width: 500px) {

    // 上边用户信息、主体
    .content_top,
    .main {
        width: 350px;
        padding: 10px;
    }
}</style>