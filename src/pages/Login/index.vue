<script setup lang='ts'>
import pages_login from '@/hooks/useLogin'
const {login, goRegister, username,userPassword2} = pages_login()
</script>
<template>
    <!-- 返回上一级 -->
    <GoBack color="#000" content="登录" width="1200px" class="go_back" />
    <!-- 背景 -->
    <div class="main_bg"></div>
    <!--  账号输入登录-->
    <div class="login_box">
        <a>
            <div class="login_close"></div>
        </a>
        <div class="login_panel">
            <div class="login_title">
                <img src="../../assets/img/logo.png" alt="">
                <p>输入账号进行安全登录</p>
            </div>
            <label style="margin-top: 50px">账号：</label>
            <input v-model="username" type="tel" title="请输入账号">
            <label>密码：</label>
            <input v-model="userPassword2" type="password" title="请输入密码">
            <input class="bt" type="submit" value="登录" @click="login">
            <el-link type="success" class="login_el_a" @click="goRegister">没有账号？点击注册账号</el-link>
        </div>
    </div>
</template>

<style lang='less' scoped>
// 背景
.main_bg {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: url(./images/feng_bg3.jpg) no-repeat;
    background-size: cover;
}
/*登录框*/
.login_box {
    z-index: 99;
    position: absolute;
    width: 380px;
    height: 540px;
    top: 50%;
    left: 50%;
    margin-left: -190px;
    margin-top: -270px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 10px #999;
    opacity: .9;
}

.login_close {
    position: absolute;
    top: 0;
    right: 0;
    width: 64px;
    height: 64px;
    background: url(../../assets/img/qrcode.png) no-repeat right top;
    background-size: 100% 100%;
    border-top-right-radius: 5px;
    cursor: pointer;
    z-index: 99;
}

/*登录*/
.login_panel {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 270px;
    height: 540px;
    padding: 0 55px;
    transform: translate(-50%, -50%);
    /* background: #fff; */
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
        transform: translate(-50%,-50%);
        margin: 0;
    }

}

</style>@/hooks/useLogin