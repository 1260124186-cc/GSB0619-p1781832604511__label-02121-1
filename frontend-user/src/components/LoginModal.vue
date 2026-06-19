<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <button class="modal-close" @click="close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="modal-header">
            <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <h2>{{ isRegister ? '创建账号' : '欢迎回来' }}</h2>
            <p>{{ isRegister ? '注册以开启购物之旅' : '登录以继续购物' }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="form-group">
              <label>用户名</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input v-model="form.username" type="text" placeholder="请输入用户名" required />
              </div>
            </div>

            <div v-if="isRegister" class="form-group">
              <label>邮箱</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input v-model="form.email" type="email" placeholder="请输入邮箱" required />
              </div>
            </div>

            <div class="form-group">
              <label>密码</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input v-model="form.password" type="password" placeholder="请输入密码" required />
              </div>
            </div>

            <div v-if="isRegister" class="form-group">
              <label>确认密码</label>
              <div class="input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" required />
              </div>
            </div>

            <p v-if="message" :class="['msg', messageType]">{{ message }}</p>

            <button type="submit" class="submit-btn">
              {{ isRegister ? '注册' : '登录' }}
            </button>
          </form>

          <div class="modal-footer">
            <p class="switch-mode">
              {{ isRegister ? '已有账号？' : '没有账号？' }}
              <a href="#" @click.prevent="toggleMode">{{ isRegister ? '立即登录' : '立即注册' }}</a>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useUserStore } from '../stores/user'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'login-success'])

const userStore = useUserStore()

const isRegister = ref(false)
const message = ref('')
const messageType = ref('error')
const form = reactive({ username: '', email: '', password: '', confirmPassword: '' })

watch(() => props.visible, (val) => {
  if (val) {
    resetForm()
  }
})

const resetForm = () => {
  isRegister.value = false
  message.value = ''
  Object.assign(form, { username: '', email: '', password: '', confirmPassword: '' })
}

const close = () => {
  emit('update:visible', false)
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
  message.value = ''
  Object.assign(form, { username: '', email: '', password: '', confirmPassword: '' })
}

const handleSubmit = () => {
  message.value = ''
  
  if (isRegister.value) {
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
    const result = userStore.login(form.username, form.password)
    if (result.success) {
      emit('login-success')
      close()
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  position: relative;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: #6c757d;
}

.modal-close:hover {
  background: #e94560;
  color: white;
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.modal-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: #1a1a2e;
}

.modal-header h2 {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.modal-header p {
  color: #6c757d;
  font-size: 14px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
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
  flex-shrink: 0;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 14px 0;
  font-size: 15px;
  width: 100%;
}

.input-wrapper input:focus {
  outline: none;
}

.msg {
  font-size: 13px;
  padding: 12px 16px;
  border-radius: 10px;
  margin: 0;
}

.msg.error {
  color: #e94560;
  background: #fee2e2;
}

.msg.success {
  color: #059669;
  background: #d1fae5;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(26, 26, 46, 0.3);
}

.modal-footer {
  margin-top: 24px;
  text-align: center;
}

.switch-mode {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 8px;
}

.switch-mode a {
  color: #e94560;
  font-weight: 600;
  text-decoration: none;
}

.switch-mode a:hover {
  text-decoration: underline;
}


.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}
</style>
