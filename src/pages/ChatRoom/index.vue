<script setup lang='ts'>
import { onMounted, ref, reactive, nextTick, computed } from 'vue'
import { io } from "socket.io-client";
// 引入 Element-plus 提示信息
import { ElMessage } from 'element-plus';
// 引入 pinia 小创库
import { userSocket } from '@/store/socket'
const socketStore = userSocket();
// 引入 api 接口
import { reqUsreInfo, reqUserData } from '@/api/socket/index'
// 引入字体图标样式
import './font/xiaolian/iconfont.css'
// 引入类型
// import { tokenData } from '@/api/socket/type'
let nickname: any = ref('')
// 存储用户头像
let avatar = ref('')
// 存储用户发送的信息
let userInfo = ref('')
// 表情是否显示
let isEmojiBlock = ref(false)
// 表情
import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";
// @ts-ignore
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
const emojiIndex = new EmojiIndex(data)
const showEmoji = (emoji: any) => {
    userInfo.value = userInfo.value + emoji.native;
}
// 判断用户聊天记录最后一条是否在好友列表显示
let isMessage = ref(false)
// 好友列表滚动触底事件
const load = () => {

}
let getUserToken = async () => {
    const token = localStorage.getItem("token")
    if (token) {
        let data = {
            user_id: localStorage.getItem("userId"),
            name: localStorage.getItem("nickname"),
            avatar: localStorage.getItem("avatarUrl")
        }
        connectSocket(data)
    }
}
let socket: any;
function connectSocket(data: any) {
    // 使用用户信息建立Socket连接
    socket = io("http://wyuanlin.site:8010", {
        query: data
    });
    // 向服务器提交用户信息
    socket.emit("login", data)
    // 接收服务器返回的用户信息
    // socket.on("reqUserDataList", (data: any) => {

    // })
    // 让信息出现在可视区
    socket.on("reqData", (data: any) => {
        socketStore.chatMessageList = data;
        returnTop()
        returnUserTop()
    })
    // 当有用户连接时更新用户列表
    socket.on("updateUserList", () => {
        // 获取用户信息
        getUserData();
    })
}
// 封装群聊信息可视区函数
let returnTop = () => {
    nextTick(() => {
        const filterElement = document.querySelectorAll("#messages li");
        let lastElement: any = null;
        filterElement.forEach((item: any) => {
            if (item.dataset.message === '默认群聊') {
                lastElement = item;
            }
        });
        const chatContainer = document.querySelector("#messages");
        if (lastElement) {
            lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            const bottomElement = chatContainer!.lastElementChild;
            if (bottomElement) {
                bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }
    });
}
let returnUserTop = () => {
    nextTick(() => {
        const filterElement = document.querySelectorAll("#messages li");
        let lastElement: any = null;
        filterElement.forEach((item: any) => {
            if (item.dataset.message == socketStore.chatType) {
                lastElement = item;
            }
        });
        const chatContainer = document.querySelector("#messages");
        if (lastElement) {
            lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            const bottomElement = chatContainer!.lastElementChild;
            if (bottomElement) {
                bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }
    });
}
// 发送信息
let sendInfo = () => {
    if (userInfo.value.trim() == '') {
        return ElMessage({
            message: '内容不允许为空！',
            type: 'error',
            offset: 120
        })
    }
    let obj = reactive({
        content: userInfo.value,
        userId: localStorage.getItem("userId") || '',
        avatar: localStorage.getItem("avatarUrl"),
        nickname: localStorage.getItem("nickname") || '',
        infoType: socketStore.chatType,
        userName: localStorage.getItem("nickname") || '',
    })
    socket.emit("sendInfo", obj)
    userInfo.value = ''
}
// 获取用户聊天记录
let getUserInfo = async () => {
    const results: any = await reqUsreInfo()
    socketStore.chatMessageList = results.data;
    isMessage.value = true;
    isUserMessage.value = true;
}
const input = ref('')
// 点击后让输入框获取焦点
let textareaFocus = () => {
    document.getElementById("textarea")?.focus()
}
// 获取用户信息
let getUserData = async () => {
    const results: any = await reqUserData();
    socketStore.userList = results;
    returnTop()
}
// 点击好友回调
let tabUser = (name: string) => {
    socketStore.chatType = name;
    returnUserTop()
}
// 默认群聊
let defaultMessage = () => {
    socketStore.chatType = "默认群聊";
    returnTop()
}
// 过滤出群聊信息
let componentDefaultMessage = computed(() => {
    let message: any
    if (isMessage.value) {
        message = socketStore.chatMessageList.filter((element: any) => element.is_type == '默认群聊')
    }
    return message;
})
// 过滤出私聊用户信息
let computedMessage = computed(() => {
    const message = socketStore.chatMessageList.filter((element: any) => element.is_type != '默认群聊')
    return message;
})
let isUserMessage = ref(false)
let computedUserMessage = computed(() => (name: any) => {
    let arr = computedMessage.value.filter((element: any) => element.infoType === name && element.userName === nickname.value);
    if (arr.length > 0) {
        return arr[arr.length - 1].content;
    } else {
        // 处理数组为空的情况，例如返回一个默认值或者抛出错误
        return 'No content found';
    }
});
// 检测用户头像是否更新
let watchAvatar = () => {
    let userId = localStorage.getItem("userId")
    let userAvatar = localStorage.getItem("avatarUrl")
    if(userId) {
        let filterElement: any = socketStore.userList.filter((element: any) => element.user_id == userId)
        if(userAvatar != filterElement.avatar) {
           socket.emit("updateAvatar", userAvatar)
        }
    }
    
}
onMounted(() => {
    getUserToken();
    avatar.value = localStorage.getItem("avatarUrl") as string;
    nickname.value = localStorage.getItem("nickname");
    // 获取用户聊天记录
    getUserInfo();
    // 获取用户信息
    getUserData();
    socketStore.chatType = '默认群聊'
    document.querySelectorAll(".emoji-mart-emoji").forEach((element: any) => {
        element.addEventListener('click', () => {
            isEmojiBlock.value = false;
        })
    })
    // 检测用户头像是否更新
    watchAvatar()
});
</script>
<template>
    <div class="container">
        <!-- 侧边栏 -->
        <div class="container_left" @click="isEmojiBlock = false">

        </div>
        <!-- 聊天好友 -->
        <div class="container_tabbar" @click="isEmojiBlock = false">
            <el-input v-model="input" style="width: 100%;" placeholder="搜索" />
            <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto;height: calc(100vh - 112px)">
                <li class="infinite-list-item" @click="defaultMessage" :class="{ active: socketStore.chatType == '默认群聊' }">
                    <div style="display: flex;align-items: center;">
                        <img src="http://43.138.70.109:8010/avatar/haizeiw.jpg" alt="">
                        <div>
                            <span>默认群聊</span>
                            <p style="font-size: 14px;">{{ isMessage &&
                                componentDefaultMessage[componentDefaultMessage.length -
                                    1].content }}</p>
                        </div>
                    </div>
                    <div class="infinite_time">
                        2024/3/3
                    </div>
                </li>
                <li v-for="item in socketStore.userList"
                    :class="['infinite-list-item', { active: socketStore.chatType == item.name }]"
                    @click="tabUser(item.name)" v-show="item.name != nickname">
                    <div style="display: flex;align-items: center;">
                        <img :src="item.avatar" alt="">
                        <div>
                            <span>{{ item.name }}<span class="on_line" v-show="item.is_delete == '0'"></span></span>
                            <p style="font-size: 14px;">{{ isUserMessage && computedUserMessage(item.name) }}</p>
                        </div>
                    </div>
                    <div class="infinite_time">
                        2024/3/3
                    </div>
                </li>
            </ul>
        </div>
        <!-- 内容 -->
        <div class="container_right" style="position: relative;">
            <div class="container_right_top" @click="isEmojiBlock = false">
                {{ socketStore.chatType }}
            </div>
            <!-- 聊天内容 -->
            <div class="container_right_content" @click="isEmojiBlock = false">
                <ul id="messages">
                    <li :style="{ textAlign: item.nickname == nickname && item.type == 'my' ? 'right' : 'left' }"
                        v-for="item in socketStore.chatMessageList" v-show="((item.infoType == socketStore.chatType && item.userName == nickname && item.infoType != '默认群聊') ||
                            item.userName == socketStore.chatType && item.infoType != '默认群聊' && item.infoType == nickname) ||
                            (item.infoType == '默认群聊' && item.is_type == socketStore.chatType)"
                        :data-message="item.infoType">
                        <img :src="item.avatar" style="width: 40px;height: 40px;"
                            v-show="item.type == 'user' || item.nickname != nickname"
                            :style="{ float: item.nickname == nickname ? 'right' : 'left' }">
                        <img :src="item.avatar" style="width: 40px;height: 40px;"
                            :style="{ float: item.nickname == nickname ? 'right' : 'left' }"
                            v-show="item.type == 'my' && item.nickname == nickname">
                        <div :style="[{ float: item.nickname == nickname ? 'right' : 'left' }]">
                            <span>{{ item.nickname }}</span>
                            <p :class="[{ 'row-1': item.nickname != nickname }, { 'row-2': item.nickname == nickname }]">{{
                                item.content }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 发送信息 -->
            <div class="container_right_bottom">
                <!-- 功能分区 -->
                <div class="sectorization">
                    <span class="iconfont icon-xiaolian1" @click="isEmojiBlock = !isEmojiBlock"></span>
                    <div class="is_hidden" v-show="isEmojiBlock">
                        <Picker :data="emojiIndex" set="twitter" @select="showEmoji" />
                    </div>
                </div>
                <!-- 发送框 -->
                <form action="" class="send_container" @click="isEmojiBlock = false">
                    <textarea v-model="userInfo" class="textarea__inner" @keydown.enter="sendInfo" id="textarea"
                        @click="textareaFocus"></textarea>
                    <el-button type="primary" @click="sendInfo">发送</el-button>
                </form>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.scroll {

    // 修改滚动条样式
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }
}

* {
    box-sizing: border-box;
}

.card-header {
    div {
        span {
            display: block;
            font-size: 12px;
            color: #b6b6b6;
        }
    }
}

.container {
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 80px);

    // 侧边栏
    .container_left {
        flex: 0.05;
        background-color: #333;
    }

    // 聊天好友
    .container_tabbar {
        flex: .18;
        height: calc(100vh - 80px);
        // 修改滚动条样式
        .scroll();

        .infinite-list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            padding: 0 10px;
            background-color: #e8e6e6;
            overflow: hidden;
            /* 隐藏超出部分的文本内容 */
            text-overflow: ellipsis;
            /* 使用省略号表示被隐藏的文本内容 */
            white-space: nowrap;

            /* 防止文本换行 */
            // 发送时间
            .infinite_time {
                font-size: 14px;
                color: #999;
                margin-top: -16px;
            }

            .on_line {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #17fa0a;
                margin-left: 4px;
            }
        }

        .infinite-list-item:hover {
            background-color: #c9c8c6;
        }

        .infinite-list-item.active {
            background-color: #c9c8c6;
        }

        img {
            display: block;
            width: 36px;
            height: 36px;
            margin-right: 10px;
        }
    }

    // 内容
    .container_right {
        flex: .78;
        border-left: 1px solid #ccc;

        // 顶部
        .container_right_top {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 10%;
            background-color: #f5f5f5;
            border-bottom: 1px solid #ccc;
        }

        // 聊天内容
        .container_right_content {
            height: 66%;
            overflow: auto;
            padding: 0 6px;
            background-color: #f5f5f5;

            ul {
                li {
                    overflow: hidden;
                    margin: 10px 0;

                    div {
                        margin: 0 4px;
                        max-width: 60%;

                        span,
                        p {
                            font-size: 14px;
                        }
                    }

                    img {
                        cursor: pointer;
                    }
                }

                .row-1 {
                    height: auto;
                    padding: 0 8px 0 8px;
                    color: #000;
                    line-height: 30px;
                    background: #fff;
                    font-size: 14px;
                }

                .row-2 {
                    height: auto;
                    padding: 0 12px 0 8px;
                    color: #000;
                    line-height: 30px;
                    background: #89d961;
                    text-align: left !important;
                }
            }
        }

        // 发送信息
        .container_right_bottom {
            height: 24%;
            border-top: 1px solid #ccc;

            // 功能分区
            .sectorization {
                height: 20%;
                padding-left: 20px;
                padding-top: 10px;

                span {
                    margin-right: 10px;
                    cursor: pointer;
                }

                .is_hidden {
                    position: absolute;
                    top: 140px;
                    left: 2px;
                }
            }
        }

        // 发送框
        .send_container {
            height: 80%;
            position: relative;

            .textarea__inner {
                display: block;
                width: 100%;
                font-size: 16px;
                font-weight: 600;
                box-sizing: border-box;
                height: 100%;
                box-shadow: none;
                border: none;
                padding-left: 20px;
            }

            .textarea__inner:focus-visible {
                outline: -webkit-focus-ring-color auto 0;
            }

            .el-button {
                position: absolute;
                right: 30px;
                bottom: 10px;
            }
        }
    }
}
</style>