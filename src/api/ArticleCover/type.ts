// 定义重复的类型
type sameType = {
  message: string;
  status: number;
};
// 声明文章详情类型
type ArticleUrlResultsType = {
  id: number;
  title_url: string;
};
export interface ArticleUrlType extends sameType {
  data: ArticleUrlResultsType[];
}
