import { defineStore } from "pinia";
// 引入api
import { reqArticle } from "@/api/home";
import { reqUserInfo } from "@/api/layout";
import { reqUsreInfo } from "@/api/socket";
// 引入类型
import { articleListData, isArticleData } from "@/api/home/type";
import { userInfoType, userInfoResultType } from "@/api/layout/type";
export default defineStore("layout", {
  state() {
    return {
      // 文章列表
      userDataList: [] as articleListData[],
      // 所有用户
      userData: [] as userInfoResultType[],
      userSocketList: [] as any[],
      isBlock: false,
      isInit: false,
    };
  },
  actions: {
    // 获取所有文章列表
    async getArticle() {
      const result: isArticleData = await reqArticle();
      this.userDataList = result.data;
    },
    // 获取所有用户
    async getUserInfo() {
      const result: userInfoType = await reqUserInfo();
      this.userData = result.data;
    },
    // 获取所有聊天记录
    async getSocketList() {
      const result = await reqUsreInfo();
      this.userSocketList = result.data;
    },
  },
});
