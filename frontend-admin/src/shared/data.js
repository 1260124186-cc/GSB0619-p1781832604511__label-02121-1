/**
 * 共享数据定义
 * 用户端和管理端使用相同的初始数据和 localStorage key
 */

// localStorage 统一 key
export const STORAGE_KEYS = {
  BOOKS: 'bookstore_books',
  ORDERS: 'bookstore_orders',
  CART: 'bookstore_cart',
  CATEGORIES: 'bookstore_categories',
  USERS: 'bookstore_users',
  USER_TOKEN: 'bookstore_user_token',
  ADMIN_TOKEN: 'bookstore_admin_token'
}

// 默认分类数据（支持动态管理）
export const defaultCategories = ['技术', '科幻', '文学', '历史', '经济', '艺术']

// 生成书籍封面 SVG（用于自动生成封面）
const generateBookCover = (title, author, bgColor, textColor = '#fff') => {
  const lines = title.length > 6 ? [title.slice(0, Math.ceil(title.length/2)), title.slice(Math.ceil(title.length/2))] : [title]
  const titleY = lines.length > 1 ? 120 : 140
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
    <rect width="200" height="280" fill="${bgColor}"/>
    <rect x="10" y="10" width="180" height="260" fill="none" stroke="${textColor}" stroke-opacity="0.3" stroke-width="2" rx="4"/>
    ${lines.map((line, i) => `<text x="100" y="${titleY + i * 32}" text-anchor="middle" fill="${textColor}" font-size="22" font-weight="bold" font-family="system-ui, sans-serif">${line}</text>`).join('')}
    <text x="100" y="${titleY + lines.length * 32 + 20}" text-anchor="middle" fill="${textColor}" fill-opacity="0.8" font-size="14" font-family="system-ui, sans-serif">${author}</text>
    <rect x="20" y="240" width="160" height="3" fill="${textColor}" fill-opacity="0.4" rx="1"/>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// 默认图书数据（使用与内容相关的网络图片）
export const defaultBooks = [
  { id: 1, title: 'Vue.js 实战指南', author: '张三', price: 59.9, cover: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=280&fit=crop', category: '技术', stock: 100, description: '全面讲解 Vue.js 3.0 的实战开发技巧', status: '上架' },
  { id: 2, title: 'JavaScript 高级程序设计', author: '李四', price: 89.0, cover: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200&h=280&fit=crop', category: '技术', stock: 50, description: '前端开发必读经典', status: '上架' },
  { id: 3, title: '算法导论', author: '王五', price: 128.0, cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=280&fit=crop', category: '技术', stock: 30, description: '计算机科学经典教材', status: '上架' },
  { id: 4, title: '三体', author: '刘慈欣', price: 68.0, cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=280&fit=crop', category: '科幻', stock: 200, description: '中国科幻巅峰之作', status: '上架' },
  { id: 5, title: '活着', author: '余华', price: 45.0, cover: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=200&h=280&fit=crop', category: '文学', stock: 150, description: '感人至深的生命故事', status: '上架' },
  { id: 6, title: '人类简史', author: '尤瓦尔', price: 78.0, cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=280&fit=crop', category: '历史', stock: 80, description: '从动物到上帝的人类演化史', status: '上架' },
  { id: 7, title: 'Python 编程入门', author: '赵六', price: 49.9, cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=280&fit=crop', category: '技术', stock: 120, description: '零基础学 Python', status: '上架' },
  { id: 8, title: '设计模式', author: 'GoF', price: 99.0, cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&h=280&fit=crop', category: '技术', stock: 40, description: '软件设计经典', status: '上架' },
  { id: 9, title: '红楼梦', author: '曹雪芹', price: 56.0, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop', category: '文学', stock: 90, description: '中国古典文学巅峰之作', status: '上架' },
  { id: 10, title: '银河帝国', author: '阿西莫夫', price: 72.0, cover: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&h=280&fit=crop', category: '科幻', stock: 65, description: '科幻史上的永恒经典', status: '上架' },
  { id: 11, title: '经济学原理', author: '曼昆', price: 98.0, cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=280&fit=crop', category: '经济', stock: 45, description: '经济学入门必读教材', status: '上架' },
  { id: 12, title: '艺术的故事', author: '贡布里希', price: 128.0, cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=280&fit=crop', category: '艺术', stock: 35, description: '最著名的艺术史入门书', status: '上架' }
]

// 默认订单数据
export const defaultOrders = [
  { id: 1001, userId: 1, items: [{ id: 1, title: 'Vue.js 实战指南', price: 59.9, quantity: 2, cover: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=280&fit=crop' }], totalPrice: 119.8, status: '已完成', createTime: '2026-02-28 14:30:00' },
  { id: 1002, userId: 3, items: [{ id: 4, title: '三体', price: 68.0, quantity: 1, cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=280&fit=crop' }, { id: 5, title: '活着', price: 45.0, quantity: 1, cover: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=200&h=280&fit=crop' }], totalPrice: 113.0, status: '已发货', createTime: '2026-02-28 16:20:00' },
  { id: 1003, userId: 4, items: [{ id: 6, title: '人类简史', price: 78.0, quantity: 1, cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=280&fit=crop' }], totalPrice: 78.0, status: '待发货', createTime: '2026-03-01 09:15:00' },
  { id: 1004, userId: 5, items: [{ id: 2, title: 'JavaScript 高级程序设计', price: 89.0, quantity: 1, cover: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200&h=280&fit=crop' }, { id: 7, title: 'Python 编程入门', price: 49.9, quantity: 2, cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=280&fit=crop' }], totalPrice: 188.8, status: '已完成', createTime: '2026-03-01 11:45:00' },
  { id: 1005, userId: 6, items: [{ id: 11, title: '经济学原理', price: 98.0, quantity: 1, cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=280&fit=crop' }], totalPrice: 98.0, status: '待发货', createTime: '2026-03-02 08:30:00' }
]

// 导出封面生成函数供其他地方使用
export { generateBookCover }

// 默认用户数据
export const defaultUsers = [
  { id: 1, username: 'user', password: '123456', email: 'user@example.com', role: 'user', status: '正常', createTime: '2026-01-15' },
  { id: 2, username: 'admin', password: 'admin123', email: 'admin@example.com', role: 'admin', status: '正常', createTime: '2026-01-01' },
  { id: 3, username: '张伟', password: '123456', email: 'zhangwei@example.com', role: 'user', status: '正常', createTime: '2026-01-20' },
  { id: 4, username: '李娜', password: '123456', email: 'lina@example.com', role: 'user', status: '正常', createTime: '2026-02-05' },
  { id: 5, username: '王磊', password: '123456', email: 'wanglei@example.com', role: 'user', status: '正常', createTime: '2026-02-12' },
  { id: 6, username: '刘芳', password: '123456', email: 'liufang@example.com', role: 'user', status: '正常', createTime: '2026-02-20' },
  { id: 7, username: '陈明', password: '123456', email: 'chenming@example.com', role: 'user', status: '禁用', createTime: '2026-02-25' }
]
