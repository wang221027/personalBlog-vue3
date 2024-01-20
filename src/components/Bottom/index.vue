<template>
    <div class="bottom">
        <div class="content">
            <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023036449号-2</a>
            <div class="right">
                <span>联系我们</span>
                <span>合作伙伴</span>
                <span>用户协议</span>
                <span>隐私协议</span>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts"></script>
  
<style scoped lang="less">
.bottom {
    width: 100%;
    height: 50px;
    background: #f0f2f5;
    display: flex;
    justify-content: center;

    .content {
        width: 1200px;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;

        .right {
            span {
                margin: 0px 5px;
            }
        }
    }
}
</style>
  