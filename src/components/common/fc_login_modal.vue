<template>
    <Modal :visible="props.visible" @cancel="handleCancel" width="380px" :footer="false"
        :mask-style="{ backdropFilter: 'blur(12px)' }"
        :class="['custom-login-modal', isDarkMode ? 'theme-dark' : 'theme-light']">
        <div class="modal-close-wrapper">
            <div class="modal-close" @click="handleCancel">
                <IconClose />
            </div>
        </div>

        <div class="login-container">
            <div class="logo-container">
                <img src="https://img.alicdn.com/imgextra/i1/3454600313/O1CN01jnDVUh1EBOk1V7FKD_!!3454600313.png"
                    alt="Logo" class="logo-image" />
            </div>

            <!-- 登录状态 -->
            <template v-if="type === 1">
                <div class="login-header">
                    <div class="login-title">登录</div>
                    <div class="login-subtitle">没有账号？ <a href="#" class="register-link"
                            @click.prevent="switchToRegister">立即注册 ></a></div>
                </div>

                <div class="login-form">
                    <Form :model="loginForm" :rules="loginRules" layout="vertical" @submit="handleLogin"
                        ref="loginFormRef">
                        <FormItem field="username" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': usernameHover }"
                                @mouseenter="handleInputHover('username')" @mouseleave="handleInputLeave('username')">
                                <Input v-model="loginForm.username" placeholder="请输入用户名或邮箱" allow-clear>
                                <template #prefix>
                                    <IconUser />
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.username + '%' }"></div>
                            </div>
                        </FormItem>

                        <FormItem field="password" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': passwordHover }"
                                @mouseenter="handleInputHover('password')" @mouseleave="handleInputLeave('password')">
                                <Input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="请输入密码" allow-clear>
                                <template #prefix>
                                    <IconLock />
                                </template>
                                <template #suffix>
                                    <span class="password-icon" @click="togglePasswordVisibility">
                                        <IconEye v-if="showPassword" />
                                        <IconEyeInvisible v-else />
                                    </span>
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.password + '%' }"></div>
                            </div>
                        </FormItem>

                        <FormItem field="captchaCode" hide-label class="captcha-wrapper">
                            <div class="custom-input-wrapper" :class="{ 'input-focus': captchaHover }"
                                @mouseenter="handleInputHover('captcha')" @mouseleave="handleInputLeave('captcha')">
                                <Input v-model="loginForm.captchaCode" placeholder="请输入验证码" allow-clear>
                                <template #prefix>
                                    <span class="captcha-icon">
                                        <i class="iconfont icon-yanzhengma"></i>
                                    </span>
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.captcha + '%' }"></div>
                            </div>
                            <img :src="captchaImage" alt="验证码" class="captcha-image" @click="reloadCaptcha" />
                        </FormItem>

                        <div class="login-options">
                            <Checkbox v-model="rememberMe" class="remember-login">记住登录</Checkbox>
                            <a href="#" class="forgot-password" @click.prevent="switchToForgotPassword">找回密码</a>
                        </div>

                        <div class="login-button-wrapper">
                            <Button class="login-button" type="primary" html-type="submit" long>
                                <IconImport />
                                <span>登录</span>
                            </Button>
                        </div>

                        <div class="social-login">
                            <div class="divider">
                                <span class="divider-text">社交账号登录</span>
                            </div>
                            <div class="social-icons">
                                <div class="social-icon qq" @mouseenter="handleSocialHover($event)"
                                    @mouseleave="handleSocialLeave($event)">
                                    <IconQq />
                                </div>
                                <div class="social-icon wechat" @mouseenter="handleSocialHover($event)"
                                    @mouseleave="handleSocialLeave($event)">
                                    <IconWechat />
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </template>

            <!-- 注册第一步 -->
            <template v-else-if="type === 2">
                <div class="login-header">
                    <div class="login-title">注册</div>
                    <div class="login-subtitle">已有账号？ <a href="#" class="register-link"
                            @click.prevent="switchToLogin">立即登录 ></a></div>
                </div>

                <div class="login-form">
                    <Form :model="registerStep1Form" :rules="registerStep1Rules" layout="vertical"
                        @submit="handleRegisterStep1" ref="registerStep1FormRef">
                        <FormItem field="email" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': emailHover }"
                                @mouseenter="handleInputHover('email')" @mouseleave="handleInputLeave('email')">
                                <Input v-model="registerStep1Form.email" placeholder="请输入邮箱" allow-clear>
                                <template #prefix>
                                    <IconEmail />
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.email + '%' }"></div>
                            </div>
                        </FormItem>

                        <FormItem field="captchaCode" hide-label class="captcha-wrapper">
                            <div class="custom-input-wrapper" :class="{ 'input-focus': captchaHover }"
                                @mouseenter="handleInputHover('captcha')" @mouseleave="handleInputLeave('captcha')">
                                <Input v-model="registerStep1Form.captchaCode" placeholder="请输入验证码" allow-clear>
                                <template #prefix>
                                    <span class="captcha-icon">
                                        <i class="iconfont icon-yanzhengma"></i>
                                    </span>
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.captcha + '%' }"></div>
                            </div>
                            <img :src="captchaImage" alt="验证码" class="captcha-image" @click="reloadCaptcha" />
                        </FormItem>

                        <div class="login-button-wrapper">
                            <Button class="login-button" type="primary" html-type="submit" long :loading="sending">
                                <span>发送验证邮件</span>
                            </Button>
                        </div>
                    </Form>
                </div>
            </template>

            <!-- 注册第二步 -->
            <template v-else-if="type === 3">
                <div class="login-header">
                    <div class="login-title">完成注册</div>
                    <div class="login-subtitle">邮件已发送至 {{ registerStep1Form.email }}</div>
                </div>

                <div class="login-form">
                    <Form :model="registerStep2Form" :rules="registerStep2Rules" layout="vertical"
                        @submit="handleRegisterStep2" ref="registerStep2FormRef">
                        <FormItem field="emailCode" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': emailCodeHover }"
                                @mouseenter="handleInputHover('emailCode')" @mouseleave="handleInputLeave('emailCode')">
                                <Input v-model="registerStep2Form.emailCode" placeholder="请输入邮箱验证码" allow-clear>
                                <template #prefix>
                                    <IconEmail />
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.emailCode + '%' }"></div>
                            </div>
                        </FormItem>

                        <FormItem field="username" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': usernameHover }"
                                @mouseenter="handleInputHover('username')" @mouseleave="handleInputLeave('username')">
                                <Input v-model="registerStep2Form.username" placeholder="请输入用户名" allow-clear>
                                <template #prefix>
                                    <IconUser />
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.username + '%' }"></div>
                            </div>
                        </FormItem>

                        <FormItem field="password" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': passwordHover }"
                                @mouseenter="handleInputHover('password')" @mouseleave="handleInputLeave('password')">
                                <Input v-model="registerStep2Form.password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="请输入密码" allow-clear>
                                <template #prefix>
                                    <IconLock />
                                </template>
                                <template #suffix>
                                    <span class="password-icon" @click="togglePasswordVisibility">
                                        <IconEye v-if="showPassword" />
                                        <IconEyeInvisible v-else />
                                    </span>
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.password + '%' }"></div>
                            </div>
                        </FormItem>

                        <div class="login-button-wrapper">
                            <Button class="login-button" type="primary" html-type="submit" long :loading="registering">
                                <span>完成注册</span>
                            </Button>
                            <Button class="back-button" @click="switchToRegister" long style="margin-top: 10px">
                                <span>返回上一步</span>
                            </Button>
                        </div>
                    </Form>
                </div>
            </template>

            <!-- 忘记密码第一步 -->
            <template v-else-if="type === 4">
                <div class="login-header">
                    <div class="login-title">找回密码</div>
                    <div class="login-subtitle">记起密码了？ <a href="#" class="register-link"
                            @click.prevent="switchToLogin">立即登录 ></a></div>
                </div>

                <div class="login-form">
                    <Form :model="forgotPwdStep1Form" :rules="forgotPwdStep1Rules" layout="vertical"
                        @submit="handleForgotPwdStep1" ref="forgotPwdStep1FormRef">
                        <FormItem field="email" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': emailHover }"
                                @mouseenter="handleInputHover('email')" @mouseleave="handleInputLeave('email')">
                                <Input v-model="forgotPwdStep1Form.email" placeholder="请输入邮箱" allow-clear>
                                <template #prefix>
                                    <IconEmail />
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.email + '%' }"></div>
                            </div>
                        </FormItem>

                        <FormItem field="captchaCode" hide-label class="captcha-wrapper">
                            <div class="custom-input-wrapper" :class="{ 'input-focus': captchaHover }"
                                @mouseenter="handleInputHover('captcha')" @mouseleave="handleInputLeave('captcha')">
                                <Input v-model="forgotPwdStep1Form.captchaCode" placeholder="请输入验证码" allow-clear>
                                <template #prefix>
                                    <span class="captcha-icon">
                                        <i class="iconfont icon-yanzhengma"></i>
                                    </span>
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.captcha + '%' }"></div>
                            </div>
                            <img :src="captchaImage" alt="验证码" class="captcha-image" @click="reloadCaptcha" />
                        </FormItem>

                        <div class="login-button-wrapper">
                            <Button class="login-button" type="primary" html-type="submit" long :loading="sending">
                                <span>发送验证邮件</span>
                            </Button>
                        </div>
                    </Form>
                </div>
            </template>

            <!-- 忘记密码第二步 -->
            <template v-else-if="type === 5">
                <div class="login-header">
                    <div class="login-title">重置密码</div>
                    <div class="login-subtitle">邮件已发送至 {{ forgotPwdStep1Form.email }}</div>
                </div>

                <div class="login-form">
                    <Form :model="forgotPwdStep2Form" :rules="forgotPwdStep2Rules" layout="vertical"
                        @submit="handleForgotPwdStep2" ref="forgotPwdStep2FormRef">
                        <FormItem field="emailCode" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': emailCodeHover }"
                                @mouseenter="handleInputHover('emailCode')" @mouseleave="handleInputLeave('emailCode')">
                                <Input v-model="forgotPwdStep2Form.emailCode" placeholder="请输入邮箱验证码" allow-clear>
                                <template #prefix>
                                    <IconEmail />
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.emailCode + '%' }"></div>
                            </div>
                        </FormItem>

                        <FormItem field="password" hide-label>
                            <div class="custom-input-wrapper" :class="{ 'input-focus': passwordHover }"
                                @mouseenter="handleInputHover('password')" @mouseleave="handleInputLeave('password')">
                                <Input v-model="forgotPwdStep2Form.password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="请输入新密码" allow-clear>
                                <template #prefix>
                                    <IconLock />
                                </template>
                                <template #suffix>
                                    <span class="password-icon" @click="togglePasswordVisibility">
                                        <IconEye v-if="showPassword" />
                                        <IconEyeInvisible v-else />
                                    </span>
                                </template>
                                </Input>
                                <div class="input-progress-bar" :style="{ width: progressWidth.password + '%' }"></div>
                            </div>
                        </FormItem>

                        <div class="login-button-wrapper">
                            <Button class="login-button" type="primary" html-type="submit" long :loading="resetting">
                                <span>重置密码</span>
                            </Button>
                            <Button class="back-button" @click="switchToForgotPassword" long style="margin-top: 10px">
                                <span>返回上一步</span>
                            </Button>
                        </div>
                    </Form>
                </div>
            </template>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { Modal, Form, FormItem, Input, Button, Checkbox, Message } from '@arco-design/web-vue';
