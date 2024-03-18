// 获取用户信息类型
export interface userType {
    status: number,
    data: {
        email: null,
        id: number,
        nickname: string,
        password: string,
        username: string,
        user_pic: null,
        message: string
    }
}
// 获取头像类型
export interface userAvatarType {
    data: string | number[],
    message: string,
    status: number
}
// 发请求根据id获取用户头像url
type userAvatarUrlResultsType = {
    id: number,
    title_url: string
}
export interface userAvatarUrlType {
    data: userAvatarUrlResultsType[],
    message: string,
    status: number
}