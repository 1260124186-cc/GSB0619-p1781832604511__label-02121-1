<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast-container">
        <div :class="['toast', type]">
          <span class="toast-icon">{{ icons[type] }}</span>
          <span class="toast-message">{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('success')

const icons = {
  success: '✓',
  error: '✕',
  cart: '🛒'
}

const show = (msg, t = 'success', duration = 2500) => {
  message.value = msg
  type.value = t
  visible.value = true
  setTimeout(() => { visible.value = false }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
}

.toast.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.toast.cart {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: white;
}

.toast-icon {
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.toast-enter-active {
  animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  animation: toastOut 0.3s ease-in forwards;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toastOut {
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}
</style>