import {
    IconUser,
    IconLock,
    IconEye,
    IconEyeInvisible,
    IconImport,
    IconQq,
    IconWechat,
    IconClose,
    IconEmail
} from '@arco-design/web-vue/es/icon';
import { theme } from './fc_theme';
import { useUserStore } from '@/stores/user_store';
import { captchaApi, sendEmailApi, mailRegisterApi, userResetPwdApi, type UserEmailBindReqType } from '@/api/user_api';

// 1登录 // 2注册的第一步 // 3注册的第二步 // 4忘记密码的第一步 // 5忘记密码的第二步 
const type = ref<1 | 2 | 3 | 4 | 5>(1);
const isDarkMode = computed(() => theme.value === 'dark');
const store = useUserStore();
const sending = ref(false);
const registering = ref(false);
const resetting = ref(false);

interface Props {
    visible: boolean | undefined;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:visible', 'destroy']);

// 登录表单
const loginFormRef = ref();
const loginForm = reactive({
    username: '',
    password: '',
    captchaID: '',
    captchaCode: ''
});

// 注册第一步表单
const registerStep1FormRef = ref();
const registerStep1Form = reactive({
    email: '',
    captchaID: '',
    captchaCode: ''
});

// 注册第二步表单
const registerStep2FormRef = ref();
const registerStep2Form = reactive({
    username: '',
    password: '',
    emailCode: '',
    emailID: '' // 存储第一步返回的 emailID
});

// 忘记密码第一步表单
const forgotPwdStep1FormRef = ref();
const forgotPwdStep1Form = reactive({
    email: '',
    captchaID: '',
    captchaCode: ''
});

// 忘记密码第二步表单
const forgotPwdStep2FormRef = ref();
const forgotPwdStep2Form = reactive({
    password: '',
    emailCode: '',
    emailID: '' // 存储第一步返回的 emailID
});

// 验证码图片URL
const captchaImage = ref("");


// 加载验证码
const captchaRes = async () => {
    try {
        const res = await captchaApi();
        loginForm.captchaID = res.data.captchaID;
        registerStep1Form.captchaID = res.data.captchaID;
        forgotPwdStep1Form.captchaID = res.data.captchaID;
        captchaImage.value = res.data.captchaB64;
    } catch (error) {
        console.error(error);
        // 如果API调用失败，可以设置一个占位图像
        captchaImage.value = "https://via.placeholder.com/120x40?text=验证码";
    }
}

// 重新加载验证码
const reloadCaptcha = () => {
    captchaRes();
}

// 组件挂载时加载验证码
onMounted(() => {
    captchaRes();
});

// 处理登录
const handleLogin = async () => {
    try {
        const res = await loginFormRef.value.validate();
        if (res) return;
        let params = {
            val: loginForm.username,
            pwd: loginForm.password,
            captchaID: loginForm.captchaID,
            captchaCode: loginForm.captchaCode
        };
        await store.login(params);
        handleCancel();
    } catch (error) {
        reloadCaptcha();
        console.error(error);
    }
}

// 处理注册第一步 - 发送验证邮件
const handleRegisterStep1 = async () => {
    try {
        const res = await registerStep1FormRef.value.validate();
        if (res) return;

        sending.value = true;
        const params = {
            email: registerStep1Form.email,
            captchaID: registerStep1Form.captchaID,
            captchaCode: registerStep1Form.captchaCode,
            type: 1
        };

        const response = await sendEmailApi(params);
        registerStep2Form.emailID = response.data.emailID;

        // 切换到注册第二步
        type.value = 3;
        Message.success('验证邮件已发送，请查收');
    } catch (error) {
        console.error(error);
        reloadCaptcha();
    } finally {
        sending.value = false;
    }
}

// 处理注册第二步 - 完成注册
const handleRegisterStep2 = async () => {
    try {
        const res = await registerStep2FormRef.value.validate();
        if (res) return;

        registering.value = true;
        const params = {
            username: registerStep2Form.username,
            pwd: registerStep2Form.password,
            captchaID: registerStep2Form.emailID,
            captchaCode: registerStep2Form.emailCode
        };

        await mailRegisterApi(params);
        Message.success('注册成功！');

        // 重置并回到登录状态
        switchToLogin();
    } catch (error) {
        console.error(error);
        Message.error('注册失败，请检查信息是否正确');
    } finally {
        registering.value = false;
    }
}

// 处理忘记密码第一步 - 发送验证邮件
const handleForgotPwdStep1 = async () => {
    try {
        const res = await forgotPwdStep1FormRef.value.validate();
        if (res) return;

        sending.value = true;
        const params = {
            email: forgotPwdStep1Form.email,
            captchaID: forgotPwdStep1Form.captchaID,
            captchaCode: forgotPwdStep1Form.captchaCode,
            type: 2 // 重置密码类型
        };

        const response = await sendEmailApi(params);
        forgotPwdStep2Form.emailID = response.data.emailID;

        // 切换到忘记密码第二步
        type.value = 5;
        Message.success('验证邮件已发送，请查收');
    } catch (error) {
        console.error(error);
        reloadCaptcha();
        Message.error('发送失败，请检查邮箱和验证码是否正确');
    } finally {
        sending.value = false;
    }
}

// 处理忘记密码第二步 - 重置密码
const handleForgotPwdStep2 = async () => {
    try {
        const res = await forgotPwdStep2FormRef.value.validate();
        if (res) return;

        resetting.value = true;
        const params = {
            pwd: forgotPwdStep2Form.password,
            captchaID: forgotPwdStep2Form.emailID,
            captchaCode: forgotPwdStep2Form.emailCode
        };

        const resp = await userResetPwdApi(params);
        Message.success(resp.msg);

        // 重置并回到登录状态
        switchToLogin();
    } catch (error) {
        console.error(error);
        Message.error('重置失败，请检查验证码是否正确');
    } finally {
        resetting.value = false;
    }
}

// 切换到登录状态
const switchToLogin = () => {
    type.value = 1;
    resetAllForms();
    reloadCaptcha();
}

// 切换到注册状态
const switchToRegister = () => {
    type.value = 2;
    resetAllForms();
    reloadCaptcha();
}

// 切换到忘记密码状态
const switchToForgotPassword = () => {
    type.value = 4;
    resetAllForms();
    reloadCaptcha();
}

const handleCancel = () => {
    resetAllForms("handleCancel");
    emits('update:visible', false);
};

// 重置所有表单
const resetAllForms = (t?: string) => {
    if (t === "handleCancel") {
        type.value = 1;
    }
    if (loginFormRef.value) {
        loginFormRef.value.resetFields();
    }
    if (registerStep1FormRef.value) {
        registerStep1FormRef.value.resetFields();
    }
    if (registerStep2FormRef.value) {
        registerStep2FormRef.value.resetFields();
    }
    if (forgotPwdStep1FormRef.value) {
        forgotPwdStep1FormRef.value.resetFields();
    }
    if (forgotPwdStep2FormRef.value) {
        forgotPwdStep2FormRef.value.resetFields();
    }
    rememberMe.value = false;
}

// 登录表单验证规则
const loginRules = {
    username: [
        {
            required: true,
            message: '请输入用户名或邮箱',
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
    ],
    captchaCode: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
        },
        {
            minLength: 4,
            message: '验证码长度不能少于4位',
            trigger: 'blur',
        },
    ]
};

