/**
 * 全局错误处理
 */
import { ref } from 'vue'
import { logger } from './logger'

export const globalError = ref(null)

export const useError = () => {
  const setError = (message, module = 'APP') => {
    globalError.value = { message, time: Date.now() }
    logger.error(module, message)
    setTimeout(() => globalError.value = null, 5000)
  }
  const clearError = () => { globalError.value = null }
  return { error: globalError, setError, clearError }
}

export const setupErrorHandler = (app) => {
  app.config.errorHandler = (err, vm, info) => {
    logger.error('VUE', `${err.message} | ${info}`, { stack: err.stack })
    globalError.value = { message: err.message, time: Date.now() }
  }
  window.addEventListener('unhandledrejection', (e) => {
    logger.error('PROMISE', e.reason?.message || 'Unhandled rejection')
  })
}
