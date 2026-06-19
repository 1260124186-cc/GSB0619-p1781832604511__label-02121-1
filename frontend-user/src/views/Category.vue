<template>
  <div class="container">
    <div class="category-header">
      <h1 class="page-title">图书分类</h1>
      <p class="page-subtitle">发现你感兴趣的领域</p>
    </div>

    <div class="filter-bar">
      <button v-for="cat in booksStore.categories" :key="cat" 
        :class="['filter-btn', { active: currentCategory === cat }]" 
        @click="currentCategory = cat">
        {{ cat }}
      </button>
    </div>

    <div class="book-grid">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card" @click="$router.push(`/book/${book.id}`)">
        <div class="book-cover">
          <img class="cover-img" :src="book.cover" :alt="book.title" />
        </div>
        <div class="book-info">
          <span class="book-category">{{ book.category }}</span>
          <h3>{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <span class="book-price">¥{{ book.price.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div v-if="!filteredBooks.length" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      <p>该分类暂无图书</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBooksStore } from '../stores/books'

const booksStore = useBooksStore()
const currentCategory = ref('全部')
const filteredBooks = computed(() => booksStore.getBooksByCategory(currentCategory.value))
</script>

<style scoped>
.category-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 18px;
  color: #6c757d;
  margin: 0;
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 14px 32px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #1a1a2e;
  color: #1a1a2e;
}

.filter-btn.active {
  background: #1a1a2e;
  border-color: #1a1a2e;
  color: white;
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
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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
}

.book-author {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 12px;
}

.book-price {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a2e;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #6c757d;
}

.empty-state p {
  color: #6c757d;
  font-size: 18px;
}
</style>
