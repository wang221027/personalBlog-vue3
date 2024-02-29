<script lang="ts" setup>
import { reactive, ref } from 'vue';
const bannerUrl = reactive([
    'http://43.138.70.109:8010/head/01.png',
    'http://43.138.70.109:8010/head/02.png',
    'http://43.138.70.109:8010/head/03.jpg',
    'http://43.138.70.109:8010/head/04.webp',
])
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}
// 留言
let formLabelAlign: any = reactive({
    alias: "",
})
let publish = () => {

}
</script>
<template>
    <!-- 容器 -->
    <section class="container">
        <header>
            <!-- 轮播图 -->
            <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item in bannerUrl">
                    <img :src="item" alt="">
                </el-carousel-item>
            </el-carousel>
            <!-- 右侧内容 -->
            <div class="header_content">
                <el-card class="box-card">
                    <h6 style="font-size: 20px;">作者推荐</h6>
                </el-card>
            </div>
        </header>
        <!-- 主体 -->
        <main>
            <section class="tab_content">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="最新发布" name="first">

                    </el-tab-pane>
                    <el-tab-pane label="问答" name="second">

                    </el-tab-pane>
                    <el-tab-pane label="留言" name="third">
                        <el-form label-width="80px" :model="formLabelAlign">
                            <!-- 留言内容 -->
                            <el-form-item label="留言内容">
                                <el-input type="textarea" v-model.trim="formLabelAlign.alias"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <!-- 发表留言 -->
                                <el-button type="primary" @click="publish">发表</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </section>
            <section class="main_right">

            </section>
        </main>
    </section>
</template>
<style scoped lang='less'>
// 容器
.container {
    width: 1400px;
    margin: 0 auto;
    margin-top: 20px;

    // 头部
    header {
        display: flex;
        justify-content: space-between;

        // 轮播图
        .el-carousel--horizontal {
            flex: .62;
        }

        /deep/ .el-carousel__container {
            height: 400px !important;
        }

        img {
            display: block;
            width: 100%;
            height: 400px;
        }

        // 右侧内容
        .header_content {
            flex: .36;
        }
    }

    // 主体
    main {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        // tab切换
        .tab_content {
            flex: .62;

            .demo-tabs>.el-tabs__content {
                padding: 32px;
                color: #6b778c;
                font-size: 32px;
                font-weight: 600;
            }
        }

        // 右侧装饰
        .main_right {
            flex: .36;
        }
    }
}</style>