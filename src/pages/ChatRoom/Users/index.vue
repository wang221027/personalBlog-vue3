<script lang="ts" setup>

</script>
<template>
    <!-- 聊天好友 -->
    <div class="container_tabbar">
        <ul class="infinite-list" style="overflow: auto;">
            <li class="infinite-list-item">
                <div style="display: flex;align-items: center;">
                    <img src="http://43.138.70.109:8010/avatar/haizeiw.jpg" alt="">
                    <div>
                        <span>默认群聊</span>
                    </div>
                </div>
            </li>
           
        </ul>
    </div>
    <!-- 内容 -->
    <div class="container_right" style="position: relative;">
        
    </div>
</template>
<style scoped lang='less'>
.scroll {

    // 修改滚动条样式
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }
}

* {
    box-sizing: border-box;
}

.card-header {
    div {
        span {
            display: block;
            font-size: 12px;
            color: #b6b6b6;
        }
    }
}

// 聊天好友
.container_tabbar {
    flex: .18;
    height: calc(100vh - 130px);
    // 修改滚动条样式
    .scroll();

    .infinite-list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 10px;
        background-color: #e8e6e6;
        overflow: hidden;
        /* 隐藏超出部分的文本内容 */
        text-overflow: ellipsis;
        /* 使用省略号表示被隐藏的文本内容 */
        white-space: nowrap;
        width: 370px;
        /* 防止文本换行 */
        position: relative;

        .message_p {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 270px;
        }

        .on_line {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #17fa0a;
            margin-left: 4px;
        }
    }


    .add_user_message:hover {
        background-color: #d2d2d2;
    }

    .infinite-list-item:hover {
        background-color: #c9c8c6;
    }

    .infinite-list-item.active {
        background-color: #c9c8c6;
    }

    img {
        display: block;
        width: 36px;
        height: 36px;
        margin-right: 10px;
    }
    .new_user {
        display: flex;
        height: 50px;
        align-items: center;
        padding: 10px;
        background-color: #e8e6e6;
        div {
            width: 36px;
            height: 36px;
            background-color: #fa9d3b;
            line-height: 36px;
            text-align: center;
            color: #fff;
            margin-right: 10px;
        }
    }
    .new_user:hover {
        background-color: #c9c8c6;
    }
}

// 内容
.container_right {
    flex: .78;
    background-color: #f5f5f5;

    // 添加好友
    .add_user {
        width: 300px;
        height: 200px;
        background-color: #fff;
        margin-top: 50px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        padding: 20px;

        div {
            img {
                width: 60px;
                height: 60px;
                border-radius: 4px;
                margin-right: 20px;
            }
        }

        hr {
            margin-top: 20px;
        }

        a {
            display: block;
            width: 104px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background-color: #07c160;
            color: #fff;
            border-radius: 4px;
            font-size: 14px;
            margin: 0 auto;
            margin-top: 30px;
        }
    }
}

// 768px
@media screen and (max-width: 768px) {

    // 内容
    .container_right {
        display: none;
        flex: 0.9;
    }

    .container_tabbar {
        flex: 0.9;
    }

    .return_message {
        display: block !important;
    }

    .infinite-list-item {
        width: 100% !important;
    }
}
</style>