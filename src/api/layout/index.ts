import request from '@/utils/request'
// 引入类型
import { userInfoType } from './type'
enum API {
    // 获取用户所有评论
    GET_USER = '/my/article/getUser'
}
export const reqUserInfo = () => request.get<string, userInfoType>(API.GET_USER)