<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">用户管理</h1>
        <p class="page-subtitle">管理平台注册用户</p>
      </div>
      <div class="user-stats">
        <span class="stat-badge">👥 {{ adminStore.users.length }} 位用户</span>
      </div>
    </div>

    <div class="card">
      <div class="users-grid">
        <div v-for="user in adminStore.users" :key="user.id" class="user-card">
          <div class="user-avatar-lg">{{ user.username.charAt(0).toUpperCase() }}</div>
          <div class="user-info">
            <span class="user-name">{{ user.username }}</span>
            <span class="user-email">{{ user.email }}</span>
          </div>
          <div class="user-stats-row">
            <div class="user-stat">
              <span class="stat-value">{{ user.orders }}</span>
              <span class="stat-label">订单</span>
            </div>
          </div>
          <div class="user-footer">
            <span :class="['status-dot', user.status === '正常' ? 'active' : 'inactive']"></span>
            <span class="status-text">{{ user.status }}</span>
            <button :class="['toggle-btn', user.status === '正常' ? 'danger' : 'success']" @click="toggleStatus(user)">
              {{ user.status === '正常' ? '禁用' : '启用' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '../stores/admin'
import { ElMessage } from 'element-plus'

const adminStore = useAdminStore()
const toggleStatus = (user) => {
  user.status = user.status === '正常' ? '禁用' : '正常'
  ElMessage.success('状态更新成功')
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.stat-badge { padding: 12px 20px; background: white; border-radius: 12px; font-size: 14px; color: #6b7280; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

.users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.user-card { background: #f9fafb; border-radius: 20px; padding: 28px; text-align: center; transition: all 0.3s; }
.user-card:hover { background: #f3f4f6; transform: translateY(-4px); }
.user-avatar-lg { width: 72px; height: 72px; background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; margin: 0 auto 20px; box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3); }
.user-info { margin-bottom: 20px; }
.user-name { font-size: 18px; font-weight: 700; color: #1a1a2e; display: block; margin-bottom: 4px; }
.user-email { font-size: 14px; color: #6b7280; }
.user-stats-row { display: flex; justify-content: center; gap: 32px; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; margin-bottom: 20px; }
.user-stat { text-align: center; }
.stat-value { font-size: 24px; font-weight: 800; color: #7c3aed; display: block; }
.stat-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
.user-footer { display: flex; align-items: center; justify-content: center; gap: 12px; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; }
.status-dot.active { background: #10b981; }
.status-dot.inactive { background: #ef4444; }
.status-text { font-size: 14px; color: #6b7280; }
.toggle-btn { padding: 8px 18px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-left: auto; }
.toggle-btn.danger { background: #fee2e2; color: #ef4444; }
.toggle-btn.danger:hover { background: #ef4444; color: white; }
.toggle-btn.success { background: #d1fae5; color: #059669; }
.toggle-btn.success:hover { background: #059669; color: white; }
</style>
