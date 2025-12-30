# 性能优化

## 构建环节

### 常见优化

- 构建时缓存
- 多线程构建
- 体积优化。tree-shaking、code-split、去重复包、压缩

### 构建工具升级

- esbuild
- pnpm
- yarn

### 架构支撑

- 微前端架构

## 网络环节

### 前端

- 延迟加载
- 预加载
- 减少 http 请求
- css 放在页面顶部
- js 放在页面底部
- 减少 dns 查询
- 缓存 ajax 请求
- 不带 cookie

### 服务端

- cdn 不同地区分流
- 请求缓存控制 cache-control、etag
- gzip 压缩
- 压缩 js、css
- 图片资源压缩

## 渲染环节

- 动画
- 减少 dom 操作
- 主线程占用时间
- 事件监听
- 样式读写。回流重绘
- 将耗时多的任务放到 web-worker 中处理
