// 统一管理文章详情
import request from "@/utils/request";
// 让数据转换为json格式
import qs from 'qs'
enum API {
    // 发布文章请求地址
    PUBLIC_ARTICLE = '/my/article/addcates',
    // 发布文章和封面请求地址
    PUBLIC_ARTICLE_AND_COVER = '/my/article/avatar',
    // 发布文章和封面如果没有选封面的请求地址
    PUBLIC_ARTICLE_AND_COVER_DEL = '/my/article/avatar2',
    // 修改文章请求地址
    PUT_ARTICLE_LIST = '/api/updateArticle',
    // 根据id修改封面url
    PUT_ID_ARTICLE_COVER = '/my/article/avatar1',
    // 如果没有选封面，根据id添加一张空路径
    PUT_ID_ARTICLE_COVER_NO = '/api/updateAvatar',
    
}
// 发布文章请求地址
export const reqPublishArticle = (name: string, alias: string, type: any, nickname: string) => {
    return request({
        url: API.PUBLIC_ARTICLE,
        method: 'POST',
        data: qs.stringify({
            name,
            alias,
            type,
            nickname
        })
    })
};
// 发布文章和封面请求地址
export const reqPublishArticleAndCover = (formData: any) => {
    return request.post(API.PUBLIC_ARTICLE_AND_COVER, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
};
// 发布文章和封面如果没有选封面的请求地址
export const reqPublishArticleAndCoverDel = () => {
    return request({
        url: API.PUBLIC_ARTICLE_AND_COVER_DEL,
        method: 'POST',
        data: qs.stringify({
            titleUrl: '',
            file: 'del'
        })
    })
};
// 修改文章
export const reqPutArticleList = (name:string, alias: string, type: string, id: string) => {
    return request({
        url: API.PUT_ARTICLE_LIST,
        method: 'POST',
        data: qs.stringify({
            name,
            alias,
            type,
            id
          }),
    })
};
// 根据id修改封面url
export const reqPutArticleCover = (id: string, formData:any) => {
    return request.post(API.PUT_ID_ARTICLE_COVER + `?id=${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
};
// 如果没有选封面，根据id添加一张空路径
export const reqPutArticleCoverNo = (id: string) => {
    return request({
        url: API.PUT_ID_ARTICLE_COVER_NO,
        method: 'post',
        data: qs.stringify({
            id
        })
    })
};
