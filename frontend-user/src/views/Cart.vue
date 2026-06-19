<template>
  <div class="container">
    <h1 class="page-title">购物车</h1>
    <div v-if="cartStore.items.length" class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-cover">
            <img :src="item.cover" :alt="item.title" />
          </div>
          <div class="item-details">
            <h3>{{ item.title }}</h3>
            <p class="item-author">{{ item.author }}</p>
            <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
          </div>
          <div class="item-quantity">
            <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          <button class="remove-btn" @click="cartStore.removeFromCart(item.id)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="cart-summary">
        <h3>订单摘要</h3>
        <div class="summary-row"><span>商品数量</span><span>{{ cartStore.totalCount }} 件</span></div>
        <div class="summary-row"><span>商品金额</span><span>¥{{ cartStore.totalPrice.toFixed(2) }}</span></div>
        <div class="summary-row"><span>运费</span><span class="free">免运费</span></div>
        <div class="summary-total"><span>总计</span><span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span></div>
        <button class="btn btn-primary checkout-btn" :disabled="loading" @click="checkout">
          {{ loading ? '处理中...' : '立即结算' }}
        </button>
      </div>
    </div>
    <div v-else class="empty-cart">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <h2>购物车是空的</h2>
      <p>去发现一些好书吧</p>
      <router-link to="/" class="btn btn-primary">开始购物</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { useUserStore } from '../stores/user'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const userStore = useUserStore()
const toast = inject('toast')
const openLoginModal = inject('openLoginModal')
const loading = ref(false)

const checkout = async () => {
  if (!userStore.isLoggedIn) {
    toast('请先登录', 'error')
    openLoginModal()
    return
  }
  
  loading.value = true
  const res = await ordersStore.createOrder(cartStore.items, cartStore.totalPrice, userStore.user.id)
  loading.value = false
  
  if (res.success) {
    cartStore.clearCart()
    toast('下单成功', 'success')
    router.push('/orders')
  } else {
    toast(res.message || '下单失败', 'error')
  }
}
</script>

<style scoped>
.cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
.cart-items { display: flex; flex-direction: column; gap: 16px; }
.cart-item { display: flex; align-items: center; gap: 24px; background: white; padding: 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
.item-cover { width: 80px; height: 80px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
.item-cover img { width: 100%; height: 100%; object-fit: cover; }
.item-details { flex: 1; }
.item-details h3 { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
.item-author { font-size: 14px; color: #6c757d; margin-bottom: 8px; }
.item-price { font-size: 16px; font-weight: 600; color: #e94560; }
.item-quantity { display: flex; align-items: center; gap: 12px; background: #f8f9fa; padding: 8px; border-radius: 30px; }
.qty-btn { width: 36px; height: 36px; border: none; background: white; border-radius: 50%; font-size: 18px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.qty-btn:hover { background: #1a1a2e; color: white; }
.item-quantity span { font-size: 16px; font-weight: 700; min-width: 30px; text-align: center; }
.item-subtotal { font-size: 20px; font-weight: 800; color: #1a1a2e; min-width: 100px; text-align: right; }
.remove-btn { width: 44px; height: 44px; border: none; background: #fee2e2; color: #e94560; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
.remove-btn:hover { background: #e94560; color: white; }
.cart-summary { background: white; padding: 32px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); position: sticky; top: 120px; }
.cart-summary h3 { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #1a1a2e; }
.summary-row { display: flex; justify-content: space-between; padding: 12px 0; color: #6c757d; font-size: 15px; }
.free { color: #10b981; font-weight: 600; }
.summary-total { display: flex; justify-content: space-between; padding: 20px 0; margin-top: 16px; border-top: 2px solid #f8f9fa; font-size: 18px; font-weight: 700; color: #1a1a2e; }
.total-price { font-size: 28px; color: #e94560; }
.checkout-btn { width: 100%; margin-top: 24px; padding: 18px; font-size: 16px; }
.checkout-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.empty-cart { text-align: center; padding: 100px 0; }
.empty-icon { width: 80px; height: 80px; margin: 0 auto 24px; color: #6c757d; }
.empty-cart h2 { font-size: 28px; color: #1a1a2e; margin-bottom: 8px; }
.empty-cart p { color: #6c757d; margin-bottom: 32px; }
@media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } .cart-item { flex-wrap: wrap; } }
</style>
