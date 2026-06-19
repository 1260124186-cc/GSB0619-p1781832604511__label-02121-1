import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '../utils/storage'
import { logger } from '../utils/logger'
import { defaultBooks, defaultCategories, STORAGE_KEYS } from '../shared/data'

export const useBooksStore = defineStore('books', () => {
  const books = ref(storage.get(STORAGE_KEYS.BOOKS, defaultBooks))
  const categories = ref(['全部', ...storage.get(STORAGE_KEYS.CATEGORIES, defaultCategories)])
  const loading = ref(false)

  const saveBooks = () => storage.set(STORAGE_KEYS.BOOKS, books.value)

  // 刷新分类（从 localStorage 同步）
  const refreshCategories = () => {
    const stored = storage.get(STORAGE_KEYS.CATEGORIES, defaultCategories)
    categories.value = ['全部', ...stored]
  }

  const fetchBooks = () => {
    loading.value = true
    logger.info('BOOKS', '加载图书列表', { count: books.value.length })
    loading.value = false
  }

  const getBookById = (id) => books.value.find(b => b.id === Number(id))

  const getBooksByCategory = (category) => {
    if (category === '全部') return books.value
    return books.value.filter(b => b.category === category)
  }

  const searchBooks = (keyword) => {
    if (!keyword) return books.value
    const kw = keyword.toLowerCase()
    return books.value.filter(b => b.title.toLowerCase().includes(kw) || b.author.toLowerCase().includes(kw))
  }

  const updateStock = (bookId, quantity) => {
    const book = books.value.find(b => b.id === bookId)
    if (book) {
      book.stock -= quantity
      saveBooks()
      logger.info('BOOKS', `库存更新: ${book.title}`, { remaining: book.stock })
    }
  }

  return { books, categories, loading, fetchBooks, getBookById, getBooksByCategory, searchBooks, updateStock, refreshCategories }
})
