// 定义重复的类型
type sameType = {
  message: string;
  status: number;
};
// 服务器返回的文章列表数据类型
export type articleListData = {
  alias: string;
  id: number;
  init_id?: number;
  isBlock: string;
  is_delete: number;
  likeNum: number;
  likeUserId?: number;
  name: string;
  nickname: string;
  time: string;
  type: string;
  user_id: string;
};
export interface isArticleData extends sameType {
  data: articleListData[];
}
// 获取文章列表封面url数据类型
export type coverData = {
  file?: string;
  id: number;
  init_id?: number;
  is_delete: string;
  title_url: string;
  user_id: string;
};

export interface isArticleCoverType extends sameType {
  data: coverData[];
}
// 获取用户所有评论
export type userCommentResultType = {
  alias: string;
  avatarUrl: string;
  commentId: string;
  id: string;
  isReply: number;
  nickname: string;
  otherUserNames?: null;
  time: string;
  userCommentId?: string;
};
export interface userCommentType extends sameType {
  data: userCommentResultType[];
}
