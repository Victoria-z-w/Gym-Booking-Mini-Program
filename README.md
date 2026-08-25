# 健身房预约小程序

基于 **uni-app + Vue3 + uView Plus** 微信小程序，**Express** 后端 API。

> **准备上线？** 请阅读 [DEPLOY.md](./DEPLOY.md) 完整部署指南。

## 快速开始

### 1. 启动后端

```bash
cd server
npm install
npm start
```

API 运行在 `http://localhost:3000`

### 2. 启动小程序

```bash
cd miniapp
npm install
node scripts/gen-icons.js
npm run dev:mp-weixin
```

使用微信开发者工具打开 `miniapp/dist/dev/mp-weixin` 目录。

### 3. 配置 API 地址

开发环境默认 `http://localhost:3000/api`，可在 `miniapp/.env.development` 修改 `VITE_API_BASE`。

真机调试时改为电脑局域网 IP；微信开发者工具需勾选「不校验合法域名」。

## 项目结构

```
├── server/          # Express 后端 API
├── miniapp/         # uni-app 微信小程序前端
├── DEPLOY.md        # 上线部署指南
```

## 功能特性

- 首页：城市选择、搜索、Banner 轮播、快捷入口、热门课程
- 课程：分类筛选、难度/时间/排序、课程详情、收藏
- 预约：日历选日期、时间段选择、确认预约、防重复预约、名额控制
- 我的预约：待上课/已完成/已取消、取消预约、课程评价
- 教练/场馆：列表与详情
- 个人中心：会员信息、积分、优惠券、收藏等

## 生产构建

```bash
cd miniapp
# 修改 .env.production 中的 VITE_API_BASE 为 HTTPS 域名
npm run build:mp-weixin
```

上传目录：`miniapp/dist/build/mp-weixin`

## 核心业务流程

```
首页 → 课程详情 → 选择日期/时间 → 确认预约 → 预约成功
  → 我的预约 → 查看详情 → 取消预约 → 名额恢复
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | uni-app (Vue 3) |
| UI 组件 | uView Plus |
| 状态管理 | Pinia |
| 后端 | Express.js |
| 数据持久化 | JSON 文件 (server/src/data/db.json) |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/courses/banners | Banner 列表 |
| GET | /api/courses/hot | 热门课程 |
| GET | /api/courses/list | 课程列表 |
| GET | /api/courses/:id | 课程详情 |
| GET | /api/courses/:id/schedules | 排课时间 |
| POST | /api/bookings/create | 创建预约 |
| POST | /api/bookings/:id/cancel | 取消预约 |
| GET | /api/bookings/list | 预约列表 |
| GET | /api/coaches/list | 教练列表 |
| GET | /api/gyms/list | 场馆列表 |
| POST | /api/auth/login | 微信登录 |
| GET | /api/orders/list | 订单列表 |
| GET | /api/orders/:id | 订单详情 |
| GET | /api/user/info | 用户信息 |

## UI 设计规范

- 主色：`#2878FF`
- 成功色：`#22C55E`
- 警告色：`#FF7A45`
- 背景色：`#F6F8FB`
- 圆角：16-24rpx
