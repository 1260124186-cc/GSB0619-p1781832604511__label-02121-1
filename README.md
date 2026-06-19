# 网上购书系统

基于 Vue 3 的网上购书系统，包含用户端购书商城和管理后台。

## How to Run

### Docker 部署（推荐）

```bash
# 启动所有服务
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 本地开发

```bash
# 用户端 (端口 5173)
cd frontend-user
npm install
npm run dev

# 管理后台 (端口 5174)
cd frontend-admin
npm install
npm run dev
```

## Services

| 服务 | 端口 | 说明 |
|------|------|------|
| gateway | 8080 | 统一网关（数据互通入口） |
| frontend-user | 8081 | 用户端 - 购书商城 |
| frontend-admin | 8082 | 管理后台 |

### 访问方式

**推荐（数据互通）**：通过统一网关访问，用户端和管理端共享 localStorage
- 用户端：http://localhost:8080/
- 管理后台：http://localhost:8080/admin/

**独立访问（数据隔离）**：
- 用户端：http://localhost:8081/
- 管理后台：http://localhost:8082/

## 测试账号

### 用户端
- 用户名: user
- 密码: 123456

### 管理后台
- 用户名: admin
- 密码: admin123

## 题目内容

帮我做一个基于vue的网上购书系统的页面设计

---

## 项目介绍

### 项目结构

```
├── gateway/              # 统一网关
│   ├── nginx.conf        # 反向代理配置
│   └── Dockerfile
│
├── frontend-user/        # 用户端
│   ├── src/
│   │   ├── shared/       # 共享数据定义
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── views/        # 页面组件
│   │   ├── components/   # 公共组件
│   │   └── utils/        # 工具函数
│   ├── nginx.conf
│   └── Dockerfile
│
├── frontend-admin/       # 管理后台
│   ├── src/
│   │   ├── shared/       # 共享数据定义
│   │   ├── stores/       # Pinia 状态管理
│   │   ├── views/        # 页面组件
│   │   ├── layouts/      # 布局组件
│   │   └── utils/        # 工具函数
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

### 技术栈

| 模块 | 技术 | 基础镜像 |
|------|------|----------|
| gateway | Nginx 反向代理 | nginx:alpine |
| frontend-user | Vue 3 + Vite 5 + Pinia | node:20-alpine, nginx:alpine |
| frontend-admin | Vue 3 + Element Plus + Pinia | node:20-alpine, nginx:alpine |

### 功能特性

#### 用户端 (frontend-user)
- 用户注册与登录（弹窗模态框）
- 首页图书展示与搜索
- 图书分类浏览
- 图书详情与库存显示
- 购物车管理（增删改）
- 订单创建与查看

#### 管理后台 (frontend-admin)
- 数据统计面板
- 图书管理（增删改查、封面上传、库存管理）
- 订单管理（状态更新）
- 用户管理（启用/禁用）

### 数据说明

本项目为纯前端页面设计演示，数据使用本地 localStorage 模拟。

**通过网关访问（推荐）**：用户端和管理端部署在同一域名下，共享 localStorage，可体验完整业务闭环：
- 用户下单 → 管理员可见订单
- 管理员添加图书 → 用户可见新书
- 库存变更实时同步

**独立端口访问**：数据隔离，请分别在各自端内体验。

### 跨平台支持

所有 Dockerfile 使用支持 ARM64/AMD64 的基础镜像（node:20-alpine, nginx:alpine），可在以下平台运行：
- Intel/AMD x86_64 架构
- Apple M 系列芯片 (ARM64)
- 其他 ARM64 设备

### 工程特性

- 共享数据定义：`src/shared/data.js` 统一管理初始数据和 localStorage key
- 日志记录：`src/utils/logger.js` 提供分级日志
- 表单校验：`src/utils/validator.js` 提供校验规则
- 全局错误处理：`src/utils/error.js` 捕获 Vue 和 Promise 异常
- 数据持久化：`src/utils/storage.js` 封装 localStorage
