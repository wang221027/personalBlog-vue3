//统一管理首页模块接口
import request from "@/utils/request";
// 引入 将数据转为json格式插件
import qs from 'qs'
//通过枚举管理首页模块的接口地址
enum API {
    // 注册新账号
    REGISTER_USER = '/api/reguser',
    // 获取用户昵称
    GET_USER_NICKNAME = '/api/getEvUser'
}
// 注册新账号
export const registerUser = (nickname:string, username:string, password:string) => {
    return request({
        url: API.REGISTER_USER,
        method: 'post',
        data: qs.stringify({
            nickname,
            username,
            password
        })
    })
}
// 获取用户昵称
export const reqUserNickName = () => request(API.GET_USER_NICKNAME)