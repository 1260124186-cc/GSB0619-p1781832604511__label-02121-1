<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>{{ isRegister ? '创建账号' : '欢迎回来' }}</h1>
        <p>{{ isRegister ? '注册以开启购物之旅' : '登录以继续购物之旅' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <input v-model="form.username" type="text" placeholder="请输入用户名" required />
          </div>
        </div>

        <div v-if="isRegister" class="form-group">
          <label>邮箱</label>
          <div class="input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input v-model="form.email" type="email" placeholder="请输入邮箱" required />
          </div>
        </div>

        <div class="form-group">
          <label>密码</label>
          <div class="input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input v-model="form.password" type="password" placeholder="请输入密码" required />
          </div>
        </div>

        <div v-if="isRegister" class="form-group">
          <label>确认密码</label>
          <div class="input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" required />
          </div>
        </div>

        <p v-if="message" :class="['msg', messageType]">{{ message }}</p>

        <button type="submit" class="btn btn-primary login-btn">
          {{ isRegister ? '注册' : '登录' }}
        </button>
      </form>

      <div class="login-footer">
        <p class="switch-mode">
          {{ isRegister ? '已有账号？' : '没有账号？' }}
          <a href="#" @click.prevent="toggleMode">{{ isRegister ? '立即登录' : '立即注册' }}</a>
        </p>
        <p v-if="!isRegister" class="hint">测试账号: user / 123456</p>
      </div>
    </div>

    <div class="login-visual">
      <div class="visual-content">
        <span class="big-icon">📚</span>
        <h2>发现阅读的乐趣</h2>
        <p>海量图书，等你探索</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isRegister = ref(false)
const message = ref('')
const messageType = ref('error')
const form = reactive({ username: '', email: '', password: '', confirmPassword: '' })

const toggleMode = () => {
  isRegister.value = !isRegister.value
  message.value = ''
  Object.assign(form, { username: '', email: '', password: '', confirmPassword: '' })
}

const handleSubmit = () => {
  message.value = ''
  
  if (isRegister.value) {
    // 注册
    if (form.password !== form.confirmPassword) {
      message.value = '两次输入的密码不一致'
      messageType.value = 'error'
      return
    }
    const result = userStore.register(form.username, form.password, form.email)
    message.value = result.message
    messageType.value = result.success ? 'success' : 'error'
    if (result.success) {
      setTimeout(() => {
        isRegister.value = false
        message.value = ''
      }, 1500)
    }
  } else {
    // 登录
    const result = userStore.login(form.username, form.password)
    if (result.success) {
      // 支持登录后重定向
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: calc(100vh - 200px);
  margin: -60px -40px;
}

.login-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 80px;
  background: white;
}

.login-header {
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 36px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.login-header p {
  color: #6c757d;
  font-size: 16px;
}

.login-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  border-color: #1a1a2e;
  background: white;
}

.input-wrapper svg {
  color: #6c757d;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 16px 0;
  font-size: 15px;
}

.input-wrapper input:focus {
  outline: none;
}

.msg {
  font-size: 14px;
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 8px;
}

.msg.error {
  color: #e94560;
  background: #fee2e2;
}

.msg.success {
  color: #059669;
  background: #d1fae5;
}

.login-btn {
  width: 100%;
  padding: 18px;
  font-size: 16px;
  margin-top: 8px;
}

.login-footer {
  margin-top: 32px;
}

.switch-mode {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 12px;
}

.switch-mode a {
  color: #e94560;
  font-weight: 600;
  text-decoration: none;
}

.switch-mode a:hover {
  text-decoration: underline;
}

.hint {
  color: #6c757d;
  font-size: 14px;
}

.login-visual {
  flex: 1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-content {
  text-align: center;
  color: white;
}

.big-icon {
  font-size: 120px;
  display: block;
  margin-bottom: 32px;
}

.visual-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.visual-content p {
  font-size: 18px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .login-visual { display: none; }
  .login-card { padding: 40px; }
}
</style>
