<template>
  <div class="container">
    <h1 class="page-title">我的订单</h1>

    <div v-if="userOrders.length" class="orders-list">
      <div v-for="order in userOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-id">订单号 #{{ order.id }}</span>
            <span class="order-time">{{ order.createTime }}</span>
          </div>
          <span :class="['order-status', order.status === '待发货' ? 'pending' : 'shipped']">
            {{ order.status }}
          </span>
        </div>

        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img class="item-cover" :src="item.cover" :alt="item.title" />
            <div class="item-info">
              <h4>{{ item.title }}</h4>
              <span class="item-qty">x{{ item.quantity }}</span>
            </div>
            <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="order-footer">
          <span class="items-count">共 {{ order.items.reduce((s, i) => s + i.quantity, 0) }} 件商品</span>
          <div class="order-total">
            <span>订单总额</span>
            <span class="total-amount">¥{{ order.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-orders">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5"/>
        <path d="M12 22V12"/>
      </svg>
      <h2>暂无订单</h2>
      <p>快去选购心仪的图书吧</p>
      <router-link to="/" class="btn btn-primary">去购物</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { useUserStore } from '../stores/user'

const ordersStore = useOrdersStore()
const userStore = useUserStore()

const userOrders = computed(() => {
  if (!userStore.isLoggedIn) return []
  return ordersStore.orders.filter(order => order.userId === userStore.user.id)
})
</script>

<style scoped>
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: #f8f9fa;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.order-time {
  font-size: 14px;
  color: #6c757d;
}

.order-status {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.order-status.pending {
  background: #fef3c7;
  color: #d97706;
}

.order-status.shipped {
  background: #d1fae5;
  color: #059669;
}

.order-items {
  padding: 24px 32px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f3f4;
}

.order-item:last-child {
  border-bottom: none;
}

.item-cover {
  width: 60px;
  height: 80px;
  background: #f8f9fa;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.item-qty {
  font-size: 14px;
  color: #6c757d;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: #fafafa;
}

.items-count {
  color: #6c757d;
  font-size: 14px;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-total span:first-child {
  color: #6c757d;
}

.total-amount {
  font-size: 24px;
  font-weight: 800;
  color: #e94560;
}

.empty-orders {
  text-align: center;
  padding: 100px 0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #6c757d;
}

.empty-orders h2 {
  font-size: 28px;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.empty-orders p {
  color: #6c757d;
  margin-bottom: 32px;
}
</style>
