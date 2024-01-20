<script setup lang='ts'>
import { ref } from 'vue'
// 引入 pinia 创库
import { onlineGameStore } from '@/store/onlineGame'
const onlineGameData = onlineGameStore()
// 从本地获取用户id和昵称
const user_id = localStorage.getItem("userId");
const nickname = localStorage.getItem("nickname");
// 开始游戏是否显示
let isPlay = ref(true)
// 引入 socket.io
import { io } from "socket.io-client";
let socket: any;
let connectSocket = (user_id: any, nickname: any) => {
    // 使用用户信息建立Socket连接
    socket = io("http://43.138.70.109:8010", {
        query: { user_id, nickname }
    });
    socket.off("play")
    socket.emit("playGame", { user_id, nickname })
    socket.on("play", (data: any) => {
        onlineGameData.addUser(data)
        isPlay.value = false;
    })
}
// 开始游戏
let playGame = () => {
    connectSocket(user_id, nickname)
}
</script>
<template>
    <div>
        <div :style="{ width: onlineGameData.person.width, height: onlineGameData.person.height, backgroundColor: 'red' }"
            v-for="(item, index) in onlineGameData.userArr" :key="index">
            {{ item.nickname }}
        </div>
        <div @click="playGame" v-if="isPlay">开始游戏</div>
    </div>
</template>

<style lang='less' scoped></style>