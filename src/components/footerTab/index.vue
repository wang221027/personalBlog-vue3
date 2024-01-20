<script setup lang='ts'>
import { reactive, ref, onMounted } from 'vue'
// 引入全局事件总线
import $bus from '@/utils/event-bus'
// 定义底部tab数据
let tabDataList = reactive([
    { id: 1, src: 'http://43.138.70.109:8010/head/home.png', srcActive: 'http://43.138.70.109:8010/head/home-active.png', title: '首页', router: '/home' },
    { id: 2, src: 'http://43.138.70.109:8010/head/news.png', srcActive: 'http://43.138.70.109:8010/head/news-active.png', title: '发布文章', router: '/article' },
    { id: 3, src: 'http://43.138.70.109:8010/head/cart.png', srcActive: 'http://43.138.70.109:8010/head/cart-active.png', title: '聊天室', router: '/ChatRoom' },
    { id: 4, src: 'http://43.138.70.109:8010/head/member.png', srcActive: 'http://43.138.70.109:8010/head/member-active.png', title: '我的', router: '/PersonalCenter' },
])
// 记录当前是哪一个li
let count = ref(1)
onMounted(() => {
    $bus.on("isCountOne", () => {
        count.value = 1;
    })
})
</script>
<template>
    <div class="bottom_tab">
        <div class="bottom_fixed">
            <ul>
                <li v-for="(item) in tabDataList" :key="item.id" @click="count = item.id">
                    <router-link :to="item.router">
                        <img :src="item.id == count ? item.srcActive : item.src" alt=""><a href="##"
                            :class="{ colorActive: item.id == count }">{{ item.title }}</a>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang='less' scoped>
// 底部tab
.bottom_tab {
    width: 100%;
    height: 60px;
    display: none;
    .bottom_fixed {
        position: fixed;
        z-index: 999;
        width: 100vw;
        height: 60px;
        background-color: #FF7F24;
        bottom: 0;
        ul {
            width: 80%;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 auto;

            li {
                display: flex;
                flex-direction: column;
                cursor: pointer;

                a {
                    display: block;
                    color: #fff;
                    font-size: 14px;
                    margin-top: 4px;
                }

                // 字体高亮
                a.colorActive {
                    color: red;
                }

                img {
                    display: block;
                    width: 25px;
                    height: 25px;
                    margin: 0 auto;
                }
            }
        }
    }
}

// 768px
@media screen and (max-width: 768px) {

    // 底部
    .bottom {
        display: none;
    }

    // 底部tab显示
    .bottom_tab {
        display: block;
    }
}

// 600px
@media screen and (max-width: 600px) {

    // 底部
    .bottom {
        display: none;
    }
}</style>