// 注册第一步表单验证规则
const registerStep1Rules = {
    email: [
        {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
        },
        {
            type: 'email',
            message: '请输入有效的邮箱地址',
            trigger: 'blur',
        },
    ],
    captchaCode: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
        },
        {
            minLength: 4,
            message: '验证码长度不能少于4位',
            trigger: 'blur',
        },
    ]
};

// 注册第二步表单验证规则
const registerStep2Rules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
        {
            minLength: 4,
            message: '用户名长度不能少于4个字符',
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
        {
            minLength: 6,
            message: '密码长度不能少于6位',
            trigger: 'blur',
        },
    ],
    emailCode: [
        {
            required: true,
            message: '请输入邮箱验证码',
            trigger: 'blur',
        },
    ]
};

// 忘记密码第一步表单验证规则
const forgotPwdStep1Rules = {
    email: [
        {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
        },
        {
            type: 'email',
            message: '请输入有效的邮箱地址',
            trigger: 'blur',
        },
    ],
    captchaCode: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
        },
        {
            minLength: 4,
            message: '验证码长度不能少于4位',
            trigger: 'blur',
        },
    ]
};

// 忘记密码第二步表单验证规则
const forgotPwdStep2Rules = {
    password: [
        {
            required: true,
            message: '请输入新密码',
            trigger: 'blur',
        },
        {
            minLength: 6,
            message: '密码长度不能少于6位',
            trigger: 'blur',
        },
    ],
    emailCode: [
        {
            required: true,
            message: '请输入邮箱验证码',
            trigger: 'blur',
        },
    ]
};

