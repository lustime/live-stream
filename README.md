# 学校直播播放器

为爷爷奶奶设计的简单易用的学校直播观看界面。

## 功能特点

- 🕐 **时间控制**: 只在指定时间段开放直播（上午8:30-下午3:30）
- 📱 **响应式设计**: 适配手机、平板、电脑等各种设备
- 👴👵 **老人友好**: 大字体、简洁界面、易于操作
- 🔄 **自动重连**: 网络中断后自动尝试重新连接
- ⚠️ **错误提示**: 友好的错误信息提示
- 🔒 **安全保护**: 直播源地址不暴露在URL中

## 使用方法

### 1. 配置直播源

编辑 `config.js` 文件，修改直播源地址：

```javascript
const STREAM_CONFIG = {
    primaryStream: 'https://your-actual-stream-url.m3u8',  // 必填：主要直播源
    backupStream: 'https://backup-stream-url.m3u8',        // 可选：备用直播源
    // ... 其他配置
};
```

### 2. 直接打开使用

配置完成后，直接在浏览器中打开 `index.html` 文件即可使用，无需URL参数。

### 3. 调试模式（可选）

如需调试，可以使用debug参数：
```
index.html?debug=https://debug-stream-url.m3u8
```

## 直播源地址格式

支持标准的 `.m3u8` 格式的HLS直播源，例如：
- `https://example.com/live/stream.m3u8`
- `http://your-server.com/live/stream.m3u8`

## HTTPS/HTTP混合内容问题解决方案

由于浏览器的安全策略，当服务是HTTP而直播源是HTTPS时，可能会遇到混合内容问题。本应用提供了以下解决方案：

### 方案一：使用CORS代理（默认）
应用内置了CORS代理支持，会自动处理HTTPS直播源在HTTP环境下的播放问题。

### 方案二：使用HTTPS服务部署（推荐）
建议将服务部署在HTTPS环境下，这样可以避免所有混合内容问题。

### 方案三：使用本地服务器
使用本地服务器运行应用，避免直接通过file://协议打开：

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 然后访问 http://localhost:8000
```

## 部署方法

### 1. 直接部署
将以下文件上传到您的网站空间：
- `index.html`
- `app.js`
- `styles.css`
- `config.js`

### 2. 使用GitHub Pages
1. Fork这个项目
2. 在Settings中启用GitHub Pages
3. 访问 `https://yourusername.github.io/repository-name/`

### 3. 使用Netlify/Vercel
1. 将代码上传到GitHub
2. 连接到Netlify或Vercel
3. 自动部署并获取HTTPS链接

## 自定义配置

### 修改直播时间段
编辑 `config.js` 文件：

```javascript
schedule: {
    startHour: 8,      // 开始小时
    startMinute: 30,   // 开始分钟
    endHour: 15,       // 结束小时
    endMinute: 30      // 结束分钟
}
```

### 修改界面文字
编辑 `config.js` 文件：

```javascript
ui: {
    title: '📹 学校直播',
    subtitle: '为爷爷奶奶优化设计的直播界面',
    timezone: 'Asia/Shanghai'
}
```

### 添加多个直播源
在 `config.js` 中添加：

```javascript
const STREAM_SOURCES = {
    classroom1: 'https://example.com/classroom1/stream.m3u8',
    classroom2: 'https://example.com/classroom2/stream.m3u8'
};
```

## 浏览器兼容性

- ✅ Chrome 58+
- ✅ Firefox 55+
- ✅ Safari 10+
- ✅ Edge 79+
- ✅ 手机浏览器

## 故障排除

### 直播无法播放
1. 检查 `config.js` 中的直播源地址是否正确
2. 确认直播源格式为 `.m3u8`
3. 检查网络连接
4. 查看浏览器控制台错误信息

### HTTPS/HTTP问题
如果遇到"混合内容"错误：
1. 使用HTTPS服务部署
2. 使用本地服务器运行
3. 检查直播源地址协议

### 自动播放失败
某些浏览器需要用户交互才能播放：
1. 点击播放按钮
2. 检查浏览器设置
3. 确保页面有HTTPS证书

## 安全特性

- 🔒 **直播源隐藏**: 直播源地址存储在配置文件中，不暴露在URL
- 🛡️ **调试模式**: 仅在需要时通过debug参数启用
- 🔐 **CORS保护**: 内置跨域请求保护

## 技术支持

如有问题，请检查浏览器开发者工具的控制台输出，或联系技术支持。

## 更新日志

- v1.2.0: 添加直播源隐藏功能，移除URL参数暴露
- v1.1.0: 添加HTTPS/HTTP混合内容支持
- v1.0.0: 初始版本发布
