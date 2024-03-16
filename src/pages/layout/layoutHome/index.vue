<script lang="ts" setup name="layoutHome">
import { nextTick, onMounted, watch, ref } from "vue";
//  按需引入 echarts
import * as echarts from "echarts";
let main = ref();
// 引入pinia创库
import useLayoutStore from '@/store/layout';
const layoutStore = useLayoutStore();
const init = () => {
    nextTick(() => {
        if (layoutStore.isBlock) {
            // 文章列表总数
            let userDataListLength = layoutStore.userDataList.length;
            // 用户列表总数
            let userDataLength = layoutStore.userData.length;
            // 聊天记录总数
            let userSocketLength = layoutStore.userSocketList.length;
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(main.value);
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '博客系统'
                },
                tooltip: {},
                legend: {
                    data: ['总数']
                },
                xAxis: {
                    data: ['用户', '文章列表', '聊天室', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                    {
                        name: '总数',
                        type: 'bar',
                        data: [userDataLength, userDataListLength, userSocketLength, 10, 10, 20]
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    })
}
const initData = () => {
    if (layoutStore.userDataList.length > 0 && layoutStore.userData.length > 0 && layoutStore.userSocketList.length > 0) {
        layoutStore.isBlock = true;
    }
}
watch(() => layoutStore.isBlock, () => {
    init();
}, { immediate: true })
onMounted(() => {
    // 获取所有用户
    layoutStore.getUserInfo();
    // 获取所有的文章列表
    layoutStore.getArticle();
    // 获取所有的聊天记录
    layoutStore.getSocketList();
    setTimeout(() => {
        initData()
    }, 200)
})
</script>
<template>
    <div class="title">
        <p>admin <br>欢迎回来！</p>
    </div>
    <section>

        <div ref="main" style="width: 100%; height: 400px;margin-top: 20px;"></div>
    </section>
</template>
<style scoped lang="less">
.title {
    padding: 20px;
    margin-bottom: 20px;
}
section {
    width: 100%;

    /deep/ canvas {
        width: 100% !important;
    }

    /deep/ div:nth-child(1) {
        width: 100% !important;
    }
}
</style>