import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '../utils/storage'
import { logger } from '../utils/logger'
import { STORAGE_KEYS } from '../shared/data'

export const useCartStore = defineStore('cart', () => {
  const items = ref(storage.get(STORAGE_KEYS.CART, []))

  // 持久化
  watch(items, (val) => storage.set(STORAGE_KEYS.CART, val), { deep: true })

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

  const addToCart = (book) => {
    const existing = items.value.find(item => item.id === book.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...book, quantity: 1 })
    }
    logger.info('CART', `添加商品: ${book.title}`)
  }

  const removeFromCart = (bookId) => {
    const index = items.value.findIndex(item => item.id === bookId)
    if (index > -1) {
      logger.info('CART', `移除商品: ${items.value[index].title}`)
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (bookId, quantity) => {
    const item = items.value.find(item => item.id === bookId)
    if (item) {
      if (quantity <= 0) removeFromCart(bookId)
      else item.quantity = quantity
    }
  }

  const clearCart = () => {
    items.value = []
    logger.info('CART', '清空购物车')
  }

  return { items, totalCount, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }
})
