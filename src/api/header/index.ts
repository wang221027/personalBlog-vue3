//统一管理首页模块接口
import request from "@/utils/request";
import qs from 'qs'
// 引入类型判断
import { userType } from './type'
//通过枚举管理首页模块的接口地址
enum API {
    // 根据id获取用户头像url
    GET_ARTICLE_COVER = 'api/reqUserMessage2',
    // 获取用户id及昵称
    USER_TOKEN = '/my/userinfo',
    // 用户更换头像
    UPDATE_USER_COVER = '/my/avatar'
}
// 根据id获取用户头像url
export const reqArticleCover = (id: string) => {
    return request({
        url: API.GET_ARTICLE_COVER,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
}
// 获取用户id及昵称
export const userToken = () => request(API.USER_TOKEN) as Promise<userType>;
// 用户更换头像
export const unDateUserCover = (formData: any) => {
    return request.post(API.UPDATE_USER_COVER, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
          },
    })
}