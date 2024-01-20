<script setup lang='ts'>
import { ref, onMounted, computed, reactive } from "vue"
// 引入api
import { reqArticle, reqArticleCoverData } from '@/api/home'
// 引入类型
import { isArticleData } from '@/api/home/type'
// 粒子背景
import particlesOpt from '@/config/particles1'
import { loadSlim } from "tsparticles-slim"
// 引入router构造器
import { useRouter } from 'vue-router'
const $router = useRouter();
import { Calendar } from '@element-plus/icons-vue'
// 文章列表数据
let articleData: any = ref([])
// 文章列表是否显示
let isInit = ref<boolean>(false)
// 文章列表封面是否显示
let isArticleCover = ref<boolean>(false)
// 文章列表总数量
let total = ref<number>(0)
// 文章列表封面url
let articleCover: any = ref([])
// 分页器当前页码
let currentPage = ref(1)
// 分页器一页显示几个
let pageSize = ref(10)
// 计算是否显示后的总数量
let totalSplice = ref(0)
// 轮播图数据
let bannerList = reactive([
    {
        id: 1,
        content: '精选作品/发布文章'
    },
    {
        id: 2,
        content: '移动端/电脑端/平板端'
    },
    {
        id: 3,
        content: '聊天室/私聊'
    }
])
// 粒子背景
const props = withDefaults(defineProps<{
    width?: string | number,
    height?: string | number,
    backgroundColor?: string,
    backgroundImage?: string
}>(), {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    backgroundImage: ''
})
const particlesContainerStyle = computed(() => {
    return {
        width: typeof props.width === 'string' ? props.width : props.width + 'px',
        height: typeof props.height === 'string' ? props.height : props.height + 'px',
        backgroundColor: props.backgroundColor,
        backgroundImage: `url(${props.backgroundImage})`
    }
})
const particlesInit = async (engine: any) => {
    await loadSlim(engine);
}
// 获取文章数据
const getArticle = async () => {
    const result: isArticleData = await reqArticle();
    // 让服务器返回的数据根据id进行排序
    articleData.value = result.data.sort((a: any, b: any) => {
        return b.id - a.id;
    });
    total.value = articleData.value.length;
    isInit.value = true;
}
// 获取文章列表封面url
const getArticleCover = async () => {
    const result: any = await reqArticleCoverData();
    articleCover = result.data
    isArticleCover.value = true;
}
// 点击标题跳转到对应的文章详情
let goArticleCover = (id: number) => {
    $router.push({ name: 'cover', query: { id } })
}
// 文章列表一页显示几个
let showDataList = computed(() => {
    const startIndex = pageSize.value * (currentPage.value - 1);
    const endIndex = total.value >= 10 ? pageSize.value * currentPage.value : total.value;
    const filterData = articleData.value.filter((item: any) => item.is_delete == 0)
    totalSplice.value = filterData.length
    return filterData.slice(startIndex, endIndex);
})
// 分页器要显示的数量
let paginationList = computed(() => {
    const maxList =
        Math.ceil(totalSplice.value / pageSize.value) < 5
            ? Math.ceil(totalSplice.value / pageSize.value)
            : 5;
    let startPage = Math.max(currentPage.value - Math.floor(maxList / 2), 1);
    let endPage = Math.min(
        startPage + maxList - 1,
        Math.ceil(totalSplice.value / pageSize.value)
    );
    if (endPage - startPage < maxList - 1) {
        startPage = Math.max(endPage - maxList + 1, 1);
    }
    const list = [];
    for (let i = startPage; i <= endPage; i++) {
        list.push(i);
    }
    return list;
})
// 在页面渲染完成后获取数据
onMounted(() => {
    // 获取文章数据
    getArticle();
    // 获取文章列表封面url
    getArticleCover();
});
</script>
<template>
    <!-- 粒子背景 -->
    <div class="wft-particles-container" :style="particlesContainerStyle">
        <vue-particles id="wft-tsparticles" :particlesInit="particlesInit" :options="particlesOpt" />
    </div>
    <!-- 标签页 -->
    <el-tabs type="border-card" class="demo-tabs">
        <el-tab-pane>
            <template #label>
                <span class="custom-tabs-label">
                    <el-icon>
                        <calendar />
                    </el-icon>
                    <span>Route</span>
                </span>
            </template>
            Route
        </el-tab-pane>
        <el-tab-pane label="Config">Config</el-tab-pane>
        <el-tab-pane label="Role">Role</el-tab-pane>
        <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
    <!-- 主体 -->
    <div class="main">
        <div class="flex">
            <!-- 左边文章 -->
            <div class="main_left">
                <!-- 文章列表 -->
                <ul class="list">
                    <li v-for="(item) in showDataList" :key="item.id">
                        <div v-if="isInit && item.is_delete == 0" class="list_flex">
                            <!-- 封面 -->
                            <div class="list_left" :style="{
                                backgroundImage: item.id == articleData[total - item.id].id ? `url(${articleCover[item.id - 1].title_url})` : `none`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }" v-if="isArticleCover && articleCover[item.id - 1].file == 'show'"></div>
                            <!-- 文章详情 -->
                            <div class="list_right" v-if="isArticleCover" @click="goArticleCover(item.id)"
                                :style="{ flex: articleCover[item.id - 1].file == 'show' ? '0.65' : '1' }">
                                <el-link type="info" class="list_right_title">{{ item.name }}</el-link>
                                <p class="article">{{ item.alias }}</p>
                                <div>
                                    <p>类型：{{ item.type }}</p>
                                    <p>发布日期：{{ item.time }}</p>
                                </div>
                                <p>作者：{{ item.nickname }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 右边装饰 -->
            <div class="main_right">
                <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="item in bannerList" :key="item.id">
                        <h3 text="2xl" justify="center">{{ item.content }}</h3>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
        <!-- 分页器 -->
        <div class="pagination">
            <ul>
                <li><a href="##" @click="currentPage = 1">首页</a></li>
                <li><a href="##" @click="currentPage <= 1 ? currentPage = 1 : currentPage--" class="page_top">上一页</a></li>
                <li v-for="(item, index) in paginationList" :key="index">
                    <a :class="{ 'active_bgColor': item == currentPage }" href="##" @click="currentPage = item">{{ item
                    }}</a>
                </li>
                <li>
                    <a href="##" @click="currentPage = Math.min(currentPage + 1, Math.ceil(total / pageSize))"
                        class="page_bottom">下一页</a>
                </li>
                <li>
                    <a href="##" @click="currentPage = Math.ceil(totalSplice / pageSize)">尾页</a>
                </li>
            </ul>
        </div>
    </div>
    <Bottom class="bottom" />
</template>
<style lang='less' scoped>
// 粒子背景
.wft-particles-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

#wft-tsparticles {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

// 标签页
.demo-tabs {
    width: 1400px;
    margin: 10px auto;
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.demo-tabs .custom-tabs-label .el-icon {
    vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
}

// 轮播图
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

// 封装flex样式
.flex {
    display: flex;
    justify-content: space-between;
}

// 主体
.main {
    width: 1400px;
    margin: 10px auto;
    opacity: .9;

    .flex {
        .flex();
        // 左边文章
        .main_left {
            flex: 0.65;
            background-color: #fff;
            padding: 20px;
            border-radius: 12px;

            // 文章列表
            .list {
                li {
                    .list_flex {
                        .flex();
                        align-items: center;
                        height: 140px;
                        margin: 20px 0;
                        background-color: #f1f1f1;
                        padding: 10px;

                        // 封面
                        .list_left {
                            width: 180px;
                            height: 100px;
                            overflow: hidden;
                            flex: 0.3;
                        }

                        // 文章详情
                        .list_right {
                            flex: 0.65;

                            // 文章详情标题
                            .list_right_title {
                                font-size: 24px;
                                margin-bottom: 8px;
                            }

                            // 文章详情为时间和类型包一个盒子，用于排列在一排
                            div {
                                .flex();
                            }

                            p {
                                font-size: 14px;
                                margin: 4px 0;
                            }

                            // 文章
                            .article {
                                font-size: 18px;
                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                                white-space: normal;
                                text-overflow: ellipsis;
                                -o-text-overflow: ellipsis;
                            }
                        }
                    }
                }
            }
        }

        // 右边装饰
        .main_right {
            flex: 0.3;
        }
    }

    // 分页器
    .pagination {
        width: 600px;
        padding: 20px 0;
        margin: 0 auto;

        ul {
            display: flex;

            li {
                a {
                    display: block;
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    color: yellow;
                    text-align: center;
                    text-decoration: none;
                    font-size: 14px;
                    transition: all 0.3s;
                    margin: 0 4px;
                    font-weight: bold;
                    border-radius: 2px;
                    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.5);
                }

                .active_bgColor {
                    background-color: #67c23a;
                }
            }
        }
    }
}



// 响应式 1500px
@media screen and (max-width: 1500px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 1200px;
    }

    // 标题
    .list_right_title {
        font-size: 20px !important;
    }

    // 类型、作者
    .list_right p {
        font-size: 12px !important;
    }

    // 文章
    .list_right .article {
        font-size: 16px !important;
    }
}

