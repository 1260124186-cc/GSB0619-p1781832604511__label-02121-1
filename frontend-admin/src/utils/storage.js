/**
 * 本地存储工具 - 数据持久化
 * 注意：shared/data.js 中的 STORAGE_KEYS 已包含 bookstore_ 前缀
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('bookstore_'))
      .forEach(k => localStorage.removeItem(k))
  }
}
