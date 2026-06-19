import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/category', name: 'Category', component: () => import('../views/Category.vue') },
  { path: '/book/:id', name: 'BookDetail', component: () => import('../views/BookDetail.vue') },
  { path: '/cart', name: 'Cart', component: () => import('../views/Cart.vue'), meta: { requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: () => import('../views/Orders.vue'), meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：允许访问所有页面，登录检查在组件内部处理
router.beforeEach((to, from, next) => {
  next()
})

export default router
