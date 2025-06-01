<template>
  <div class="login_container">
    <a-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="rules">
      <div class="form-header">
        <h1>Hello</h1>
        <h2>welcome to this world</h2>
      </div>
      <a-form-item field="val">
        <a-input v-model="loginForm.val" placeholder="请输入用户名" size="large">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="pwd">
        <a-input-password v-model="loginForm.pwd" placeholder="请输入密码" size="large">
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" long html-type="submit" :loading="loading" :disabled="loading" size="large"
          @click="handleLogin">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconUser, IconLock } from '@arco-design/web-vue/es/icon'
import { useUserStore } from "@/stores/user_store";
import { theme } from '@/components/common/fc_theme';
console.log(theme.value)
const userStore = useUserStore()
const $route = useRoute()
const $router = useRouter()
const loginFormRef = ref()
const loginForm = reactive({
  val: '古月方源03',
  pwd: '123',
})
let isLogin = userStore.isLogin
if (isLogin) {
  $router.push({ name: 'home' })
}
const loading = ref(false)
const rules = {
  val: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
    {
      validator: (value: string, callback: (error?: string) => void) => {
        if (value && value.length > 7) {
          callback('用户名为1到7位');
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  pwd: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      validator: (value: string, callback: (error?: string) => void) => {
        if (value && value.length > 15) {
          callback('密码为1到15位');
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
}
// 处理登录事件
const handleLogin = async () => {
  loginFormRef.value.validate().then(() => {
    // 表单验证通过
    loading.value = true;
    userStore.adminLogin(loginForm).finally(() => {
      loading.value = false;
      const redirect = $route.query.redirect;
      if (redirect) {
        $router.push({ path: redirect as string });
        return
      }
      $router.push({ name: 'home' });
    })
  })
}
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/background.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .login_form {
    position: absolute;
    left: 60%;
    width: 450px;
    min-height: 450px;
    max-width: 90%;
    background: url('../../assets/images/login_form.png') no-repeat center center;
    background-size: cover;
    padding: 50px 40px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: center;

    .form-header {
      margin-bottom: 40px;
    }

    h1 {
      font-size: 42px;
      font-weight: 600;
      color: white;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }

    h2 {
      font-size: 18px;
      color: white;
      margin: 0;
      opacity: 0.9;
      letter-spacing: 0.3px;
      font-weight: 300;
    }

    :deep(.arco-form-item) {
      padding-bottom: 24px;
    }

    :deep(.arco-input-wrapper) {
      padding: 0 15px;
      border-radius: 8px;
      height: 50px;

      .arco-input {
        font-size: 16px;
      }

      .arco-icon {
        font-size: 18px;
        margin-right: 10px;
      }
    }

    :deep(.arco-btn) {
      height: 50px;
      font-size: 18px;
      font-weight: 500;
      border-radius: 8px;
      margin-top: 10px;
      letter-spacing: 2px;
    }
  }
}
</style>@/stores/user_store