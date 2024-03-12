import { defineStore } from 'pinia'
export const userSocket = defineStore('socket', {
    state() {
        return {
            /* 聊天类型 */
            chatType: '' as string,
            /* 用户列表 */
            userList: [] as any[],
            /* 聊天记录(群聊) */
            chatMessageList: [] as any[],
            // 存储好友列表
            userData: [] as any[],
        }
    },
    actions: {
        
    },
})
