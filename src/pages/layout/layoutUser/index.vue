<script lang="ts" setup>
import { onMounted } from 'vue';
// 引入pinia创库
import useLayoutStore from '@/store/layout';
const layoutStore = useLayoutStore();
onMounted(() => {
    layoutStore.getUserInfo()
})
</script>
<template>
    <h2 style="margin: 30px 0 0 50px;">用户管理</h2>
    <ul class="infinite-list" style="overflow: auto;height: calc(100vh - 142px);">
        <li v-for="user in layoutStore.userData" :key="user.id" class="infinite-list-item">
            <div
                :style="{ backgroundImage: user.user_pic ? `url(${user.user_pic})` : `url('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')` }">
            </div>
            {{ user.nickname }}
        </li>
    </ul>
</template>
<style scoped lang='less'>
* {
    box-sizing: border-box;
}

ul {
    padding: 50px;

    li {
        display: flex;
        align-items: center;
        height: 50px;
        transition: all .3s;
        border-radius: 12px;
        padding: 0 14px;

        div {
            width: 35px;
            height: 35px;
            background-size: cover;
            background-position: center;
            margin-right: 10px;

        }
    }

    li:hover {
        background-color: #D1EEEE;
    }
}</style>