const rememberMe = ref(false);
const showPassword = ref(false);

// 输入框交互状态
const usernameHover = ref(false);
const passwordHover = ref(false);
const captchaHover = ref(false);
const emailHover = ref(false);
const emailCodeHover = ref(false);

const progressWidth = reactive({
    username: 0,
    password: 0,
    captcha: 0,
    email: 0,
    emailCode: 0
});

const animationIntervals = reactive({
    username: null as null | number,
    password: null as null | number,
    captcha: null as null | number,
    email: null as null | number,
    emailCode: null as null | number
});

/**
 * 处理输入框的鼠标悬停事件
 * @param {string} field - 输入框字段名称
 */
const handleInputHover = (field: 'username' | 'password' | 'captcha' | 'email' | 'emailCode') => {
    // 设置输入框的悬停状态
    if (field === 'username') {
        usernameHover.value = true;
    } else if (field === 'password') {
        passwordHover.value = true;
    } else if (field === 'captcha') {
        captchaHover.value = true;
    } else if (field === 'email') {
        emailHover.value = true;
    } else if (field === 'emailCode') {
        emailCodeHover.value = true;
    }
    // 清除可能存在的动画定时器，避免多个动画同时运行
    if (animationIntervals[field]) {
        clearInterval(animationIntervals[field] as number);
    }

    // 重置进度条宽度
    progressWidth[field] = 0;

    // 创建动画定时器，实现平滑增长效果
    animationIntervals[field] = setInterval(() => {
        if (progressWidth[field] < 100) {
            progressWidth[field] += 1.5;
        } else {
            // 当进度到达 100% 时，清除定时器
            clearInterval(animationIntervals[field] as number);
            animationIntervals[field] = null;
        }
    }, 16) as unknown as number;
};

