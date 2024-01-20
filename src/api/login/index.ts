// 统一管理文章详情
import request from "@/utils/request";
// 让数据转换为json格式
import qs from 'qs'
// 引入类型
import { USER_API } from './type'
enum API {
    USER_LOGIN = '/api/login'
}
export const userLogin = (username: string, password: string) => {
    return request({
      url: API.USER_LOGIN,
      method: 'POST',
      data: qs.stringify({
        username,
        password
      })
    }) as Promise<USER_API>; // 明确返回值类型
  };