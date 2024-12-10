<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
// 引入pinia仓库
import useLayoutStore from '@/store/layout';
const layoutStore = useLayoutStore();
// 引入element-plus信息提示
import { ElMessage } from 'element-plus';
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();
let apiList = reactive([
    {
        path: 'http://43.138.70.109:8010/viteList',
        method: 'GET',
        message: '获取pc产品数据',
        title: '不需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/bottomList',
        method: 'GET',
        message: '获取列表数据',
        title: '不需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/bannerList',
        method: 'GET',
        message: '获取轮播图数据',
        title: '不需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/addcates',
        method: 'POST',
        message: '新增文章分类',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/deletecate/:id',
        method: 'GET',
        message: '根据Id删除文章分类的路由',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/cates/:id',
        method: 'GET',
        message: '根据Id获取文章分类的路由',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/updateArtCateById',
        method: 'POST',
        message: '根据Id更新用户文章列表作者姓名',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/upHead',
        method: 'POST',
        message: '根据Id更新文章分类的路由',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/avatar',
        method: 'POST',
        message: '插入文章封面url',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/avatar1',
        method: 'POST',
        message: '根据id修改封面url',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/userInfo',
        method: 'GET',
        message: '获取用户发布的文章',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/userInfo2',
        method: 'GET',
        message: '获取用户列表封面url',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/userInfo3',
        method: 'GET',
        message: '获取用户头像url',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/addComment',
        method: 'POST',
        message: '发表评论',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/reqComments',
        method: 'GET',
        message: '获取所有评论',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/reqUsreInfo',
        method: 'GET',
        message: '获取用户所有聊天记录',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/RoomUserInfo',
        method: 'GET',
        message: '获取聊天室用户信息',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/reqIsToken/:username',
        method: 'POST',
        message: '判断用户token是否有效',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/getUserComment',
        method: 'GET',
        message: '获取所有评论',
        title: '需要携带token'
    },
    {
        path: 'http://43.138.70.109:8010/api//my/getUser',
        method: 'GET',
        message: '获取所有用户',
        title: '需要携带token'
    },
])
const cloneText = async (text: string) => {
    try {
        await toClipboard(text);
        ElMessage({
            message: '复制成功！',
            type: 'success',
            offset: 100
        })
    } catch (e: any) {
        ElMessage({
            message: e.message,
            type: 'error',
            offset: 100
        })
    }
}
onMounted(() => {
    layoutStore.getArticle()
})
</script>

<template>
    <h2 style="margin: 30px 0 0 50px;">接口管理</h2>
    <ul class="infinite-list" style="overflow: auto;height: calc(100vh - 142px);">
        <template v-for="item in apiList">
            <li class="infinite-list-item">
                <div>
                    <h3>{{ item.title }}</h3>
                    <h4>{{ item.message }}</h4>
                    <p>请求地址：
                        <span style="margin-right: 10px;" @click="cloneText(item.path)">{{ item.path }}</span>
                        <span @click="cloneText(item.method)" class="method_span">{{ item.method }}</span>
                    </p>
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
        height: 100px;
        border-radius: 12px;
        transition: all .3s;

        div {
            padding: 0 10px;

            p {
                cursor: pointer;

                span {
                    color: green;
                    font-size: 14px;
                    font-weight: 600;
                }

                .method_span {
                    display: inline-block;
                    padding: 0 10px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    background-color: green;
                    color: #fff;
                    border-radius: 4px;
                }
            }
        }
    }

    li:hover {
        background-color: #D1EEEE;
    }
}
</style>