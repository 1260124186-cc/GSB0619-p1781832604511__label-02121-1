import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '../utils/storage'
import { logger } from '../utils/logger'
import { rules, validate } from '../utils/validator'
import { defaultBooks, defaultUsers, defaultCategories, defaultOrders, STORAGE_KEYS, generateBookCover } from '../shared/data'

export const useAdminStore = defineStore('admin', () => {
  const books = ref(storage.get(STORAGE_KEYS.BOOKS, defaultBooks))
  const orders = ref(storage.get(STORAGE_KEYS.ORDERS, defaultOrders))
  const users = ref(storage.get(STORAGE_KEYS.USERS, defaultUsers))
  const categories = ref(storage.get(STORAGE_KEYS.CATEGORIES, defaultCategories))
  const admin = ref(storage.get('admin', null))
  let bookIdCounter = storage.get('bookIdCounter', 13)

  // 持久化
  watch(books, (val) => storage.set(STORAGE_KEYS.BOOKS, val), { deep: true })
  watch(orders, (val) => storage.set(STORAGE_KEYS.ORDERS, val), { deep: true })
  watch(users, (val) => storage.set(STORAGE_KEYS.USERS, val), { deep: true })
  watch(categories, (val) => storage.set(STORAGE_KEYS.CATEGORIES, val), { deep: true })

  const login = (username, password) => {
    let error = validate(username, '用户名', [v => rules.required(v, '用户名')])
    if (error) return { success: false, message: error }
    error = validate(password, '密码', [v => rules.required(v, '密码')])
    if (error) return { success: false, message: error }

    // 从共享 localStorage 读取用户数据进行验证
    const allUsers = storage.get(STORAGE_KEYS.USERS, defaultUsers)
    const found = allUsers.find(u => u.username === username && u.password === password)
    
    if (found) {
      // 检查是否为管理员
      if (found.role !== 'admin') {
        logger.warn('AUTH', `非管理员尝试登录: ${username}`)
        return { success: false, message: '该账号无管理员权限' }
      }
      if (found.status === '禁用') {
        logger.warn('AUTH', `账号已禁用: ${username}`)
        return { success: false, message: '账号已被禁用' }
      }
      const adminData = { id: found.id, username: found.username, role: found.role }
      admin.value = adminData
      storage.set(STORAGE_KEYS.ADMIN_TOKEN, `admin-token-${found.id}-${Date.now()}`)
      logger.info('AUTH', '管理员登录成功')
      return { success: true }
    }
    logger.warn('AUTH', `管理员登录失败: ${username}`)
    return { success: false, message: '用户名或密码错误' }
  }

  const logout = () => {
    logger.info('AUTH', '管理员登出')
    admin.value = null
    storage.remove(STORAGE_KEYS.ADMIN_TOKEN)
  }

  const addBook = (book) => {
    let error = validate(book.title, '书名', [v => rules.required(v, '书名'), v => rules.maxLength(v, '书名', 100)])
    if (error) return { success: false, message: error }
    error = validate(book.author, '作者', [v => rules.required(v, '作者')])
    if (error) return { success: false, message: error }
    error = validate(book.price, '价格', [v => rules.required(v, '价格'), v => rules.number(v, '价格'), v => rules.min(v, '价格', 0)])
    if (error) return { success: false, message: error }

    const categoryColors = {
      '技术': '#3776ab', '科幻': '#0a0a23', '文学': '#8b0000',
      '历史': '#8b6914', '经济': '#2e8b57', '艺术': '#9932cc'
    }
    const newBook = { 
      id: bookIdCounter++, 
      ...book, 
      cover: book.cover || generateBookCover(book.title.replace(/\s+/g, ''), book.author, categoryColors[book.category] || '#1a1a2e'),
      status: '上架' 
    }
    books.value.push(newBook)
    storage.set('bookIdCounter', bookIdCounter)
    logger.info('BOOKS', `添加图书: ${newBook.title}`)
    return { success: true, data: newBook }
  }

  const updateBook = (id, data) => {
    const index = books.value.findIndex(b => b.id === id)
    if (index > -1) {
      books.value[index] = { ...books.value[index], ...data }
      logger.info('BOOKS', `更新图书 #${id}`, data)
      return { success: true, data: books.value[index] }
    }
    return { success: false, message: '图书不存在' }
  }

  const deleteBook = (id) => {
    const book = books.value.find(b => b.id === id)
    books.value = books.value.filter(b => b.id !== id)
    logger.info('BOOKS', `删除图书: ${book?.title}`)
    return { success: true }
  }

  const updateOrderStatus = (id, status) => {
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = status
      logger.info('ORDERS', `更新订单状态 #${id}: ${status}`)
      return { success: true }
    }
    return { success: false, message: '订单不存在' }
  }

  // 分类管理
  const addCategory = (name) => {
    if (!name || !name.trim()) return { success: false, message: '分类名称不能为空' }
    const trimmed = name.trim()
    if (categories.value.includes(trimmed)) return { success: false, message: '分类已存在' }
    categories.value.push(trimmed)
    logger.info('CATEGORIES', `添加分类: ${trimmed}`)
    return { success: true }
  }

  const deleteCategory = (name) => {
    const index = categories.value.indexOf(name)
    if (index > -1) {
      categories.value.splice(index, 1)
      logger.info('CATEGORIES', `删除分类: ${name}`)
      return { success: true }
    }
    return { success: false, message: '分类不存在' }
  }

  return { books, orders, users, categories, admin, login, logout, addBook, updateBook, deleteBook, updateOrderStatus, addCategory, deleteCategory }
})
