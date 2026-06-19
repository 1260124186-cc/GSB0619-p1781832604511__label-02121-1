import { ref } from 'vue'

// 全局 Toast 状态
const toastState = ref({ show: false, message: '', type: 'info' })
let toastTimer = null

export function useToast() {
  const showToast = (message, type = 'info') => {
    if (toastTimer) clearTimeout(toastTimer)
    toastState.value = { show: true, message, type }
    toastTimer = setTimeout(() => {
      toastState.value.show = false
    }, 2500)
  }

  const hideToast = () => {
    toastState.value.show = false
  }

  return {
    toastState,
    showToast,
    hideToast
  }
}
