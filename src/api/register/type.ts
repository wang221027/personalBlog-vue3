// 注册类型
// 定义重复的类型
type sameType = {
  message: string;
  status: number;
};
// 注册新账号
export interface registerUserType extends sameType {
  data: string
}
// 获取用户昵称
export type reqUserNickNameResultsType = {
    email?: string,
    id: number,
    nickname: string,
    password: string,
    user_pic?: string,
    username: string
}
export interface reqUserNickNameType extends sameType {
    data: reqUserNickNameResultsType[]
}