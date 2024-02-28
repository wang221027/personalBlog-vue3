<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
// 引入路由
import { useRouter, useRoute } from 'vue-router';
// 注册路由
const $router = useRouter()
const $route = useRoute()
// 引入 Element-plus message消息提示
import { ElMessage } from 'element-plus'
// 引入请求 api
import {
    reqPublishArticle, reqPublishArticleAndCover, reqPublishArticleAndCoverDel, reqPutArticleList
    , reqPutArticleCover, reqPutArticleCoverNo
} from '@/api/PublishArticle'
// 顶部对齐方式
let labelPosition = ref<string>("top")
// 表单数据
let formLabelAlign: any = reactive({
    name: "",
    alias: "",
    type: [],
    nickname: ''
})
// 多选框数据
let checkboxDataList: string[] = reactive([
    "JavaScript", "HTML", "CSS", "移动端", "less", "sass", "stylus", "Node.js", "webpack", "gulp", "Vite", "TypeScript", "Vue", "Vue2", "vue3", "React", "Angular", "Element-UI",
    "微信小程序", "抖音小程序", "支付宝小程序", "uni-app", "flutter", "React Native", "three.js", "HTTP", "PHP", "Java", "Go", "C", "C++", "python", "Basic", "Pascal",
    "MySQL", "其他"
])
// 发布文章是否显示
let isShow = ref(true);
// 封面的url
let file = ref(null);
let userTitle = ref<string>('');
// 动态修改网页标题
let title = ref('发布文章');
// 上传图片后显示
let imageURL = ref('')
// 获取封面url
let handleFileUpload = (event: any) => {
    file.value = event.target.files[0];
    // 上传图片后显示
    const target = event.target as HTMLInputElement
    const fileUrl = (target.files as FileList)[0]
    if (fileUrl) {
        const reader = new FileReader()
        reader.onload = (event: ProgressEvent<FileReader>) => {
            if (event.target) {
                imageURL.value = event.target.result as string
            }
        }
        reader.readAsDataURL(fileUrl)
    }
}
// 发布文章
let tonSubmit = async () => {
    // 校验输入框是否为空
    if (formLabelAlign.type == '' || formLabelAlign.name == '' || formLabelAlign.alias == '') {
        ElMessage({
            message: '名字或类型或内容不允许为空！',
            type: 'error',
            offset: 100
        })
        return;
    } else {
        // 获取用户昵称
        const nickname: any = localStorage.getItem("nickname")
        // 获取文章类型
        const type = formLabelAlign.type.join("，");
        const results: any = await reqPublishArticle(formLabelAlign.name, formLabelAlign.alias, type, nickname)
        if (results.message.indexOf('ER_DUP_ENTRY: Duplicate entry') != -1) {
            return ElMessage({
                message: '标题重复，请更换标题！',
                type: 'error',
                offset: 100
            })
        }
        // 如果输入框都不为空,发送请求添加文章
        if (file.value != null) {
            let formData: any = new FormData();
            formData.append("avatar", file.value);
            if (formData != '') {
                await reqPublishArticleAndCover(formData)
            }
        } else {
            // 如果没有选封面,发送请求,向数据库添加一条空的封面url
            await reqPublishArticleAndCoverDel()
        }
        ElMessage({
            message: "新增文章分类成功！",
            type: "success",
            offset: 100,
        });
        setTimeout(() => {
            $router.push({ name: "home" });
        }, 1000);
    }
}
// 修改文章
let putSubmit = async () => {
    if (formLabelAlign.type == '' || formLabelAlign.name == '' || formLabelAlign.alias == '') {
        ElMessage({
            message: '名字或类型或内容不允许为空！',
            type: 'error',
            offset: 100
        })
        return;
    } else {
        const type = formLabelAlign.type.join("，");
        const id: any = $route.query.id;
        await reqPutArticleList(formLabelAlign.name, formLabelAlign.alias, type, id)
        if (file.value != null) {
            // 根据id修改封面url
            let formData: any = new FormData();
            formData.append("avatar", file.value);
            if (formData != '') {
                await reqPutArticleCover(id, formData)
            }
        } else {
            await reqPutArticleCoverNo(id)
        }
        ElMessage({
            message: "更新文章成功！",
            type: "success",
            offset: 100,
        });
        setTimeout(() => {
            $router.push({ name: "PersonalCenter" });
        }, 1000);
    }
}
onMounted(() => {
    // 判断是不是从编辑跳转过来的，如果是，让修改文章显示
    if ($route.query.isShow == 'true') {
        isShow.value = false;
        title.value = "修改文章";
    } else {
        title.value = "发布文章";
    }
    // 点击编辑跳转过来让点击的标题、类型、文章赋值给现在的显示
    if ($route.query.name && $route.query.type && $route.query.alias) {
        formLabelAlign.name = $route.query.name;
        formLabelAlign.type.push($route.query.type);
        formLabelAlign.alias = $route.query.alias;
    }
    // 动态修改网页标题
    document.title = title.value;
})
</script>
<template>
    <div class="main_bg"></div>
    <!-- 返回上一级 -->
    <GoBack color="red" :content="title" width="1200px" class="go_back" />
    <div class="main">
        <div class="container_bg"></div>
        <!-- 表单对齐方式 -->
        <el-radio-group v-model="labelPosition" size="small">
            <el-radio-button label="left">左对齐</el-radio-button>
            <el-radio-button label="right">右对齐</el-radio-button>
            <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
        <div style="margin: 20px;"></div>
        <!-- 文章标题 -->
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
            <el-form-item label="文章标题">
                <el-input v-model="formLabelAlign.name" v-if="userTitle == ''"></el-input>
            </el-form-item>
            <!-- 文章类型 -->
            <el-form-item label="文章类型">
                <el-checkbox-group v-model="formLabelAlign.type">
                    <el-checkbox name="type" v-for="(item, index) in checkboxDataList" :label="item"
                        :key="index"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- 上传封面 -->
            <div class="file_container">
                <label for="file" class="file">
                    <div class="file_top"></div>
                    <div class="file_bottom"></div>
                </label>
                <input type="file" id="file" style="display: none;" @change="handleFileUpload">
                <!-- 上传图片后显示 -->
                <div v-if="imageURL" class="image-preview"
                    :style="{ background: `url(${imageURL}) no-repeat`, backgroundSize: 'contain', backgroundPosition: 'center center' }">
                </div>
            </div>
            <!-- 文章内容 -->
            <el-form-item label="文章内容">
                <el-input type="textarea" v-model="formLabelAlign.alias"></el-input>
            </el-form-item>
            <!-- 发布文章和修改文章 -->
            <el-form-item>
                <!-- 发布文章 -->
                <el-button type="primary" @click="tonSubmit" v-if="isShow">发布文章</el-button>
                <!-- 修改文章 -->
                <el-button type="warning" v-if="isShow == false" @click="putSubmit">修改文章</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style lang='less' scoped>