// 1300px
@media screen and (max-width: 1300px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 1000px;
    }

    // 轮播图分页器
    /deep/ .el-carousel .el-carousel__button {
        width: 20px;
    }
}

// 1100px
@media screen and (max-width: 1100px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 800px;
    }
}

// 996px
@media screen and (max-width: 996px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 700px;
    }

    // 左边内容
    .main_left {
        flex: 1 !important;
    }

    // 右边装饰
    .main_right {
        display: none;
    }

    // 标题
    .list_right_title {
        font-size: 16px !important;
    }

    // 类型、作者
    .list_right p {
        font-size: 12px !important;
    }

    // 文章
    .list_right .article {
        font-size: 14px !important;
    }
}

// 768px
@media screen and (max-width: 768px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 600px;
    }

    // 左边内容
    .main_left {
        flex: 1 !important;
    }

    // 右边装饰
    .main_right {
        display: none;
    }

    // 底部
    .bottom {
        display: none;
    }

    // 底部tab显示
    .bottom_tab {
        display: block;
    }

    // 分页器
    .pagination {
        width: 600px !important;

        ul {
            width: 100%;
            display: flex;
            justify-content: center;

            li {
                a {
                    width: 30px !important;
                    height: 30px !important;
                    line-height: 30px !important;
                    font-size: 10px !important;
                    font-weight: 300 !important;
                }
            }
        }
    }

    .page_bottom,
    .page_top {
        display: none !important;
    }
}

// 600px
@media screen and (max-width: 600px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 450px;
    }

    // 左边内容
    .main_left {
        flex: 1 !important;
    }

    // 右边装饰
    .main_right {
        display: none;
    }

    // 底部
    .bottom {
        display: none;
    }

    // 分页器
    .pagination {
        width: 450px !important;
    }
}

// 500px
@media screen and (max-width: 500px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 350px;
    }

    // 左边内容
    .main_left {
        flex: 1 !important;
    }

    // 右边装饰
    .main_right {
        display: none;
    }

    // 底部
    .bottom {
        display: none;
    }

    // 分页器
    .pagination {
        width: 350px !important;
    }
}
</style>