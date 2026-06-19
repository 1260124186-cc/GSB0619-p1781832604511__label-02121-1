import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { logger } from '../utils/logger'
import { rules, validate } from '../utils/validator'
import { defaultUsers, STORAGE_KEYS } from '../shared/data'

export const useUserStore = defineStore('user', () => {
  const user = ref(storage.get('currentUser', null))
  const isLoggedIn = computed(() => !!user.value)

  // 获取用户列表（从 localStorage，与管理端共享）
  const getUsers = () => storage.get(STORAGE_KEYS.USERS, defaultUsers)
  const saveUsers = (users) => storage.set(STORAGE_KEYS.USERS, users)

  const login = (username, password) => {
    // 表单校验
    let error = validate(username, '用户名', [v => rules.required(v, '用户名'), v => rules.maxLength(v, '用户名', 50)])
    if (error) return { success: false, message: error }
    error = validate(password, '密码', [v => rules.required(v, '密码')])
    if (error) return { success: false, message: error }

    // 从 localStorage 读取用户列表（与管理端共享）
    const users = getUsers()
    const found = users.find(u => u.username === username && u.password === password)
    
    if (found) {
      if (found.status === '禁用') {
        logger.warn('AUTH', `账号已禁用: ${username}`)
        return { success: false, message: '账号已被禁用，请联系管理员' }
      }
      const userData = { id: found.id, username: found.username, email: found.email, role: found.role }
      user.value = userData
      storage.set('currentUser', userData)
      storage.set(STORAGE_KEYS.USER_TOKEN, `token-${found.id}-${Date.now()}`)
      logger.info('AUTH', `用户登录: ${username}`)
      return { success: true }
    }
    logger.warn('AUTH', `登录失败: ${username}`)
    return { success: false, message: '用户名或密码错误' }
  }

  const register = (username, password, email) => {
    // 表单校验
    let error = validate(username, '用户名', [
      v => rules.required(v, '用户名'),
      v => rules.minLength(v, '用户名', 2),
      v => rules.maxLength(v, '用户名', 20)
    ])
    if (error) return { success: false, message: error }
    
    error = validate(password, '密码', [
      v => rules.required(v, '密码'),
      v => rules.minLength(v, '密码', 6)
    ])
    if (error) return { success: false, message: error }
    
    error = validate(email, '邮箱', [
      v => rules.required(v, '邮箱'),
      v => rules.email(v, '邮箱')
    ])
    if (error) return { success: false, message: error }

    const users = getUsers()
    
    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
      return { success: false, message: '用户名已存在' }
    }
    
    // 检查邮箱是否已存在
    if (users.find(u => u.email === email)) {
      return { success: false, message: '邮箱已被注册' }
    }

    // 创建新用户
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      username,
      password,
      email,
      role: 'user',
      status: '正常'
    }
    
    users.push(newUser)
    saveUsers(users)
    
    logger.info('AUTH', `新用户注册: ${username}`)
    return { success: true, message: '注册成功，请登录' }
  }

  const logout = () => {
    logger.info('AUTH', `用户登出: ${user.value?.username}`)
    user.value = null
    storage.remove('currentUser')
    storage.remove(STORAGE_KEYS.USER_TOKEN)
  }

  return { user, isLoggedIn, login, register, logout }
})
