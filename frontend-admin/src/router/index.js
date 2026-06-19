import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'books', name: 'Books', component: () => import('../views/Books.vue') },
      { path: 'orders', name: 'Orders', component: () => import('../views/Orders.vue') },
      { path: 'users', name: 'Users', component: () => import('../views/Users.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('bookstore_admin_token')
  if (to.path !== '/login' && !isLoggedIn) next('/login')
  else next()
})

export default router
