// 统一管理文章详情
import request from "@/utils/request";
// 引入类型
import type {isArticleData,isArticleCoverType} from '@/api/home/type'
enum API {
    // 根据用户id获取文章列表
    USER_ID_LIST = '/my/getUserIdList',
    // 根据用户id获取文章封面
    USER_ID_COVER = '/my/article/userInfo2',
    // 根据用户id删除文章列表
    DEL_USER_LIST = '/my/article/deletecate',
    // 获取用户个人简介
    GET_USER_EMAIL = '/my/userinfo'
}
// 根据用户id获取文章列表
export const getUserIdList = () => {
    return request<string, isArticleData>({
        url: API.USER_ID_LIST,
        method: 'POST',
    })
};
// 根据用户id获取文章封面
export const getUserIdCover = () => {
    return request<string, isArticleCoverType>({
        url: API.USER_ID_COVER,
    })
};
// 根据用户id删除文章列表
export const delUserList = (id: any) => {
    return request({
        url: API.DEL_USER_LIST + '/' + id,
    })
};
// 获取用户个人简介
export const reqUserEmail = () => request(API.GET_USER_EMAIL)