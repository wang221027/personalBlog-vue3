// layout类型约束
export type userInfoResultType = {
    email?: string,
    id: number,
    nickname: string,
    password: string,
    user_pic?: string,
    username: string
}
export interface userInfoType {
    data: userInfoResultType[],
    message: string,
    status: number
}