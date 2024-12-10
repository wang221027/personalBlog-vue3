//统一管理首页模块接口
import request from "@/utils/request";
import type {
  isArticleData,
  isArticleCoverType,
  userCommentType,
} from "./type";
//通过枚举管理首页模块的接口地址
enum API {
  // 获取文章列表数据
  ARTICLE_URL = "/api/list",
  // 获取文章列表封面url数据
  ARTICLE_COVER_URL = "/api/getTitleUrl",
  // 获取用户所有评论
  REQ_USER_COMMENT = "/my/article/getUserComment",
  // 用户点赞
  REQ_USER_LIKE = "/userLike",
}
//获取文章列表数据
export const reqArticle = () => request.get<string, isArticleData>(API.ARTICLE_URL);
// 获取文章列表封面url数据
export const reqArticleCoverData = () => request.get<string, isArticleCoverType>(API.ARTICLE_COVER_URL);
// 获取用户所有评论
export const reqUserComment = () => request.get<string, userCommentType>(API.REQ_USER_COMMENT);
// 用户点赞
export const reqUserLike = (id: number, nickname: string) => request.post(API.REQ_USER_LIKE + "/" + id + "/" + nickname);
