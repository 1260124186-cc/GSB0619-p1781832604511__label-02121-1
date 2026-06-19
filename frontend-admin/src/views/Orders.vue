<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">订单管理</h1>
        <p class="page-subtitle">管理所有用户订单</p>
      </div>
      <div class="stats-mini">
        <div class="stat-mini"><span class="stat-num">{{ pendingCount }}</span> 待发货</div>
        <div class="stat-mini"><span class="stat-num">{{ shippedCount }}</span> 已发货</div>
      </div>
    </div>

    <div class="card">
      <div class="orders-list">
        <div v-for="order in adminStore.orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-id-wrap">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-time">{{ order.createTime || order.time }}</span>
            </div>
            <span :class="['status-badge', statusClass(order.status)]">{{ order.status }}</span>
          </div>
          <div class="order-body">
            <div class="order-info">
              <div class="info-item">
                <span class="info-label">用户</span>
                <span class="info-value">用户{{ order.userId || order.user }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">商品</span>
                <span class="info-value">{{ order.items?.length || order.items }} 件</span>
              </div>
              <div class="info-item">
                <span class="info-label">金额</span>
                <span class="info-value amount">¥{{ (order.totalPrice || order.total || 0).toFixed(2) }}</span>
              </div>
            </div>
            <div class="order-action">
              <el-select v-model="order.status" size="default" @change="updateStatus(order)">
                <el-option v-for="s in ['待发货', '已发货', '已完成']" :key="s" :label="s" :value="s" />
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '../stores/admin'
import { ElMessage } from 'element-plus'

const adminStore = useAdminStore()
const statusClass = (s) => s === '已完成' ? 'success' : s === '已发货' ? 'warning' : 'pending'
const pendingCount = computed(() => adminStore.orders.filter(o => o.status === '待发货').length)
const shippedCount = computed(() => adminStore.orders.filter(o => o.status === '已发货').length)

const updateStatus = (order) => {
  adminStore.updateOrderStatus(order.id, order.status)
  ElMessage.success('状态更新成功')
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.stats-mini { display: flex; gap: 16px; }
.stat-mini { padding: 12px 20px; background: white; border-radius: 12px; font-size: 14px; color: #6b7280; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.stat-num { font-weight: 700; color: #7c3aed; margin-right: 6px; }

.orders-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }
.order-card { background: #f9fafb; border-radius: 18px; padding: 24px; transition: all 0.2s; }
.order-card:hover { background: #f3f4f6; }
.order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.order-id { font-size: 18px; font-weight: 700; color: #7c3aed; display: block; }
.order-time { font-size: 13px; color: #9ca3af; }
.status-badge { padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.status-badge.success { background: #d1fae5; color: #059669; }
.status-badge.warning { background: #fef3c7; color: #d97706; }
.status-badge.pending { background: #ede9fe; color: #7c3aed; }
.order-body { display: flex; justify-content: space-between; align-items: flex-end; }
.order-info { display: flex; gap: 32px; }
.info-item { display: flex; flex-direction: column; gap: 4px; }
.info-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
.info-value { font-size: 15px; font-weight: 600; color: #1a1a2e; }
.info-value.amount { color: #7c3aed; font-size: 18px; }
:deep(.el-select) { width: 130px; }
</style>
