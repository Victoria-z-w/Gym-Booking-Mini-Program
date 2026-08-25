# 上线部署指南

## 一、上线前必做清单

### 1. 微信小程序注册
- 登录 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序
- 获取 **AppID** 和 **AppSecret**
- 完成主体认证（企业/个体）

### 2. 配置小程序 AppID
编辑 `miniapp/src/manifest.json`：
```json
"mp-weixin": {
  "appid": "你的真实AppID"
}
```

### 3. 部署后端（必须 HTTPS）
```bash
cd server
npm install
```

创建 `server/.env`：
```env
NODE_ENV=production
PORT=3000
WX_APPID=你的AppID
WX_SECRET=你的AppSecret
CORS_ORIGIN=https://servicewechat.com
```

启动：
```bash
npm run start:prod
```

**推荐**：部署到云服务器 + Nginx 反向代理 + SSL 证书（Let's Encrypt）

示例 Nginx：
```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    ssl_certificate     /path/fullchain.pem;
    ssl_certificate_key /path/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. 配置小程序 API 域名
编辑 `miniapp/.env.production`：
```env
VITE_API_BASE=https://api.yourdomain.com/api
```

在微信公众平台 → **开发** → **开发管理** → **开发设置** → **服务器域名**：
- request 合法域名：`https://api.yourdomain.com`

### 5. 隐私合规
- 已在小程序内提供 `pages/privacy/index` 隐私政策页
- 在微信公众平台配置「用户隐私保护指引」
- `manifest.json` 已开启 `__usePrivacyCheck__`

### 6. 生产构建
```bash
cd miniapp
npm install
node scripts/gen-icons.js
npm run build:mp-weixin
```

用微信开发者工具打开 `miniapp/dist/build/mp-weixin`，上传代码。

### 7. 提交审核
准备材料：
- 小程序简介：健身房课程预约
- 服务类目：**体育** → 健身房/运动场馆
- 测试账号说明（如有）
- 隐私政策链接（可填小程序内路径）

---

## 二、已实现的上线能力

| 功能 | 说明 |
|------|------|
| 微信登录 | `wx.login` + 后端 code2session |
| Token 鉴权 | 请求头 `Authorization: Bearer token` |
| 订单系统 | 预约成功自动创建订单，取消自动退款 |
| 邀请好友 | 分享小程序卡片 |
| 隐私政策 | 独立页面 |
| 环境配置 | `.env.production` 配置 API |
| 生产 CORS | 环境变量 `CORS_ORIGIN` |

---

## 三、当前限制（可后续迭代）

- **支付方式**：到店核销，未接入微信支付（如需在线支付需商户号 + 支付接口）
- **数据存储**：JSON 文件，生产建议换 MySQL/MongoDB
- **图片资源**：使用 Unsplash 外链，建议换 CDN + 备案域名

---

## 四、本地验证上线配置

```bash
# 终端1 - 后端
cd server && npm start

# 终端2 - 小程序开发
cd miniapp && npm run dev:mp-weixin
```

开发者工具：详情 → 本地设置 → 开发阶段可临时关闭「校验合法域名」。

---

## 五、审核常见问题

1. **request 域名不合法** → 检查 HTTPS 证书与公众平台域名配置
2. **隐私协议未配置** → 公众平台填写隐私指引，小程序内可跳转隐私页
3. **功能无法使用** → 确保审核期间后端服务可用
4. **登录失败** → 检查 WX_APPID / WX_SECRET 是否正确
