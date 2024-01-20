<script setup lang='ts'>
import { onMounted, ref, nextTick } from 'vue'
import { io } from "socket.io-client";
import $ from 'jquery';
import { Promotion } from '@element-plus/icons-vue'
// 引入全局事件总线
import $bus from '@/utils/event-bus'
// userToken 获取用户id及昵称 reqArticleCover 根据id获取用户头像url
import { userToken, reqArticleCover } from '@/api/header'
// 引入 store 创库
import { userSocket } from '@/store/socket'
const userSocketData = userSocket();
// 引入 Element-plus message消息提示
import { ElMessage } from 'element-plus'
// 存储用户id
let id: any = ref(0)
// 存储用户头像url
let avatar = ref('')
// 如果用户没有头像默认头像
let notAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
// 存储用户发送的消息
let sendInfoInput = ref('')
// 存储用户的昵称
let nickname = ref('')
// 聊天页面是否显示
let isBlock = ref(false)
// 搜索框
const state = ref('')
interface LinkItem {
    value: string,
    link: string
}
const links = ref<LinkItem[]>([])
const loadAll = () => {
    return userSocketData.userList.map((item: any) => {
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
    console.log(item);
}
let getUserInfoList = () => {
    // 向数据库获取用户聊天信息
    socket.emit("reqUserList")
    socket.on("reqUserInfoList", (data: any) => {
        userSocketData.reqChatMessageList(data); // 存储自己的消息
    })
}
// 发送信息
let sendInfo = () => {
    var time = new Date();
    if (sendInfoInput.value.trim() == '') {
        return ElMessage({
            message: '内容不能为空！',
            type: 'error',
            offset: 100
        })
    }
    if(userSocketData.chatType == '') {
        return ElMessage({
            message: '您还没有选择聊天人',
            type: 'error',
            offset: 100
        })
    }
    /* 发送消息 */
    /* 先判断是群聊还是私聊 */
    const messageData = {
        type: 'my',
        sender: nickname.value, // 发送者id
        senderimg: avatar.value, // 发送者的img
        receiver: userSocketData.chatType == '默认群聊' ? '默认群聊' : userSocketData.userInfo.name, // 接收方id
        time: time.toLocaleString(), // 发送时间
        user_id: id.value,
        msg: sendInfoInput.value, // 消息内容
    };
    if (userSocketData.chatType == '默认群聊') {
        console.log('默认群聊执行');
        socket.emit('groupChat', messageData);
        userSocketData.updateChatMessageList(messageData); // 存储自己的消息
        socket.emit("insertUserInfo", messageData)
        nextTick(() => {
            $(".div1 p").children(":last").get(0)?.scrollIntoView(false)
        })
    } else {
        console.log('私聊执行');
        socket.emit('privateChat', messageData);
        userSocketData.updateChatMessageList(messageData); // 存储自己的消息
        socket.emit("insertUserInfo", messageData)
        nextTick(() => {
            $(".div1 p").children(":last").get(0)?.scrollIntoView(false)
        })
    }
    /* 清空输入框 */
    sendInfoInput.value = '';
}
// 存储用户id及昵称
let socket: any;
let getUserToken = async () => {
    const token = localStorage.getItem("token")
    if (token) {
        const results = await userToken();
        // 存储用户id
        id.value = results.data.id;
        // 根据id获取用户头像url
        const results2 = await reqArticleCover(id.value);
        console.log(results2);
        if (results2.data.length > 0) {
            avatar.value = results2.data[0].title_url
        } else {
            avatar.value = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
        }
        // 存储用户的昵称
        nickname.value = results.data.nickname;
        // 模拟登录成功后的操作
        const user = { name: results.data.nickname, id: results.data.id, avatar: avatar.value };
        // 假设登录成功后的回调函数中调用connectSocket方法
        connectSocket(user);
        socket.emit("updateUserAvatar", avatar.value, id.value)
    }
}
function connectSocket(user: any) {
    // 使用用户信息建立Socket连接
    socket = io("http://43.138.70.109:8010", { 
        query: { userId: user.id, userName: user.name, user_id: id.value, nickname: userSocketData.userInfo.name },
    });
    // socket = io("http://127.0.0.1:4000", {
    //     query: { userId: user.id, userName: user.name, user_id: id.value, nickname: userSocketData.userInfo.name },
    // });
    socket.emit("login", { user_id: user.id, name: user.name, avatar: user.avatar })
    socket.on("loginData", (data: any) => {
        userSocketData.storageUser(data, id.value)
    })
    // 监听更新聊天消息列表事件
    socket.on('updateChatMessageList', (data: any) => {
        if (userSocketData.chatType == '默认群聊') {
            userSocketData.updateChatMessageList(data);
            socket.emit("insertUserInfo", data)
            nextTick(() => {
                $(".div1 p").children(":last").get(0)?.scrollIntoView(false)
            })
        };
    })
    // 监听更新聊天消息列表事件
    socket.on('updateChatMessageList2', (data: any) => {
        if (userSocketData.chatType != '默认群聊') {
            userSocketData.updateChatMessageList(data);
            socket.emit("insertUserInfo", data)
            nextTick(() => {
                $(".div1 p").children(":last").get(0)?.scrollIntoView(false)
            })
        }
    });
    // 用户掉线
    socket.emit("getUserId", id.value)
    // 向数据库获取用户聊天信息
    getUserInfoList()
}
// 点击左侧默认群聊
let changeType = () => {
    userSocketData.changeType()
    isBlock.value = true;
}
// 点击左侧好友列表
let changeUser = (name: string) => {
    socket.emit("reqUserInfo", name)
    userSocketData.changeUser(name)
    isBlock.value = true;
}
onMounted(() => {
    // 存储用户id及昵称
    getUserToken();
    links.value = loadAll()
    $bus.on("updateUserUrl", () => {
        getUserToken()
    })
})
</script>
<template>
    <div>
        <!-- 聊天 -->
        <el-container>
            <el-aside width="350px">
                <div>
                    <el-row style="height: 60px">
                        <!-- 我的信息 -->
                        <div class="myinfo">
                            <el-avatar :src="avatar || notAvatar"></el-avatar>
                            <span>{{ nickname }}</span>
                        </div>
                    </el-row>
                    <!-- 搜索框 -->
                    <el-autocomplete v-model="state" :fetch-suggestions="querySearchAsync" placeholder="请输入您要搜索的内容"
                        @select="handleSelect" class="input_box input_box2" style="width: 98%;" />
                    <ul class="user_list">
                        <li @click="changeType" :class="{ bg_active: userSocketData.chatType == '默认群聊' && isBlock }">
                            <div class="block">
                                <el-avatar shape="square" :size="50" :src="notAvatar" />
                            </div>
                            <div class="avatar_right">
                                <div class="avatar_right_time">
                                    <h4>默认群聊</h4>
                                </div>
                                <div class="avatar_right_content">
                                    聊天内容
                                </div>
                            </div>
                        </li>
                        <li v-for="(item, index) in userSocketData.userList" :key="index" @click="changeUser(item.name)"
                            :class="{ bg_active: item.name == userSocketData.userInfo.name && isBlock }">
                            <div class="block">
                                <el-avatar shape="square" :size="50" :src="item.avatar" />
                            </div>
                            <div class="avatar_right">
                                <div class="avatar_right_time">
                                    <h4>{{ item.name }}</h4>
                                    <p>12: 00</p>
                                </div>
                                <div class="avatar_right_content">
                                    聊天内容
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-aside>
            <el-container :class="{ display_block: isBlock }">
                <el-header style="position: relative;">
                    <span style="position: absolute;left: 20px; color: green;cursor: pointer;" @click="isBlock = false"
                        v-show="isBlock" class="fan">返回</span>
                    <span v-if="userSocketData.chatType == '默认群聊'">{{ userSocketData.chatType }}({{
                        userSocketData.userList.length + 1 }})</span>
                    <span v-else>{{ userSocketData.chatType }}</span>
                </el-header>
                <el-main>
                    <div class="div1">
                        <!-- 先循环找到你想要聊天的那个人 -->
                        <div v-for="(list, index) in userSocketData.chatMessageList" :key="index">
                            <!-- 有聊天记录：循环聊天记录 -->
                            <div
                                v-if="(list.receiver == userSocketData.userInfo.name) && userSocketData.chatType == '默认群聊'">
                                <!-- 再循环显示聊天记录 -->
                                <p :class="{ 'right': list.type == 'my' }" style="position: relative;height: 60px;"
                                    v-if="(list.type == 'my' && list.user_id == id) || list.type == 'user'"
                                >
                                    <span v-if="list.type == 'user'" class="myName">{{ list.sender }}</span>
                                    <el-avatar v-if="list.type == 'user'" :src="list.senderimg"></el-avatar>
                                    <el-avatar v-if="list.type == 'my' && list.user_id == id" :src="list.senderimg"
                                        style="float:right;"></el-avatar>
                                    <span class="content" v-if="list.type == 'my' && list.user_id == id">{{ list.msg }}</span>
                                    <span class="content" v-if="list.type == 'user'">{{ list.msg }}</span>
                                </p>
                            </div>
                            <div v-else>
                                <!-- 根据接收者和发送者定位聊天记录 -->
                                <div class="not_qun"
                                    v-if="((list.receiver == nickname) && (list.sender == userSocketData.userInfo.name)) || ((list.receiver == userSocketData.userInfo.name) && (list.sender == nickname))">
                                    <!-- 再循环显示聊天记录 -->
                                    <p :class="{ 'right': list.type == 'my' }" style="position: relative;height: 60px;">
                                        <span v-if="list.type == 'user'" style="display: block;">{{ list.sender }}</span>
                                        <el-avatar v-if="list.type == 'user'" :src="list.senderimg"></el-avatar>
                                        <el-avatar v-if="list.type == 'my'" :src="list.senderimg"
                                            style="float:right;"></el-avatar>
                                        <span class="content">{{ list.msg }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-main>
                <el-footer>
                    <div>
                        <!-- <el-input placeholder="请输入内容" v-model="sendInfoInput"><span class="Promotion" style="display: inline-block;width: 40px;height: 40px;"></span></el-input> -->
                        <div class="mt-3">
                            <el-input v-model="sendInfoInput" placeholder="请输入您要发送的内容" class="input-with-select"
                                @keydown.enter="sendInfo">
                                <template #append>
                                    <el-button :icon="Promotion" @click="sendInfo" />
                                </template>
                            </el-input>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>
<style scoped lang="less">
.bg_active {
    background-color: yellow !important;
}

.el-header,
.el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    height: 500px;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    height: 280px;
}

.el-container {
    width: 1200px;
    margin: 0 auto;
}

/* myMain */
.div1 {
    width: 100%;
}

.div1 P {
    width: 100%;
    height: 50px;
}

.content {
    background-color: antiquewhite;
    padding: 10px;
    border-radius: 10px;
    font-weight: bold;
}

.right {
    text-align: right;
}

.left {
    text-align: left;
}

.myinfo {
    text-align: left;
    vertical-align: middle;
    margin-top: 10px;
    margin-left: 10px;
}

.myinfo span {
    text-align: left;
    vertical-align: middle;
}

.userlist {
    vertical-align: middle;
    cursor: pointer;
}

.userlist span {
    vertical-align: middle;
    margin-left: 10px;
}

.user_list {
    li:hover {
        background-color: #dbd9d9;
    }

    li {
        display: flex;
        margin: 4px 0;
        padding: 10px;
        transition: all .3s;

        .avatar_right {
            width: 100%;
            padding: 0 10px;

            // 聊天时间
            .avatar_right_time {
                display: flex;
                justify-content: space-between;
            }

            // 聊天内容
            .avatar_right_content {
                text-align: left;
                margin-top: 4px;
            }
        }
    }
}

.myName {
    position: absolute;
    left: 48px;
    top: -10px;
    font-size: 14px;
}

.content {
    display: inline-block;
}

.el-container {
    display: flex !important;
}

.el-main {
    height: 380px;
}

.is-vertical.display_block {
    display: block !important;
}
.fan {
    display: none;
}
// 1300px
@media screen and (max-width: 1300px) {
    .el-container {
        width: 1000px;
    }
}

// 1100px
@media screen and (max-width: 1100px) {
    .el-container {
        width: 800px;
    }

    .el-aside {
        width: 250px !important;
    }

}

// 996px
@media screen and (max-width: 996px) {
    .el-container {
        width: 700px;
    }

    .el-aside {
        width: 200px !important;
    }

    /deep/ .input_box2 {
        display: none;
    }
}

// 768px
@media screen and (max-width: 768px) {

    .el-container {
        display: block;
        width: 350px;
    }

    .el-aside {
        width: 100% !important;
    }

    .is-vertical {
        position: absolute;
        top: 140px;
        display: none !important;
    }

    .el-main {
        height: 420px;
    }

    .el-aside {
        height: 600px;
    }

    /deep/ .el-input__wrapper {
        width: 30px;
    }
    .fan {
        display: block;
    }
}

// 600px
@media screen and (max-width: 600px) {}

// 500px
@media screen and (max-width: 500px) {}
</style>
