# HTTP

![http](./image/http/http.awebp)
![http](./image/http/http1.awebp)

> 发送端在层与层间传输数据时，每经过一层都会被加上首部信息，接收端每经过一层都会删除一条首部

请求头
![http](./image/http/req-head.awebp)
响应头
![http](./image/http/res-head.awebp)

## 常见的请求头字段

    - accept
      - application： json、x-www-form-urlencoded、octet-stream
      - text： html、css、js
      - image：png、jpg、gif
    - Content-Encoding: gzip、deflat
    - accept-language: zh-CN,zh;q=0.9,en;q=0.8
    - referer：常见当前页面的地址
    - cookie：会把当前域下的cookie带上
    - user-agent：本地浏览器信息
    - Content-Type：text/html、multipart/form-data、application/json、aplpication/x-www-form-urlencoded

## 常见的响应头字段

    - access-control-allow-origin: *
    - content-encoding: gzip
    - content-type: text/html; charset=UTF-8
    -

## 跨域