.main_bg {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: 	#ccc;
    z-index: -1;
}

.main {
    width: 1200px;
    padding: 20px;
    margin: 20px auto;
    border-radius: 10px;
    background-size: cover;
    .file_container {
        display: flex;
        position: relative;
        // 上传图片后显示
        .image-preview {
            width: 300px;
            height: 200px;
            margin-left: 50px;
            overflow: hidden;
        }
        .file {
            display: block;
            width: 200px;
            height: 200px;
            border-radius: 6px;
            border: 1px dashed #fff;
            position: relative;
            cursor: pointer;
            margin-bottom: 20px;

            .file_top,
            .file_bottom {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 3px;
                background: #fff;
                border-radius: 10px;
            }

            .file_bottom {
                transform: translate(-50%, -50%) rotate(90deg);
            }

            .show {
                position: absolute;
                left: 220px;
                bottom: 20px;
                font-size: 24px;
                color: #fff;
            }
        }
        .file:hover {
            border-color: #409eff;
        }
    }
    // 文章内容
    /deep/ .el-form-item__label {
        color: #fff;
    }
}
// 1300px
@media screen and (max-width: 1300px) {
    // 主体
    .main {
        width: 1000px;
    }
    // 返回上一级
    .go_back {
        display: none;
    }
}
// 1100px
@media screen and (max-width: 1100px) {
    // 主体
    .main {
        width: 800px;
    }
}

// 996px
@media screen and (max-width: 996px) {

    // 主体
    .main {
        width: 700px;
    }
}

// 768px
@media screen and (max-width: 768px) {
     // 主体
     .main {
        width: 500px;
    }
    // 上传封面
    .file {
        width: 150px !important;
        height: 150px !important;
    }
    .image-preview {
        width: 150px !important;
        height: 150px !important;
    }
    // 多选框字体
    /deep/ .el-checkbox__label {
        color: red;
    }
    // 文章内容提示
    /deep/ .el-form-item__label {
        color: #fff;
    }
}

// 600px
@media screen and (max-width: 600px) {
     // 主体
     .main {
        width: 400px;
    }
}

// 500px
@media screen and (max-width: 500px) {
     // 主体
     .main {
        width: 300px;
    }
}
</style>