//统一管理首页模块接口
import request from "@/utils/request";
// 通过枚举管理首页模块的接口地址
enum API {
    IS_TOKEN = '/my/article/reqIsToken'
}
export const isToken = (username: string) => request.post(API.IS_TOKEN + '/' + username)