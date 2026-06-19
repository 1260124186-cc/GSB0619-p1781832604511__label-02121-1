<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>探索阅读的<br/><span>无限可能</span></h1>
          <p>精选万千好书，开启你的知识之旅</p>
          <div class="search-box">
            <input v-model="keyword" placeholder="搜索书名、作者..." @keyup.enter="search" />
            <button class="search-btn" @click="search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-books">
            <svg class="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <svg class="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <svg class="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <path d="M8 7h8M8 11h6"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Books -->
    <section class="featured container">
      <div class="section-header">
        <h2>精选推荐</h2>
        <router-link to="/category" class="view-all">查看全部 →</router-link>
      </div>
      <div class="book-grid">
        <div v-for="book in displayBooks" :key="book.id" class="book-card" @click="goToDetail(book.id)">
          <div class="book-cover">
            <img class="cover-img" :src="book.cover" :alt="book.title" />
            <div class="book-overlay">
              <button class="quick-add" @click.stop="addToCart(book)">加入购物车</button>
            </div>
            <span v-if="book.stock < 20" class="stock-badge">仅剩 {{ book.stock }} 本</span>
          </div>
          <div class="book-info">
            <span class="book-category">{{ book.category }}</span>
            <h3>{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-footer">
              <span class="book-price">¥{{ book.price.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Preview -->
    <section class="categories-preview container">
      <h2>热门分类</h2>
      <div class="category-cards">
        <div v-for="cat in booksStore.categories.filter(c => c !== '全部').slice(0, 4)" :key="cat" class="category-card" @click="$router.push('/category')">
          <span class="cat-icon" v-html="catIcons[cat] || defaultIcon"></span>
          <span class="cat-name">{{ cat }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const router = useRouter()
const booksStore = useBooksStore()
const cartStore = useCartStore()
const userStore = useUserStore()
const toast = inject('toast')
const openLoginModal = inject('openLoginModal')

const keyword = ref('')
const searchResult = ref(null)
const defaultIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
const catIcons = {
  '技术': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  '科幻': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  '文学': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  '历史': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  '经济': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  '艺术': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2"/><circle cx="6" cy="12" r="2.5"/><circle cx="10" cy="18.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.82-.13 2.66-.36.55-.15.84-.82.53-1.3a5 5 0 0 1 2.38-7.1c.69-.27 1.04-1.08.67-1.73A10 10 0 0 0 12 2z"/></svg>'
}

const displayBooks = computed(() => searchResult.value || booksStore.books)

const search = () => { searchResult.value = booksStore.searchBooks(keyword.value) }
const goToDetail = (id) => router.push(`/book/${id}`)
const addToCart = (book) => {
  if (!userStore.isLoggedIn) {
    toast('请先登录', 'error')
    openLoginModal()
    return
  }
  if (book.stock <= 0) {
    toast('库存不足', 'error')
    return
  }
  cartStore.addToCart(book)
  toast(`《${book.title}》已加入购物车`, 'cart')
}
</script>

<style scoped>
.hero {
  padding: 80px 0 100px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  margin: -60px -40px 80px;
  padding-left: 40px;
  padding-right: 40px;
}

.hero .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero h1 {
  font-size: 56px;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -2px;
}

.hero h1 span {
  background: linear-gradient(135deg, #e94560, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 20px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 50px;
  padding: 8px;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.search-box input {
  flex: 1;
  border: none;
  padding: 16px 24px;
  font-size: 16px;
  background: transparent;
}

.search-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #1a1a2e;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #e94560;
  transform: scale(1.05);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.floating-books {
  position: relative;
  width: 300px;
  height: 300px;
}

.book-icon {
  position: absolute;
  width: 80px;
  height: 80px;
  color: rgba(255, 255, 255, 0.8);
  animation: float 3s ease-in-out infinite;
}

.book-icon:nth-child(1) { top: 0; left: 50%; animation-delay: 0s; }
.book-icon:nth-child(2) { top: 40%; left: 20%; animation-delay: 0.5s; }
.book-icon:nth-child(3) { top: 50%; right: 10%; animation-delay: 1s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Featured Section */
.featured {
  margin-bottom: 100px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
}

.view-all {
  color: #e94560;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.view-all:hover {
  transform: translateX(5px);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.book-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.book-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}

.book-cover {
  height: 220px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s;
}

.book-card:hover .cover-img {
  transform: scale(1.1);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 46, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.quick-add {
  padding: 14px 28px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transform: translateY(20px);
  transition: all 0.3s;
}

.book-card:hover .quick-add {
  transform: translateY(0);
}

.quick-add:hover {
  background: #ff6b6b;
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e94560;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.book-info {
  padding: 24px;
}

.book-category {
  font-size: 12px;
  color: #e94560;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.book-info h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 8px 0;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 16px;
}

.book-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-price {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a2e;
}

/* Categories Preview */
.categories-preview {
  margin-bottom: 100px;
}

.categories-preview h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  letter-spacing: -1px;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}

.cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #1a1a2e;
}

.cat-icon :deep(svg) {
  width: 48px;
  height: 48px;
}

.cat-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
}

@media (max-width: 768px) {
  .hero h1 { font-size: 36px; }
  .hero-visual { display: none; }
  .category-cards { grid-template-columns: repeat(2, 1fr); }
}
</style>
