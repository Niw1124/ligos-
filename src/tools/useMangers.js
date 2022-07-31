//修改密码功能

import { reactive, ref } from "vue";
import { updatePassword, logOut } from "~/api/manager";
import { messageInfo, messageConfirmationBox } from "~/tools/messagePopup";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export function useRePassword() {
  const store = useStore();
  const router = useRouter();
  // const showDrawer = ref(false);
  const formDrawerRef = ref(null);
  // 修改密码
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });
  const formRef = ref(null); //让formRef变成响应式的
  const rules = {
    oldpassword: [
      { required: true, message: "请输入旧密码", trigger: "blur" },
      { message: "旧密码不能为空", trigger: "blur" },
    ],
    password: [
      { required: true, message: "请输入新密码", trigger: "blur" },
      {
        message: "新密码",
        trigger: "blur",
      },
    ],
    repassword: [
      { required: true, message: "请再次输入新密码", trigger: "blur" },
      {
        message: "请确认两次新输入密码相同",
        trigger: "blur",
      },
    ],
  };
  //这里是为了设置按钮不能重复点击
  const onSubmit = () => {
    //验证表单form的校验是否通过
    formRef.value.validate((valid) => {
      // console.log(valid);
      if (!valid) {
        return false;
      }
      formDrawerRef.value.showLoading();
      updatePassword(form)
        .then((res) => {
          messageInfo("修改密码成功,请重新登录", "success");
          //清空缓存
          store.dispatch("logOut");
          //跳转回登录页面
          router.push("/login");
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };
  const openRePasswordForm = () => formDrawerRef.value.open();

  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm,
  };
}

export function useLogout() {
  const store = useStore();
  const router = useRouter();
  function handleLogOut() {
    messageConfirmationBox("请问是否退出登录", "消息提示")
      .then((res) => {
        // removeToken();
        //这个logOut（）执行的是axios
        logOut().finally(() => {
          store.dispatch("logOut");
          //跳转回登录页面
          router.push("/login");
          //提示退出登录
          messageInfo("您已退出登录", "success");
        });
      })
      .catch((err) => {});
  }

  return {
    handleLogOut,
    useLogout,
  };
}
