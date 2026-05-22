<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: #2f4050">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#2f4050"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/charge-settle">
          <el-icon><Ticket /></el-icon>
          <span>收费结算</span>
        </el-menu-item>
        <el-menu-item index="/refund-manage">
          <el-icon><ArrowLeft /></el-icon>
          <span>退费管理</span>
        </el-menu-item>
        <el-menu-item index="/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>统计查询</span>
        </el-menu-item>
        <el-menu-item index="/charge-item-manage">
          <el-icon><Setting /></el-icon>
          <span>收费项目管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header style="background-color: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center">
        <span style="font-size: 20px; font-weight: bold">门诊划价收费系统</span>
        <div>
          <span>欢迎您，{{ user.realName }}</span>
          <el-button link @click="handleLogout" style="margin-left: 20px">退出登录</el-button>
        </div>
      </el-header>
      
      <el-main style="background-color: #f5f5f5">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Ticket, ArrowLeft, DataAnalysis, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>