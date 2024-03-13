//统一管理首页模块接口
import request from "@/utils/request";
import { isArticleData, isArticleCover } from './type'
//通过枚举管理首页模块的接口地址
enum API {
    // 获取文章列表数据
    ARTICLE_URL = '/api/list',
    // 获取文章列表封面url数据
    ARTICLE_COVER_URL = '/api/getTitleUrl',
    // 获取用户所有评论
    REQ_USER_COMMENT = '/my/article/getUserComment'
}
//获取文章列表数据
export const reqArticle = () => request.get<any, isArticleData>(API.ARTICLE_URL)
// 获取文章列表封面url数据m
export const reqArticleCoverData = () => request.get<any, isArticleCover>(API.ARTICLE_COVER_URL)
// 获取用户所有评论
export const reqUserComment = () => request.get(API.REQ_USER_COMMENT)
