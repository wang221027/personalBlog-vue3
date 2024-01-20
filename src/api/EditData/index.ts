//统一管理首页模块接口
import request from "@/utils/request";
import qs from 'qs'
//通过枚举管理首页模块的接口地址
enum API {
    // 修改用户个人简介
    PUT_USER_EMAIL = '/my/userinfo',
    // 修改用户文章列表作者姓名
    UPDATE_USER_NICKNAME = '/my/article/updateArtCateById'
}
// 修改用户个人简介
export const putUserEmail = (name:string, region: string) => request({
    url: API.PUT_USER_EMAIL,
    method: 'post',
    data: qs.stringify({
        nickname: name,
        email: region,
    })
})
// 修改用户文章列表作者姓名
export const updateUserNickname = (user_id: any,nickname: string) => request({
    url: API.UPDATE_USER_NICKNAME,
    method: 'post',
    data: qs.stringify({
        user_id,
        nickname
    })
})