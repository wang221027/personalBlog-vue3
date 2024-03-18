<script setup lang='ts'>

</script>
<template>
    <div class="container">
        <!-- 侧边栏 -->
        <div class="container_left">
            <router-link to="/ChatRoom/message" active-class="color_active">
                <ChatDotRound style="display: block;width: 50%;color: #fff;margin: 20px auto;cursor: pointer;" />
            </router-link>
            <router-link to="/ChatRoom/userList" active-class="color_active">
                <UserFilled style="display: block;width: 50%;color: #fff;margin: 20px auto;cursor: pointer;" />
            </router-link>
        </div>
        <router-view></router-view>
    </div>
</template>
<style lang="less" scoped>
.container {
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 80px);

    // 侧边栏
    .container_left {
        flex: 0.03;
        background-color: #333;
        display: flex;
        flex-direction: column;
    }

    .color_active svg {
        color: green !important;
    }
}

// 768px
@media screen and (max-width: 768px) {

    // 内容
    .container_left {
        flex: 0.1 !important;
    }

    .container {
        height: calc(100vh - 140px) !important;
    }
}</style>