/**
 * 处理输入框的鼠标离开事件
 * @param {string} field - 输入框字段名称
 */
const handleInputLeave = (field: 'username' | 'password' | 'captcha' | 'email' | 'emailCode') => {
    // 设置输入框的悬停状态为 false
    if (field === 'username') {
        usernameHover.value = false;
    } else if (field === 'password') {
        passwordHover.value = false;
    } else if (field === 'captcha') {
        captchaHover.value = false;
    } else if (field === 'email') {
        emailHover.value = false;
    } else if (field === 'emailCode') {
        emailCodeHover.value = false;
    }

    // 清除增长动画定时器
    if (animationIntervals[field]) {
        clearInterval(animationIntervals[field] as number);
        animationIntervals[field] = null;
    }

    // 创建消退动画定时器，比增长动画更快地减少宽度
    const resetInterval = setInterval(() => {
        if (progressWidth[field] > 0) {
            progressWidth[field] -= 3;
        } else {
            // 确保宽度为 0 并清除定时器
            progressWidth[field] = 0;
            clearInterval(resetInterval);
        }
    }, 16);
};

// 清理所有可能的动画定时器
onUnmounted(() => {
    Object.keys(animationIntervals).forEach(key => {
        const field = key as keyof typeof animationIntervals;
        if (animationIntervals[field]) {
            clearInterval(animationIntervals[field] as number);
        }
    });
});

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const handleSocialHover = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'translateY(-3px)';
    target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
};

