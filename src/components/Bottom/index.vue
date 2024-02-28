<template>
    <div class="bottom">
        <div class="content">
            <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023036449号-2</a>
            <div class="text">
                当前是一名应届生 <br>
                Follow Me
                <img src="./images/my_weixin.jpg" alt="">
                欢迎关注我的微信
            </div>
            <div class="right">
                <span style="font-weight: bold;">
                    About Wang Yuanlin <br>
                    Front-end Engineer，前端开发工程师
                </span>
            </div>
        </div>

    </div>
</template>
  
<script setup lang="ts"></script>
<style scoped lang="less">
.bottom {
    width: 100%;
    background: #f0f2f5;
    padding: 20px 0;
    display: flex;
    justify-content: space-between;

    .content {
        width: 1200px;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        margin: 0 auto;

        a {
            color: #000;
        }

        .right {
            span {
                margin: 0px 5px;
            }
        }
    }

    .text {
        font-weight: bold;

        img {
            display: block;
            width: 200px;
            margin-top: 10px;
        }
    }
}
</style>
  