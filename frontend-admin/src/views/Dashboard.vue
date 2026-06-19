<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">数据面板</h1>
        <p class="page-subtitle">实时查看店铺运营数据</p>
      </div>
      <div class="header-actions">
        <span class="date-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right: 6px; vertical-align: middle;">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ today }}
        </span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-icon purple">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </span>
          <span class="stat-trend up">+12%</span>
        </div>
        <div class="stat-value">{{ adminStore.books.length }}</div>
        <div class="stat-label">图书总数</div>
        <div class="stat-bar purple"></div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-icon pink">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="1.5">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
            </svg>
          </span>
          <span class="stat-trend up">+8%</span>
        </div>
        <div class="stat-value">{{ adminStore.orders.length }}</div>
        <div class="stat-label">订单总数</div>
        <div class="stat-bar pink"></div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-icon blue">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          <span class="stat-trend up">+24%</span>
        </div>
        <div class="stat-value">{{ adminStore.users.length }}</div>
        <div class="stat-label">用户总数</div>
        <div class="stat-bar blue"></div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-icon green">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </span>
          <span class="stat-trend up">+18%</span>
        </div>
        <div class="stat-value">¥{{ totalSales.toFixed(0) }}</div>
        <div class="stat-label">销售总额</div>
        <div class="stat-bar green"></div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card orders-card">
        <div class="card-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right: 8px; vertical-align: middle;">
              <path d="M9 11H3v10h6V11zM21 3h-6v18h6V3zM15 7H9v14h6V7z"/>
            </svg>
            最近订单
          </h3>
          <router-link to="/orders" class="view-link">查看全部 →</router-link>
        </div>
        <div class="orders-table">
          <div v-for="order in adminStore.orders.slice(0, 5)" :key="order.id" class="order-row">
            <div class="order-main">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-user">用户{{ order.userId || order.user }}</span>
            </div>
            <span class="order-amount">¥{{ (order.totalPrice || order.total || 0).toFixed(2) }}</span>
            <span :class="['status-pill', statusClass(order.status)]">{{ order.status }}</span>
          </div>
        </div>
      </div>

      <div class="card books-card">
        <div class="card-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right: 8px; vertical-align: middle;">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
            热门图书
          </h3>
          <router-link to="/books" class="view-link">查看全部 →</router-link>
        </div>
        <div class="books-list">
          <div v-for="(book, i) in adminStore.books.slice(0, 4)" :key="book.id" class="book-row">
            <div class="book-rank" :class="['rank-' + (i + 1)]">{{ i + 1 }}</div>
            <img class="book-cover" :src="book.cover" :alt="book.title" />
            <div class="book-meta">
              <span class="book-name">{{ book.title }}</span>
              <span class="book-author">{{ book.author }}</span>
            </div>
            <span class="book-price">¥{{ book.price.toFixed(0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
const totalSales = computed(() => adminStore.orders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0))
const statusClass = (s) => s === '已完成' ? 'success' : s === '已发货' ? 'warning' : 'pending'
const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.header-actions { display: flex; gap: 12px; }
.date-badge { padding: 10px 18px; background: white; border-radius: 12px; font-size: 14px; font-weight: 500; color: #6b7280; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
.stat-card { background: white; border-radius: 20px; padding: 28px; position: relative; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
.stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.stat-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; }
.stat-icon.purple { background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05)); }
.stat-icon.pink { background: linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05)); }
.stat-icon.blue { background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05)); }
.stat-icon.green { background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05)); }
.stat-trend { font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
.stat-trend.up { background: #d1fae5; color: #059669; }
.stat-value { font-size: 36px; font-weight: 800; color: #1a1a2e; letter-spacing: -1px; }
.stat-label { font-size: 14px; color: #6b7280; margin-top: 4px; }
.stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; }
.stat-bar.purple { background: linear-gradient(90deg, #7c3aed, #a78bfa); }
.stat-bar.pink { background: linear-gradient(90deg, #ec4899, #f472b6); }
.stat-bar.blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.stat-bar.green { background: linear-gradient(90deg, #10b981, #34d399); }

.dashboard-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.card-header h3 { font-size: 18px; font-weight: 700; color: #1a1a2e; }
.view-link { color: #7c3aed; text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s; }
.view-link:hover { color: #6d28d9; }

.order-row { display: flex; align-items: center; gap: 16px; padding: 16px; background: #f9fafb; border-radius: 14px; margin-bottom: 12px; transition: all 0.2s; }
.order-row:hover { background: #f3f4f6; transform: translateX(4px); }
.order-main { flex: 1; }
.order-id { font-weight: 700; color: #7c3aed; display: block; font-size: 15px; }
.order-user { font-size: 13px; color: #6b7280; }
.order-amount { font-weight: 700; color: #1a1a2e; font-size: 15px; }
.status-pill { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.status-pill.success { background: #d1fae5; color: #059669; }
.status-pill.warning { background: #fef3c7; color: #d97706; }
.status-pill.pending { background: #ede9fe; color: #7c3aed; }

.book-row { display: flex; align-items: center; gap: 14px; padding: 14px; background: #f9fafb; border-radius: 14px; margin-bottom: 10px; transition: all 0.2s; }
.book-row:hover { background: #f3f4f6; }
.book-rank { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; }
.rank-1 { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.rank-2 { background: linear-gradient(135deg, #6b7280, #9ca3af); }
.rank-3 { background: linear-gradient(135deg, #b45309, #d97706); }
.rank-4, .rank-5 { background: #e5e7eb; color: #6b7280; }
.book-cover { width: 48px; height: 64px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.book-meta { flex: 1; }
.book-name { font-weight: 600; color: #1a1a2e; display: block; font-size: 14px; }
.book-author { font-size: 12px; color: #6b7280; }
.book-price { font-weight: 700; color: #7c3aed; }

@media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
</style>
