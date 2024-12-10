// *登录模块
import { ref, onBeforeUnmount, onMounted } from "vue";
// 引入 api
import { userLogin } from "@/api/login";
// 引入存储token方法
import { SET_TOKEN } from "@/utils/user";
// 引入ts类型判断
import { USER_API } from "@/api/login/type";
// 引入 element-plus message信息提示
import { ElMessage } from "element-plus";
// 引入全局事件总线
import $bus from "@/utils/event-bus";
import { useRouter, useRoute } from "vue-router";
export default function () {
  const $router = useRouter();
  const $route = useRoute();
  const username = ref("");
  const userPassword2 = ref("");
  let times: any;
  const login = async () => {
    const results: USER_API = await userLogin(
      username.value,
      userPassword2.value
    );
    if (results.status === 0) {
      SET_TOKEN(results.token);
      localStorage.setItem("userId", results.id);
      localStorage.setItem("nickname", results.nickname);
      localStorage.setItem("username", results.username);
      $bus.emit("isLoginShow", "false");
      ElMessage({
        message: `欢迎回来${results.nickname}`,
        type: "success",
        offset: 180,
      });
      times = setTimeout(() => {
        $bus.emit("getUserId");
        $bus.emit("getUserCover");
        $router.push({ name: "home" });
      }, 1000);
    } else {
      ElMessage({
        message: `账号和密码错误`,
        type: "error",
        offset: 180,
      });
    }
  };
  const goRegister = () => {
    $router.push({ name: "register" });
  };
  onMounted(() => {
    const getUsername: string = $route.query.username as string;
    if (getUsername) {
      username.value = getUsername;
    }
  });
  onBeforeUnmount(() => {
    clearTimeout(times);
  });
  return {
    login,
    goRegister,
    username,
    userPassword2,
  };
}
