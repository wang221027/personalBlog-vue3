<script setup lang='ts'>
import { ref, onMounted, computed, reactive, Ref } from "vue";
// 引入api
import { reqArticle, reqArticleCoverData, reqUserComment, reqUserLike } from '@/api/home';
// 引入类型
import type { isArticleData, articleListData, isArticleCoverType, coverData, userCommentResultType, userCommentType } from '@/api/home/type'
// 引入router构造器
import { useRouter } from 'vue-router';
// 引入字体图标样式
import '@/pages/MyHome/font/iconfont.css';
const $router = useRouter();
// 文章列表数据
let articleData: Ref<articleListData[]> = ref([]);
// 文章列表是否显示
let isInit = ref<boolean>(false);
// 文章列表封面是否显示
let isArticleCover = ref<boolean>(false);
// 文章列表总数量
let total = ref<number>(0);
// 文章列表封面url
let articleCover: Ref<coverData[]> = ref([]);
// 分页器当前页码
let currentPage = ref(1);
// 分页器一页显示几个
let pageSize = ref(10);
// 计算是否显示后的总数量
let totalSplice = ref(0);
// 轮播图url
const bannerUrl: string[] = reactive([
    'http://43.138.70.109:8010/head/zhi.webp',
    'http://43.138.70.109:8010/head/web.webp',
    'http://43.138.70.109:8010/head/04.webp'
])
// 获取文章数据
const getArticle = async () => {
    const result: isArticleData = await reqArticle();
    // 让服务器返回的数据根据id进行排序
    articleData.value = result.data.sort((a: any, b: any) => {
        return b.id - a.id;
    });
    total.value = articleData.value.length;
    isInit.value = true;
    // 获取用户所有评论
    getUserComment();
}
// 获取文章列表封面url
const getArticleCover = async () => {
    const result: isArticleCoverType = await reqArticleCoverData();
    // 每次刷新都随机展示数据
    randomDisplay(randomArticles.value)
        randomDisplay(reqArticles.value)
    if (result.data.length > 0) {
        articleCover.value = result.data;
        if (articleCover.value.length > 0) {
            isArticleCover.value = true;
        }
    }
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
// 随机展示10条文章列表
const randomArticles: Ref<articleListData[]> = ref([]);
const reqArticles: Ref<articleListData[]> = ref([])
const randomDisplay = (data: any) => {
    const randomIndexes: number[] = [];
    const articles = articleData.value;
    while (randomIndexes.length < articles.length) {
        const randomIndex = Math.floor(Math.random() * articles.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }
    randomIndexes.slice(0, 10).forEach((index: any) => {
        data.push(articles[index]);
    });
}
// 获取用户所有评论
let userComment: userCommentResultType[] = reactive([])
let isUserCommentBlock = ref(false)
let getUserComment = async () => {
    const result: userCommentType = await reqUserComment();
    userComment = result.data;
    isUserCommentBlock.value = true;
}
let computedUserComment = computed(() => (id: number) => {
    if (userComment) {
        return userComment.filter((element: any) => element.commentId == id)
    }
})
// 点赞
const like = async (id: number) => {
    await reqUserLike(id, localStorage.getItem("nickname") as string);
    getArticle();
}
// 过滤出点赞数量
const computedLike = computed(() => (likeList: any) => {
    let likeArr = JSON.parse(likeList)
    if (likeArr) {
        let result = likeArr.filter((element: any) => element.is_like == true)
        return result.length;
    }
})
const isLike = computed(() => (likeList: any) => {
    let likeArr = JSON.parse(likeList)
    if (likeArr) {
        let result = likeArr.filter((element: any) => element.nickname == localStorage.getItem("nickname"))
        if(result.length > 0) {
            return result[0].is_like;
        }else {
            return false;
        }
    }
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
    <header>
        <section class="header_banner">
            <el-carousel :interval="5000" arrow="always">
                <el-carousel-item v-for="item in bannerUrl">
                    <img :src="item" alt="">
                </el-carousel-item>
            </el-carousel>
        </section>
        <section class="header_content">
            <img src="http://43.138.70.109:8010/head/hei.jpg" alt="">
            <p>
                <span style="color: #ceefea;">前端/移动开发</span><br>Node.js <br>
                MySQL
            </p>
        </section>
    </header>
    <!-- 主体 -->
    <main>
        <div class="main">
            <div class="flex">
                <!-- 左边文章 -->
                <div class="main_left">
                    <div style="border-bottom: 1px solid #ccc;margin: 10px 0;">
                        <span
                            style="font-size: 24px;border-bottom: 2px solid #0d6cbf;padding-bottom: 10px;display: inline-block">
                            最新文章
                        </span>
                    </div>
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
                                <div class="list_right" v-if="isArticleCover"
                                    :style="{ flex: articleCover[item.id - 1].file == 'show' ? '0.65' : '1' }">
                                    <el-link type="info" class="list_right_title" @click="goArticleCover(item.id)">{{
                                        item.name }}</el-link>
                                    <p class="article" style="cursor: pointer;" @click="goArticleCover(item.id)">{{
                                        item.alias }}</p>
                                    <div>
                                        <p style="max-width: 72%;">类型：{{ item.type }}</p>
                                        <p>发布日期：{{ item.time }}</p>
                                    </div>
                                    <div style="display: flex;justify-content: space-between;">
                                        <p>作者：{{ item.nickname }}</p>
                                        <div style="font-size: 14px;display: flex;align-items: center;">
                                            <span class="iconfont icon-dianzan" style="cursor: pointer;"
                                                @click="like(item.id)"
                                                :style="{ color: isLike(item.likeList) == true ? 'red' : '' }"></span>
                                            ({{ computedLike(item.likeList) }})
                                            <ChatDotRound style="width: 16px;margin-left: 10px;" />
                                            ({{ isUserCommentBlock && computedUserComment(item.id)?.length || 0 }})
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 右边装饰 -->
                <div class="main_right">
                    <div>
                        <div class="title" style="border-bottom: 1px solid #ccc;margin-bottom: 10px;">
                            <span
                                style="font-size: 24px;border-bottom: 2px solid #0d6cbf;padding-bottom: 10px;display: inline-block">随机推荐</span>
                        </div>
                    </div>
                    <ul class="random_list">
                        <li v-for="(item, index) in randomArticles">
                            <span
                                :style="{ backgroundColor: index == 0 ? 'red' : index == 1 ? 'green' : index == 2 ? '#ffad38' : '#ccc' }">{{
                                    index + 1 }}</span>
                            <a href="javascript:;" @click="goArticleCover(item.id)">{{ item.name }}</a>
                        </li>
                    </ul>
                    <div>
                        <div class="title" style="border-bottom: 1px solid #ccc;margin: 10px 0;">
                            <span
                                style="font-size: 24px;border-bottom: 2px solid #0d6cbf;padding-bottom: 10px;display: inline-block">热门推荐</span>
                        </div>
                        <!-- 热门推荐 -->
                        <ul class="random_list">
                            <li v-for="(item, index) in reqArticles">
                                <span
                                    :style="{ backgroundColor: index == 0 ? 'red' : index == 1 ? 'green' : index == 2 ? '#ffad38' : '#ccc' }">{{
                                        index + 1 }}</span>
                                <a href="javascript:;" @click="goArticleCover(item.id)">{{ item.name }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 分页器 -->
            <div class="pagination">
                <ul>
                    <li><a href="##" @click="currentPage = 1">首页</a></li>
                    <li><a href="##" @click="currentPage <= 1 ? currentPage = 1 : currentPage--" class="page_top">上一页</a>
                    </li>
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
    </main>
    <Bottom class="bottom" />
</template>
<style lang='less' scoped>
// 封装flex样式
.flex {
    display: flex;
    justify-content: space-between;
}

// 头部
header {
    width: 1100px;
    display: flex;
    justify-content: space-between;
    margin: 40px auto;

    // 轮播图
    .header_banner {
        flex: .5;

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

        img {
            display: block;
            width: 100%;
            height: 300px;
        }
    }

    .header_content {
        flex: .4;
        position: relative;

        img {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
        }

        p {
            transform: translate(180px, 120px);
            color: #f7b0b0;
            font-size: 14px;
        }
    }
}

// 主体
main {
    width: 100%;
    background-color: #fff;
    padding-top: 10px;
}

.main {
    width: 1400px;
    margin: 0 auto;

    .flex {
        .flex();

        // 左边文章
        .main_left {
            flex: 0.65;
            padding: 0 20px;

            // 文章列表
            .list {
                li {
                    .list_flex {
                        .flex();
                        align-items: center;
                        height: 140px;
                        border-bottom: 1px solid #f0f0f2;
                        padding: 10px;

                        // 封面
                        .list_left {
                            width: 180px;
                            height: 100px;
                            overflow: hidden;
                            flex: 0.3;
                            border: 1px solid #f0f0f2;
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

                    .list_flex:hover {
                        background-color: #fafafa;
                    }
                }
            }
        }

        // 右边装饰
        .main_right {
            flex: 0.3;

            // 随机展示文章列表
            .random_list {
                li {
                    margin-bottom: 4px;
                    overflow: hidden;
                    /* 隐藏超出部分的文本内容 */
                    text-overflow: ellipsis;
                    /* 使用省略号表示被隐藏的文本内容 */
                    white-space: nowrap;

                    /* 防止文本换行 */
                    span {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        margin-right: 8px;
                        color: #fff;
                        border-radius: 4px;
                    }

                    a {
                        display: inline-block;
                        height: 30px;
                        line-height: 30px;
                        color: #000;

                    }

                    a:hover {
                        color: red;
                    }
                }
            }
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
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    color: #000;
                    text-align: center;
                    text-decoration: none;
                    font-size: 11px;
                    transition: all 0.3s;
                    margin: 0 4px;
                    border-radius: 2px;
                    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.5);
                    font-weight: bold;
                }

                .active_bgColor {
                    background-color: #ccc;
                    color: red;
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

    // 右侧装饰
    .main_right {
        width: 300px;
    }

    // 头部
    header {
        width: 800px;
    }

    /deep/ .el-carousel__container {
        height: 250px;
    }

    header img {
        height: 250px;
    }
}

// 1100px
@media screen and (max-width: 1100px) {

    // 主体、标签页
    .main,
    .demo-tabs {
        width: 800px;
    }

    // 右侧装饰
    .main_right {
        width: 260px;
    }

    // 头部
    header {
        width: 700px;
    }

    /deep/ .el-carousel__container {
        height: 200px;
    }

    header img {
        height: 200px;
    }

    // 顶部右侧文字
    header .header_content p {
        transform: translate(105px, 89px);
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
        width: 300px;
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

    // 头部
    header {
        display: none;
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