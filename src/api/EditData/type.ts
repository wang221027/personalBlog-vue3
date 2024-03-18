// 编辑个人资料类型
type submitResultsType = {
    email: string,
    id: number,
    nickname: string,
    password: string,
    user_pic?: string,
    username: string
}
export interface submitType {
    data: submitResultsType[],
    message: string,
    status: number
}