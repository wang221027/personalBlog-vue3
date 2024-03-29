// * 注册模块
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// 引入注册 方法
import { registerUser, reqUserNickName } from "@/api/register";
// 引入 Element-plus message消息提示
import { ElMessage } from "element-plus";
export default function () {
  // 注册路由构造器
  const $router = useRouter();
  // 存储所有用户的昵称
  const nicknameArr: any = ref([]);
  let username = ref("");
  let userPassword = ref("");
  let nickname = ref("");
  let filterNickName = ref("");
  // 注册
  let register = async () => {
    filterNickName.value = nicknameArr.value.filter(
      (item: any) => item.nickname == nickname.value
    );
    if (filterNickName.value.length > 0) {
      return ElMessage({
        message: "昵称重复！",
        type: "error",
        offset: 180,
      });
    }
    if (nickname.value == "") {
      return ElMessage({
        message: "昵称不能为空！",
        type: "error",
        offset: 180,
      });
    }
    if (username.value.length <= 0) {
      return ElMessage({
        message: "用户名最少需要一位！",
        type: "error",
        offset: 180,
      });
    }
    if (username.value.length >= 14 || userPassword.value.length >= 14) {
      return ElMessage({
        message: "用户名或密码不能超过14位！",
        type: "error",
        offset: 180,
      });
    }
    if (username.value.length < 6 || userPassword.value.length < 6) {
      return ElMessage({
        message: "账号或密码最少需要六位！",
        type: "error",
        offset: 180,
      });
    }
    const results: any = await registerUser(
      nickname.value,
      username.value,
      userPassword.value
    );
    if (results.status == 0) {
      ElMessage({
        message: "注册成功！",
        type: "success",
        offset: 180,
      });
      setTimeout(() => {
        $router.push({ name: "login", query: { username: results.data } });
        ElMessage({
          message: "请您输入密码登录！",
          type: "success",
          offset: 180,
        });
      }, 1000);
    } else {
      ElMessage({
        message: "用户名或密码重复",
        type: "error",
        offset: 180,
      });
    }
  };
  // 获取用户昵称
  let getUserNickName = async () => {
    const results = await reqUserNickName();
    nicknameArr.value = results.data;
  };
  onMounted(() => {
    getUserNickName();
  });
  return {
    username,
    userPassword,
    nickname,
    register,
  };
}
