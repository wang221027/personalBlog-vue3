<script setup lang="ts">
import { ref } from 'vue'
// 引入路由器
import { useRouter } from 'vue-router'
// 引入消息提示
import { ElMessage } from 'element-plus'
// 注册路由器
const $router = useRouter()
// 账号
let username = ref('')
// 密码
let password = ref('')
// 登录
let login = () => {
    if (username.value == '' || password.value == '') {
        return ElMessage({
            message: '账号或密码不能为空',
            type: 'error',
            offset: 100
        })
    }
    if (username.value == 'w123456' && password.value == 'w123456') {
        $router.push('/layout')
        return ElMessage({
            message: '欢迎回来！',
            type: 'success',
            offset: 100
        })
    } else {
        return ElMessage({
            message: '账号或密码不正确！',
            type: 'error',
            offset: 100
        })
    }
}
</script>
<template>
    <!-- 背景 -->
    <div class="main_bg">
        <!-- 返回上一级 -->
        <GoBack color="red" content="登录" width="800px" class="go_back" />
        <!--  账号输入登录-->
        <div class="login_box">
            <div class="login_panel">
                <div class="login_title">
                    <p style="margin-top: 40px;">输入账号进行安全登录</p>
                </div>
                <label style="margin-top: 50px">账号：</label>
                <input type="tel" title="请输入账号" v-model="username">
                <label>密码：</label>
                <input type="password" title="请输入密码" v-model="password">
                <input class="bt" type="submit" value="登录" @click="login">
            </div>
        </div>
    </div>
</template>
<style lang='less' scoped>
// 背景
.main_bg {
    width: 100vw;
    height: calc(100vh - 100px);
    background-color: #BFEFFF;
    padding-top: 20px;
}

/*登录框*/
.login_box {
    z-index: 99;
    position: absolute;
    width: 380px;
    height: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 10px #999;
    opacity: .9;
}

/*登录*/
.login_panel {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 270px;
    height: 400px;
    padding: 0 55px;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    overflow: hidden;
}

.login_panel .login_title {
    text-align: center;
}

.login_el_a {
    display: inline-block;
    margin-top: 20px;
    margin-left: 110px;
}

.login_panel .login_title img {
    display: inline-block;
    margin-top: 60px;
    height: 70px;
    width: 70px;
    border-radius: 50%;
    padding: 10px;
    border: 3px solid #d7e8fc;
}

.login_panel .login_title p {
    margin-top: 15px;
    color: #999999;
    font-size: 15px;
}

.login_panel label {
    display: block;
    font-size: 12px;
    line-height: 18px;
    color: #a9a8a5;
    margin-top: 10px;
}

.login_panel input {
    display: inline;
    height: 42px;
    padding: 0 5%;
    line-height: 42px;
    font-size: 14px;
    color: #333333;
    border-radius: 4px;
    outline: 0;
    border: 0;
    width: 90%;
    background: #d7e8fc;
}

/* 按钮 */
.login_panel .bt {
    margin-top: 35px;
    width: 100%;
    color: #ffffff;
    background: #379df6;
    cursor: pointer;
}

.login_panel .bt:hover {
    background-color: #2f86f6;
}

// 768px
@media screen and (max-width: 768px) {

    // 背景/返回上一级
    .main_bg,
    .go_back {
        display: none;
    }

    .login_box {
        width: 320px;
        height: 500px;
        transform: translate(-50%, -50%);
        margin: 0;
    }

}
</style>