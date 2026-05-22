<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <el-card class="login-card" shadow="hover">
      <div class="login-header">
        <div class="hospital-icon">
          <el-icon size="60" color="#409eff"><OfficeBuilding /></el-icon>
        </div>
        <h1 class="title">门诊划价收费系统</h1>
        <p class="subtitle">智慧医疗 · 便捷服务</p>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入账号" 
            prefix-icon="User"
            size="large"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            prefix-icon="Lock"
            size="large"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            size="large"
            class="login-btn"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login'
import { ElMessage } from 'element-plus'
// 修正图标导入
import { OfficeBuilding, User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref()

const loginForm = ref({
  username: '',
  password: ''
})

const loginRules = ref({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  await loginFormRef.value.validate()
  const res = await login(loginForm.value)
  if (res.code === 200) {
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    ElMessage.success('登录成功')
    router.push('/')
  } else {
    ElMessage.error(res.message)
  }
}
</script>

<style scoped>
/* 全局背景 */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 医疗风格渐变背景 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 50%, #38bdf8 100%);
  z-index: -1;
}

/* 登录卡片 */
.login-card {
  width: 420px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

/* 头部区域 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.hospital-icon {
  margin-bottom: 15px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  letter-spacing: 1px;
}

/* 表单区域 */
.login-form {
  margin-bottom: 30px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #93c5fd;
}

.login-form :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

/* 底部版权 */
.login-footer {
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
}

.login-footer p {
  margin: 0;
}
</style>