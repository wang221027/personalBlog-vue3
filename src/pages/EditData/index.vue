<script setup lang='ts'>
import { ref, reactive } from 'vue'
// 引入修改用户个人简介api
import { putUserEmail, updateUserNickname } from '@/api/EditData'
// 引入路由构造器
import { useRouter } from 'vue-router'
// 引入 Element-plus message消息提示
import { ElMessage } from 'element-plus'
// 注册路由构造器
const $router = useRouter();
let labelPosition = ref('top')
let formLabelAlign = reactive({
    name: '',
    region: '',
})
// 修改用户资料
let submit = async () => {
    const results = await putUserEmail(formLabelAlign.name, formLabelAlign.region);
    if(results.status == 0) {
        ElMessage({
            message: "修改成功！",
            type: "success",
            offset: 100
        })
        const user_id = localStorage.getItem("userId")
        const results = await updateUserNickname(user_id ,formLabelAlign.name)
        console.log(results);
        
        // 修改成功后跳转到个人主页
        $router.push({name: 'PersonalCenter', query: {isGetUserInfo: "true"}})
    }
}
</script>

<template>
    <div>
        <!-- 返回上一级 -->
        <GoBack color="#000" content="编辑资料" width="1200px" />
        <div class="main_bg"></div>
        <div class="main">
            <el-radio-group v-model="labelPosition" size="small">
                <el-radio-button label="left">左对齐</el-radio-button>
                <el-radio-button label="right">右对齐</el-radio-button>
                <el-radio-button label="top">顶部对齐</el-radio-button>
            </el-radio-group>
            <div style="margin: 20px;"></div>
            <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                <el-form-item label="昵称">
                    <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input v-model="formLabelAlign.region" type="textarea"></el-input>
                </el-form-item>
                <el-button type="primary" plain @click="submit">提交</el-button>
            </el-form>
        </div>
    </div>
</template>

<style lang='less' scoped>
.main {
    width: 1200px;
    margin: 0 auto;
    background-color: #ccc;
    padding: 20px;
    border-radius: 12px;
    opacity: .8;
}

.main_bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url(./images/bg.jpg) no-repeat;
    background-size: cover;
    opacity: .8;
    z-index: -1;
}
</style>