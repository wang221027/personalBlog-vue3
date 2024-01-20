import { defineStore } from 'pinia'
export const userSocket = defineStore('socket', {
    state() {
        return {
            /* 聊天类型 */
            chatType: '' as string,
            /* 记录登录状态 */
            isLogin: false,
            /* 我的信息 */
            myInfo: {
                img: 'http://img.52z.com/upload/news/image/20180111/20180111085521_86389.jpg',
                name: '',
            },
            /* 别人的信息（特指聊天对象） */
            userInfo: {
                img: '',
                name: '',
            },
            /* 用户列表 */
            userList: [] as any[],
            /* 聊天记录 */
            chatMessageList: [] as any[],
            myMessageList: [] as any[]
        }
    },
    actions: {
        changeType() {
            this.chatType = '默认群聊',
                this.userInfo.name = '默认群聊'
        },
        changeUser(name: string) {
            this.chatType = name;
            this.userInfo.name = name;
        },
        // 存储用户信息
        storageUser(data: any, id: string) {
            if(data && data.length > 0) {
                const filterData = data.filter((item: any) => item.user_id != id && item.is_delete != 1)
                this.userList = filterData;
            }
        },
        // 存储聊天信息
        updateChatMessageList(data: any) {
            this.chatMessageList.push(data)
        },
        // 获取用户聊天信息
        reqChatMessageList(data: any) {
            this.chatMessageList = data;
        }
    },
    
})
