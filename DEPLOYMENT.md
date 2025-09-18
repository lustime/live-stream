# GitHub Pages 安全部署指南

本指南将帮助您安全地部署直播应用，保护直播源地址不被公开。

## 🔐 安全特性

- ✅ 直播源地址通过GitHub Secrets保护
- ✅ 公开代码中只显示占位符
- ✅ 自动HTTPS部署
- ✅ 支持多直播源切换

## 📋 部署步骤

### 1. 创建GitHub仓库

1. 在GitHub上创建新仓库
2. 将代码上传到仓库
3. 确保主分支为 `main` 或 `master`

### 2. 设置GitHub Secrets

1. 进入仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **"New repository secret"**
3. 添加以下Secrets：

| Secret名称 | 说明 | 示例值 |
|-----------|------|--------|
| `CLASSROOM1_URL` | 教室一的直播源地址 | `https://your-server.com/classroom1/stream.m3u8` |
| `CLASSROOM2_URL` | 教室二的直播源地址 | `https://your-server.com/classroom2/stream.m3u8` |

### 3. 启用GitHub Pages

1. 进入仓库 → **Settings** → **Pages**
2. **Source** 选择 **"GitHub Actions"**
3. 保存设置

### 4. 触发部署

有两种方式触发部署：

#### 方式一：推送代码（自动）
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

#### 方式二：手动触发
1. 进入仓库 → **Actions** 标签页
2. 选择 **"Deploy to GitHub Pages"** 工作流
3. 点击 **"Run workflow"**

### 5. 访问应用

部署完成后，访问：
```
https://你的用户名.github.io/仓库名/
```

## 🔍 验证部署

### 检查直播源是否被保护

1. 在浏览器中访问部署的网站
2. 右键 → **查看页面源代码**
3. 搜索 `classroom1` 或 `classroom2`
4. 应该看到占位符 `{{CLASSROOM1_URL}}` 而不是实际地址

### 检查功能是否正常

1. 在直播开放时间内访问网站
2. 应该能看到直播源选择按钮
3. 点击按钮应该能正常切换直播源

## 🛠️ 故障排除

### 部署失败

1. 检查GitHub Secrets是否正确设置
2. 查看Actions日志中的错误信息
3. 确保直播源地址格式正确（.m3u8格式）

### 直播源不显示

1. 检查Secrets中的直播源地址是否有效
2. 确认直播源服务器支持跨域访问
3. 查看浏览器控制台是否有错误信息

### 无法播放直播

1. 检查直播源地址是否正确
2. 确认直播源服务器是否在线
3. 检查网络连接

## 📝 更新直播源

如需更新直播源地址：

1. 进入仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 找到对应的Secret
3. 点击 **"Update"** 修改地址
4. 推送任意代码或手动触发部署

## 🔒 安全建议

1. **定期更新直播源地址**：建议定期更换直播源地址
2. **使用HTTPS直播源**：确保直播源使用HTTPS协议
3. **限制访问**：如有需要，可以在直播源服务器端设置访问限制
4. **监控使用情况**：定期检查直播源的使用情况

## 📞 技术支持

如遇到问题，请检查：
1. GitHub Actions日志
2. 浏览器开发者工具控制台
3. 网络连接状态

---

**注意**：本部署方案通过GitHub Secrets保护直播源地址，但请确保您的直播源服务器本身也有适当的安全措施。
