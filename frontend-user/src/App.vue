<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">Book<span>Store</span></router-link>
        <nav class="nav">
          <router-link to="/">发现</router-link>
          <router-link to="/category">分类</router-link>
          <router-link to="/cart">购物车 ({{ cartStore.totalCount }})</router-link>
          <router-link to="/orders">订单</router-link>
        </nav>
        <div class="user-area">
          <template v-if="userStore.isLoggedIn">
            <span>{{ userStore.user.username }}</span>
            <button @click="userStore.logout">退出</button>
          </template>
          <button v-else class="login-btn" @click="showLoginModal = true">登录</button>
        </div>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <p>© 2024 BookStore · 精选好书，品质生活</p>
    </footer>
    <Toast ref="toastRef" />
    <LoginModal v-model:visible="showLoginModal" @login-success="onLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useCartStore } from './stores/cart'
import { useUserStore } from './stores/user'
import Toast from './components/Toast.vue'
import LoginModal from './components/LoginModal.vue'

const cartStore = useCartStore()
const userStore = useUserStore()
const toastRef = ref(null)
const showLoginModal = ref(false)

const openLoginModal = () => {
  showLoginModal.value = true
}

const onLoginSuccess = () => {
  toastRef.value?.show('登录成功', 'success')
}

provide('toast', (msg, type) => toastRef.value?.show(msg, type))
provide('openLoginModal', openLoginModal)
</script>