const handleSocialLeave = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = 'none';
};
</script>


<style lang="less">
.custom-login-modal .arco-modal-header {
    display: none;
}

.arco-modal-body {
    padding: 0 !important;
}

.custom-login-modal .arco-modal {
    overflow: hidden;
    border-radius: 6px;
    border: none;
    background-color: transparent;
    box-shadow: none;
}

.theme-dark {
    .modal-close-wrapper {
        background: linear-gradient(to right, #0f1723, #1c2330);
        border-bottom: 1px solid rgba(83, 92, 236, 0.2);
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
    }

    .modal-close {
        color: #7a85b9;
        transition: all 0.3s;

        &:hover {
            color: #c4f6ff;
            text-shadow: 0 0 8px rgba(196, 246, 255, 0.8);
            transform: rotate(90deg);
        }
    }

    .login-container {
        background: linear-gradient(135deg, #0a0e17 0%, #171e2e 100%);
        color: #fff;
        box-shadow: inset 0 0 80px rgba(44, 64, 116, 0.15);
    }

    .login-title {
        color: #fff;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(102, 153, 255, 0.4);

        &::after {
            background: linear-gradient(90deg, #3b7dff, #6366f1);
            height: 4px;
            width: 40px;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(102, 153, 255, 0.7);
        }
    }

    .login-subtitle {
        color: #8e9cc8;
    }

    .register-link {
        color: #4d9fff;
        position: relative;

        &:hover {
            color: #75b6ff;
            text-shadow: 0 0 8px rgba(77, 159, 255, 0.6);
        }

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -2px;
            left: 0;
            background: linear-gradient(90deg, #4d9fff, #75b6ff);
            transition: width 0.3s ease;
        }

        &:hover::after {
            width: 100%;
        }
    }

    .custom-input-wrapper {
        border-radius: 6px;
        background: linear-gradient(to right, #131821, #1a202e);
        border: 1px solid #2a3040;
        position: relative;
        transition: all 0.3s;
        overflow: hidden;
        width: 100%;

        &.input-focus {
            border-color: #4080ff;
            box-shadow: 0 0 20px rgba(64, 128, 255, 0.15);
        }

        .arco-input-wrapper {
            background: transparent;
            border: none;
            box-shadow: none;
        }

        .arco-input {
            background: transparent;
            color: #d0ddff;

            &::placeholder {
                color: #616b8a;
            }
        }

        .arco-input-prefix svg,
        .arco-input-suffix svg {
            color: #5671aa;
            transition: all 0.3s;
        }

        &.input-focus .arco-input-prefix svg,
        &.input-focus .arco-input-suffix svg {
            color: #6b9eff;
        }
    }

    .input-progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, #4080ff, #6d67ff);
        box-shadow: 0 0 10px rgba(64, 128, 255, 0.6);
        transition: width 0.05s linear;
    }

    .password-icon {
        color: #5671aa;
        cursor: pointer;

        &:hover {
            color: #6b9eff;
        }
    }

    .arco-checkbox-label {
        color: #8e9cc8;
    }

    .forgot-password {
        color: #8e9cc8;
        position: relative;

        &:hover {
            color: #4d9fff;
            text-shadow: 0 0 8px rgba(77, 159, 255, 0.4);
        }

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -2px;
            left: 0;
            background: linear-gradient(90deg, #4d9fff, #75b6ff);
            transition: width 0.3s ease;
        }

        &:hover::after {
            width: 100%;
        }
    }

    .login-button {
        background: linear-gradient(135deg, #3575ff, #4b4eee);
        border: none;
        height: 48px;
        border-radius: 6px;
        font-weight: 600;
        letter-spacing: 0.3px;
        box-shadow: 0 4px 20px rgba(59, 125, 255, 0.3);
        transition: all 0.3s;

        &:hover {
            background: linear-gradient(135deg, #458fff, #5c5ef7);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 125, 255, 0.4);
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(59, 125, 255, 0.3);
        }
    }

    .divider {
        color: #5d6a8e;

        &::before,
        &::after {
            background: linear-gradient(to right, rgba(56, 65, 97, 0), rgba(56, 65, 97, 1), rgba(56, 65, 97, 0));
        }
    }

    .social-icon {
        transition: all 0.4s ease;

        &.qq {
            background: linear-gradient(135deg, #10aef5, #0f89d0);
            box-shadow: 0 4px 10px rgba(16, 174, 245, 0.3);
        }

        &.wechat {
            background: linear-gradient(135deg, #0aad60, #07914f);
            box-shadow: 0 4px 10px rgba(7, 199, 97, 0.3);
        }
    }

    .arco-checkbox-icon {
        border-color: #384161;
    }

    .captcha-image {
        border: 1px solid #2a3040;
        background: #1a202e;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

        &:hover {
            border-color: #4080ff;
            box-shadow: 0 0 8px rgba(64, 128, 255, 0.3);
        }
    }
}

.theme-light {
    .modal-close-wrapper {
        background: linear-gradient(to right, #f1f5ff, #ffffff);
        border-bottom: 1px solid rgba(228, 234, 251, 1);
        box-shadow: 0 1px 8px rgba(228, 234, 251, 0.8);
    }

    .modal-close {
        color: #9aa3b8;
        transition: all 0.3s;

        &:hover {
            color: #1d2129;
            transform: rotate(90deg);
        }
    }

    .login-container {
        background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
        color: #1d2129;
        box-shadow: inset 0 0 80px rgba(228, 234, 251, 0.5);
    }

    .login-title {
        color: #1d2129;
        font-weight: 700;

        &::after {
            background: linear-gradient(90deg, #0e54dc, #3b7dff);
            height: 4px;
            width: 40px;
            border-radius: 4px;
        }
    }

    .login-subtitle {
        color: #7d8592;
    }

    .register-link {
        color: #165dff;
        position: relative;

        &:hover {
            color: #0e54dc;
        }

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -2px;
            left: 0;
            background: linear-gradient(90deg, #165dff, #0e54dc);
            transition: width 0.3s ease;
        }

        &:hover::after {
            width: 100%;
        }
    }

    .custom-input-wrapper {
        border-radius: 6px;
        background: linear-gradient(to right, #f8faff, #ffffff);
        border: 1px solid #e1e6ee;
        position: relative;
        transition: all 0.3s;
        overflow: hidden;
        width: 100%;

        &.input-focus {
            border-color: #165dff;
            box-shadow: 0 0 20px rgba(22, 93, 255, 0.08);
        }

        .arco-input-wrapper {
            background: transparent;
            border: none;
            box-shadow: none;
        }

        .arco-input {
            background: transparent;
            color: #1d2129;

            &::placeholder {
                color: #acb3bf;
            }
        }

        .arco-input-prefix svg,
        .arco-input-suffix svg {
            color: #9aa3b8;
            transition: all 0.3s;
        }

        &.input-focus .arco-input-prefix svg,
        &.input-focus .arco-input-suffix svg {
            color: #165dff;
        }
    }

    .input-progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, #165dff, #4080ff);
        transition: width 0.05s linear;
    }

    .password-icon {
        color: #9aa3b8;
        cursor: pointer;

        &:hover {
            color: #165dff;
        }
    }

    .arco-checkbox-label {
        color: #7d8592;
    }

    .forgot-password {
        color: #7d8592;
        position: relative;

        &:hover {
            color: #165dff;
        }

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -2px;
            left: 0;
            background: linear-gradient(90deg, #165dff, #4080ff);
            transition: width 0.3s ease;
        }

        &:hover::after {
            width: 100%;
        }
    }

    .login-button {
        background: linear-gradient(135deg, #0e54dc, #3b7dff);
        border: none;
        height: 48px;
        border-radius: 6px;
        font-weight: 600;
        letter-spacing: 0.3px;
        box-shadow: 0 4px 15px rgba(22, 93, 255, 0.15);
        transition: all 0.3s;

        &:hover {
            background: linear-gradient(135deg, #0e54dc, #4b8dff);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(22, 93, 255, 0.2);
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(22, 93, 255, 0.15);
        }
    }

    .divider {
        color: #acb3bf;

        &::before,
        &::after {
            background: linear-gradient(to right, rgba(228, 234, 251, 0), rgba(228, 234, 251, 1), rgba(228, 234, 251, 0));
        }
    }

    .social-icon {
        transition: all 0.4s ease;

        &.qq {
            background: linear-gradient(135deg, #10aef5, #0f89d0);
            box-shadow: 0 4px 10px rgba(16, 174, 245, 0.2);
        }

        &.wechat {
            background: linear-gradient(135deg, #0aad60, #07914f);
            box-shadow: 0 4px 10px rgba(7, 199, 97, 0.2);
        }
    }

    .captcha-image {
        border: 1px solid #e1e6ee;
        background: #f8faff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        &:hover {
            border-color: #165dff;
            box-shadow: 0 0 8px rgba(22, 93, 255, 0.2);
        }
    }
}

.modal-close-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    z-index: 100;
}

.modal-close {
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    display: flex;
    flex-direction: column;
    min-height: 600px;
    padding-top: 40px;
}

/* Logo */
.logo-container {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-image {
    max-width: 220px;
    height: auto;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-title {
    font-size: 22px;
    margin-bottom: 10px;
    position: relative;
    display: inline-block;
}

.login-title::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
}

.login-subtitle {
    font-size: 14px;
    margin-top: 18px;
}

.register-link {
    text-decoration: none;
    transition: color 0.3s;
}

.login-form {
    padding: 0 30px;
}

.arco-form-item {
    margin-bottom: 20px;
}

.password-icon {
    cursor: pointer;
}

.remember-login {
    user-select: none;
}

.login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.forgot-password {
    font-size: 14px;
    text-decoration: none;
    transition: color 0.3s;
}

.login-button-wrapper {
    margin-bottom: 15px;
}

.login-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 44px;
    border: none;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s;
}

.login-button svg {
    margin-right: 8px;
    font-size: 18px;
}

.social-login {
    margin-top: 30px;
}

.divider {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 24px;
}

.divider::before,
.divider::after {
    content: "";
    flex: 1;
    height: 1px;
}

.divider-text {
    padding: 0 15px;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 24px;
    transform: translateY(-30%);
}

.social-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.social-icon svg {
    font-size: 22px;
    color: white;
}

@media (max-width: 480px) {
    .login-form {
        padding: 0 20px;
    }
}

.arco-input-group {
    border: none;
    background-color: transparent;
}

.arco-form-item-content-inner {
    overflow: visible;
}

.arco-modal-container {
    border-radius: 6px !important;
    overflow: hidden;
}

.captcha-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;

    .custom-input-wrapper {
        flex: 1;
    }

    .captcha-image {
        height: 32px;
        min-width: 100px;
        max-width: 120px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
        margin-left: 10px;
    }
}

.captcha-icon {
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}

.captcha-icon i {
    font-size: 18px;
}
</style>