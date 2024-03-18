// 统一管理文章详情
import request from "@/utils/request";
import qs from 'qs'
// 引入类型
import type {isArticleData,userCommentType} from '@/api/home/type'
import type {ArticleUrlType} from '@/api/ArticleCover/type'
enum API {
    // 根据id获取文章列表
    GET_ARTICLE_LIST = '/api/getList',
    // 根据id获取用户昵称
    GET_USER_NICKNAME = '/api/reqUserMessage',
    // 根据id获取用户头像
    GET_USER_HEAD = '/api/reqUserMessage2',
    // 发表评论
    PUT_COMMENT = '/my/article/addComment',
    // 获取所有评论
    REQ_COMMENTS = '/my/article/reqComments'
}
// 根据id获取文章列表
export const reqArticleList = (id: string) => {
    return request<string, isArticleData>({
        url: API.GET_ARTICLE_LIST,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
}

// 根据id获取用户昵称
export const reqUserNickName = (id: string) => {
    return request<string, isArticleData>({
        url: API.GET_USER_NICKNAME,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
}
// 根据id获取用户头像
export const reqUserMessageHead = (id:string) => {
    return request<string,ArticleUrlType>({
        url: API.GET_USER_HEAD,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
}
// 发表评论
export const reqComment = (alias: string, isReply: string, avatarUrl: string, nickname: string, commentId: string, userCommentId: any,otherUserNames?: string) => {
    return request<string, userCommentType>({
        url: API.PUT_COMMENT,
        method: 'post',
        data: qs.stringify({
            alias,
            isReply,
            avatarUrl,
            nickname,
            commentId,
            userCommentId,
            otherUserNames
        })
    })
}
// 获取所有评论
export const reqComments = () => {
    return request<string, userCommentType>({
        url: API.REQ_COMMENTS
    })
}