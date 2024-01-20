<script setup lang='ts'>
import {  } from 'vue'
</script>
<template>
    <div class="main-group">
        <div class="box-group">
            <div class="left-group">
                <h3 class="title">联系我们</h3>
                <div class="icon-group">
                    <ul>
                        <li>
                            <img src="./imgs/address.png" class="icon" alt="">
                            <p>
                                北京景秀
                            </p>
                        </li>
                        <li>
                            <img src="./imgs/email.png" class="icon" alt="">
                            <p>
                                3490995542@qq.com
                            </p>
                        </li>
                        <li>
                            <img src="./imgs/mobile.png" class="icon" alt="">
                            <p>
                                156-1612-2740
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="right-group">
                <h3 class="title">在线留言</h3>
                <form action="#" class="form">
                    <div class="form-group">
                        <div class="input-group w50">
                            <input type="text" name="name" required>
                            <span>姓名</span>
                        </div>
                        <div class="input-group w50">
                            <input type="text" name="age" required>
                            <span>年龄</span>
                        </div>
                        <div class="input-group w50">
                            <input type="text" name="email" required>
                            <span>邮箱</span>
                        </div>
                        <div class="input-group w50">
                            <input type="text" name="phone" required>
                            <span>手机号</span>
                        </div>
                        <div class="input-group w100">
                            <textarea name="data" required></textarea>
                            <span>请输入您的消息内容</span>
                        </div>
                        <div class="input-group w100">
                            <button type="submit">提 交</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang='less' scoped>
html,
body {
    min-height: 100%;
}

* {
    margin: 0;
    padding: 0;
    font-size: 14px;
}

ul {
    list-style: none;
}

.hide {
    display: none;
}

.lf {
    float: left;
}

.lr {
    float: right;
}

.red,
.red a,
.red a h5,
.red a p {
    color: #FF0000 !important;
}

a {
    text-decoration: none;
    color: inherit;
}

.main-group {
    width: 100vw;
    height: calc(100vh - 80px);
    min-width: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #39bcf2 0%, #39bcf2 50%, #18354a 50%, #18354a 100%);
}

.box-group {
    width: 1000px;
    height: 430px;
    position: relative;
}

.box-group .left-group {
    width: 320px;
    height: 360px;
    background: #18354a;
    position: absolute;
    left: 0;
    top: 35px;
    color: #fff;
    z-index: 1;
    box-sizing: border-box;
    padding: 40px;
}

.box-group .left-group .title {
    font-size: 16px;
    font-weight: bold;
}

.box-group .left-group .icon-group {
    margin-top: 33px;
}

.box-group .left-group .icon-group li {
    margin-top: 26px;
    display: flex;
    align-items: center;
}

.box-group .left-group .icon-group li img {
    width: 25px;
    height: 25px;
    margin-right: 10px;
}


.box-group .right-group {
    width: 870px;
    box-sizing: border-box;
    padding: 45px 40px 20px 230px;
    height: 100%;
    background: #fff;
    position: absolute;
    right: 0;
}

.box-group .right-group .title {
    color: #18354a;
    font-size: 20px;
    font-weight: bold;
}

.box-group .right-group .form-group {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-top: 30px;
}

.box-group .right-group .form-group .input-group {
    position: relative;
    margin: 0 0 35px 0;
}

.box-group .right-group .form-group .input-group.w50 {
    width: 47%;
}

.box-group .right-group .form-group .input-group.w100 {
    width: 100%;
}

.box-group .right-group .form-group .input-group input,
.box-group .right-group .form-group .input-group textarea {
    width: 100% !important;
    padding: 5px 0;
    font-size: 14px;
    color: #666;
    border: 0;
    border-bottom: 1px solid #777;
    outline: none;
    resize: none;
}

.box-group .right-group .form-group .input-group textarea {
    min-height: 60px;
}

.box-group .right-group .form-group .input-group span {
    position: absolute;
    left: 0;
    padding: 5px 0;
    font-size: 14px;
    color: #666;
    transition: 0.3s;
    pointer-events: none;
}

.box-group .right-group .form-group .input-group input:focus~span,
.box-group .right-group .form-group .input-group textarea:focus~span,
.box-group .right-group .form-group .input-group input:valid~span,
.box-group .right-group .form-group .input-group textarea:valid~span {
    transform: translateY(-20px);
    font-size: 12px;
    letter-spacing: 1px;
    color: #000;
}

.box-group .right-group .form-group .input-group button {
    cursor: pointer;
    background: #18354a;
    color: #fff;
    border: 0;
    padding: 10px 30px;
    font-size: 14px;
}</style>