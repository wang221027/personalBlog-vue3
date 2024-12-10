<script lang="ts" setup>
import { onMounted } from 'vue';
// 引入pinia创库
import useLayoutStore from '@/store/layout';
const layoutStore = useLayoutStore();
// 引入根据用户id获取文章列表和封面api
import { delUserList } from '@/api/PersonalCenter'
// 删除文章
let removeArticle = async (id: number) => {
    const results = await delUserList(id)
    if (results.status == 0) {
        layoutStore.getArticle()
    }
}
onMounted(() => {
    layoutStore.getArticle()
})
</script>
<template>
    <h2 style="margin: 30px 0 0 50px;">文章管理</h2>
    <ul class="infinite-list" style="overflow: auto;height: calc(100vh - 142px);">
        <template v-for="article in layoutStore.userDataList" :key="article.id">
            <li class="infinite-list-item" v-if="article.is_delete == 0">
                <div class="article_flex">
                    <div class="article_left">
                        标题：{{ article.alias }}
                        <p>作者：{{ article.nickname }}</p>
                    </div>
                    <div class="article_right">
                        <!-- 删除文章 -->
                        <el-popconfirm title="确认要删除吗？" @confirm="removeArticle(article.id)">
                            <template #reference>
                                <el-button>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </li>
        </template>
    </ul>
</template>
<style scoped lang='less'>
* {
    box-sizing: border-box;
}

ul {
    padding: 50px;

    li {
        display: flex;
        align-items: center;
        height: 60px;
        border-radius: 12px;
        transition: all .3s;
        .article_flex {
            padding: 0 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .article_left {
                p {
                    font-size: 14px;
                    color: #999;
                }
            }
        }
    }

    li:hover {
        background-color: #D1EEEE;
    }
}
</style>