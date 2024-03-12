// 统一管理文章详情
import request from "@/utils/request";
enum API {
  // 获取用户聊天记录
  REQ_USER_INFO = "/my/article/reqUsreInfo",
  // 获取用户信息
  REQ_USER_DATA_LIST = "/my/article/RoomUserInfo",
  // 查询好友
  REQ_ADD_USER = "/my/article/addUser",
  // 添加好友
  REQ_ADD_USER2 = "/my/article/addUser2",
  // 获取所有的好友列表
  GET_USER_LIST = '/my/article/getUserList',
  // 向其他用户申请好友后获取当前申请好友的列表
  GET_USER_LIST2 = '/my/article/getUserList2'
}
// 获取用户聊天记录
export const reqUsreInfo = () => request.get(API.REQ_USER_INFO);
// 获取用户信息
export const reqUserData = () => request.get(API.REQ_USER_DATA_LIST);
// 查询好友
export const reqAddUser = (username: string) => request.post(API.REQ_ADD_USER + "/" + username);
// 添加好友
export const reqAddUser2 = (username: string, user_id: string) => request.post(API.REQ_ADD_USER2 + "/" + username + '/' + user_id);
// 获取所有的好友列表
export const getUserList = (user_id: string) => request.post(API.GET_USER_LIST + '/' + user_id)
// 向其他用户申请好友后获取当前申请好友的列表
export const getUserList2 = (username: string) => request.post(API.GET_USER_LIST2 + '/' + username)