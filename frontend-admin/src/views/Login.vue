<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-brand">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        <h1>BookAdmin</h1>
        <p>智能书店管理系统</p>
        <div class="features">
          <div class="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            实时数据分析
          </div>
          <div class="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
            高效订单处理
          </div>
          <div class="feature">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            智能库存管理
          </div>
        </div>
      </div>
    </div>
    <div class="login-right">
      <div class="login-form-wrapper">
        <div class="login-header">
          <h2>欢迎回来</h2>
          <p>请登录您的管理员账号</p>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>用户名</label>
            <div class="input-box">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input v-model="form.username" type="text" placeholder="请输入用户名" />
            </div>
          </div>
          <div class="form-group">
            <label>密码</label>
            <div class="input-box">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input v-model="form.password" type="password" placeholder="请输入密码" />
            </div>
          </div>
          <button type="submit" class="login-btn">
            <span>登录系统</span>
            <span class="btn-arrow">→</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()
const form = reactive({ username: '', password: '' })

const handleLogin = () => {
  const result = adminStore.login(form.username, form.password)
  if (result.success) {
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } else {
    ElMessage.error(result.message || '用户名或密码错误')
  }
}
</script>

<style scoped>
.features { margin-top: 48px; display: flex; flex-direction: column; gap: 16px; }
.feature { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.7); font-size: 15px; }
.feature svg { flex-shrink: 0; }
.login-form-wrapper { width: 100%; max-width: 420px; }
.login-header { margin-bottom: 40px; }
.login-header h2 { font-size: 32px; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; letter-spacing: -1px; }
.login-header p { color: #6b7280; font-size: 15px; }
.form-group { margin-bottom: 24px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 10px; }
.input-box { display: flex; align-items: center; gap: 14px; background: white; border: 2px solid #e5e7eb; border-radius: 14px; padding: 0 18px; transition: all 0.3s; }
.input-box:focus-within { border-color: #7c3aed; box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1); }
.input-icon { width: 18px; height: 18px; color: #6b7280; flex-shrink: 0; }
.input-box input { flex: 1; border: none; background: transparent; padding: 18px 0; font-size: 15px; color: #1a1a2e; }
.input-box input:focus { outline: none; }
.input-box input::placeholder { color: #9ca3af; }
.login-btn { width: 100%; padding: 18px 24px; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3); }
.login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(124, 58, 237, 0.4); }
.btn-arrow { transition: transform 0.3s; }
.login-btn:hover .btn-arrow { transform: translateX(4px); }
</style>
