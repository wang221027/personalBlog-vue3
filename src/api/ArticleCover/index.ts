// 统一管理文章详情
import request from "@/utils/request";
import qs from 'qs'
enum API {
    // 根据id获取文章列表
    GET_ARTICLE_LIST = '/api/getList',
    // 根据id获取用户昵称
    GET_USER_NICKNAME = '/api/reqUserMessage',
    // 根据id获取用户头像
    GET_USER_HEAD = '/api/reqUserMessage2'
}
// 根据id获取文章列表
export const reqArticleList = (id: string) => {
    return request({
        url: API.GET_ARTICLE_LIST,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
}

// 根据id获取用户昵称
export const reqUserNickName = (id: string) => {
    return request({
        url: API.GET_USER_NICKNAME,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
}
// 根据id获取用户头像
export const reqUserMessageHead = (id:string) => {
    return request({
        url: API.GET_USER_HEAD,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
}