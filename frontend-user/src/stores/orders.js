import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '../utils/storage'
import { logger } from '../utils/logger'
import { useBooksStore } from './books'
import { STORAGE_KEYS, defaultOrders } from '../shared/data'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref(storage.get(STORAGE_KEYS.ORDERS, defaultOrders))
  let orderIdCounter = storage.get('orderIdCounter', 1006)

  // 持久化
  watch(orders, (val) => storage.set(STORAGE_KEYS.ORDERS, val), { deep: true })

  const createOrder = (items, totalPrice, userId) => {
    const booksStore = useBooksStore()
    
    // 扣减库存
    items.forEach(item => booksStore.updateStock(item.id, item.quantity))
    
    const order = {
      id: ++orderIdCounter,
      userId,
      items: [...items],
      totalPrice,
      status: '待发货',
      createTime: new Date().toLocaleString()
    }
    
    orders.value.unshift(order)
    storage.set('orderIdCounter', orderIdCounter)
    logger.info('ORDERS', `创建订单 #${order.id}`, { totalPrice, itemCount: items.length })
    return { success: true, data: order }
  }

  return { orders, createOrder }
})
