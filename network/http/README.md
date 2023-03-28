# HTTP

![思维导图](./image/640.jfif)

## HTTP 报文结构是怎样的

对于 TCP 而言，在传输的时候分为两个部分:TCP 头和数据部分。
而 HTTP 类似，也是 header + body 的结构，具体而言:

> 起始行 + 头部 + 空行 + 实体
> ![请求报文](./image/req-head.awebp) > ![响应报文](./image/res-head.awebp)

### 起始行

对于请求报文来说，起始行类似下面这样:

> GET /home HTTP/1.1 也就是方法 + 路径 + http 版本。

对于响应报文来说，起始行一般长这个样:

> HTTP 1.1 200 OK 由 http 版本+状态码+状态短语组成

响应报文的起始行也叫状态行。

起始行每部分之间空格分隔 结尾处加一个换行

### 头部

头部字段格式：1.不区分大小写 2.字段名不允许出现空格，不可以出现下划线 3.字段名后面必须紧接着

### 空行

空行用来区分起始行、头部、实体。

### 实体

就是具体的数据。即 body。分别是请求体和响应体。

## http 的请求方法

### 方法列表

-   get 用来获取数据
-   head 获取资源的元信息
-   post 提交数据 即传输数据
-   put 一般用来修改数据
-   delete 删除数据
-   connect 建立连接隧道，用于代理服务器
-   options 列出可对资源实行的请求方法
-   TRACE 追踪请求-响应的传输路径

### get 和 post 的区别

除了语义上的区别 还有

-   缓存的角度看 get 请求会被浏览器缓存下来，而 post 默认不会。
-   编码的角度看 get 只能被 url 编码，只能接收 ASCII 字符，而 post 没有限制
-   从参数的角度看 get 参数放在 url 中，不安全，post 放在请求体中，更适合传输敏感信息
-   幂等性角度看 get 请求是幂等的 而 post 不是。幂等即执行相同的操作，结果也是相同的。
-   从 TCP 的角度，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)

## URI

URI uniform resource identifier。统一资源标识符。就是用来区分互联网上不同的资源。
但是，它并不是我们常说的网址, 网址指的是 URL, 实际上 URI 包含了 URN 和 URL 两个部分，由于 URL 过于普及，就默认将 URI 视为 URL 了。

完整的结构是这样的:

> schema // host:port path query Anchor
> 例子如下
> http: // www.baidu.com /s ?a=1&b=1 #ccc

## 状态码

http 状态码为 3 位数。

-   1xx 标识协议处理的中间状态，还需要后续操作
-   2xx 表示成功状态

200 OK 是见得最多的成功状态码。通常在响应体中放有数据。
204 No Content 含义与 200 相同，但响应头后没有 body 数据。
206 Partial Content 顾名思义，表示部分内容，它的使用场景为 HTTP 分块下载和断电续传，当然也会带上相应的响应头字段 Content-Range。

-   3xx 重定向状态 资源位置发生变动，需要重新请求

301 Moved Permanently 即永久重定向，对应着 302 Found，即临时重定向。
比如你的网站从 HTTP 升级到了 HTTPS 了，以前的站点再也不用了，应当返回 301，这个时候浏览器默认会做缓存优化，在第二次访问的时候自动访问重定向的那个地址。

而如果只是暂时不可用，那么直接返回 302 即可，和 301 不同的是，浏览器并不会做缓存优化。

304 Not Modified: 当协商缓存命中时会返回这个状态码。详见浏览器缓存

-   4xx 请求报文有误

400 Bad Request: 开发者经常看到一头雾水，只是笼统地提示了一下错误，并不知道哪里出错了。

403 Forbidden: 这实际上并不是请求报文出错，而是服务器禁止访问，原因有很多，比如法律禁止、信息敏感。

404 Not Found: 资源未找到，表示没在服务器上找到相应的资源。

405 Method Not Allowed: 请求方法不被服务器端允许。

406 Not Acceptable: 资源无法满足客户端的条件。

408 Request Timeout: 服务器等待了太长时间。

409 Conflict: 多个请求发生了冲突。

413 Request Entity Too Large: 请求体的数据过大。

414 Request-URI Too Long: 请求行里的 URI 太大。

429 Too Many Request: 客户端发送的请求过多。

431 Request Header Fields Too Large 请求头的字段内容太大。

-   5xx 服务器端发生错误

500 Internal Server Error: 仅仅告诉你服务器出错了，出了啥错咱也不知道。

501 Not Implemented: 表示客户端请求的功能还不支持。

502 Bad Gateway: 服务器自身是正常的，但访问的时候出错了，啥错误咱也不知道。

503 Service Unavailable: 表示服务器当前很忙，暂时无法响应服务。

## http 的特点、缺点

特点：

-   灵活可扩展。1.语义上的自由。只规定了基本格式，如空格分隔、换行分隔，其他没有限制。传输形式的多样性，传输文本、图片、视频等任何数据。
-   可靠传输 基于 tcp/ip 的可靠性
-   请求-应答 一发一收 有来有回
-   无状态 这里的状态指通信过程的上下文信息，每次请求都是独立的，无关的。不需要保留状态信息。

缺点：

-   无状态 在需要长连接的场景下，需要保存上下文，以免传输重复的信息，这时候无状态就是缺点。但是对于仅用于获取一些数据的请求来说，无状态减少了网络开销。
-   明文传输 报文传输不使用二进制数据，而是文本形式 易暴漏信息，wifi 陷阱就是利用此缺点
-   队头阻塞问题 当 http 开启长连接时，共用一个 tcp 连接，同一时刻只能处理一个请求，当前请求耗时过长时，其他的请求只能出于阻塞状态，也是著名的对头阻塞问题，

## accept 字段

### 数据格式

http 的支持非常多的数据格式，但是返回不同格式的数据，客户端需要准确的知道格式方便解析，就是利用 accept 字段。我们常见的 mime 标准，多用途互联网邮件扩展。它首先用在浏览器中，对于 http 也是通用的。http 从 mime 中取了一部分来标记报文 body 的数据类型，这些类型体现在`accept`、`content-type`字段中，accept 字段是对于接收方的，content-type 是对于发送方的。

类型字段的取值大致有下列几类：

-   text：text/html, text/plain, text/css, text/javascript 等
-   image: image/gif, image/jpeg, image/png 等
-   audio/video: audio/mpeg, video/mp4 等
-   application: application/json, application/javascript, application/pdf, application/octet-stream

### 压缩方式

当然一般这些数据都是会进行编码压缩的，采取什么样的压缩方式就体现在了发送方的 Content-Encoding 字段上， 同样的，接收什么样的压缩方式体现在了接受方的 Accept-Encoding 字段上。这个字段的取值有下面几种：

-   gzip: 当今最流行的压缩格式
-   deflate: 另外一种著名的压缩格式
-   br: 一种专门为 HTTP 发明的压缩算法

```
// 发送端
Content-Encoding: gzip
// 接收端
Accept-Encoding: gizp
```

### 支持语言

对于发送方而言，还有一个 Content-Language 字段，在需要实现国际化的方案当中，可以用来指定支持的语言，在接受方对应的字段为 Accept-Language。如:

```
// 发送端
Content-Language: zh-CN, zh, en
// 接收端
Accept-Language: zh-CN, zh, en
```

### 字符集

最后是一个比较特殊的字段, 在接收端对应为 Accept-Charset，指定可以接受的字符集，而在发送端并没有对应的 Content-Charset, 而是直接放在了 Content-Type 中，以 charset 属性指定。如:

```
// 发送端
Content-Type: text/html; charset=utf-8
// 接收端
Accept-Charset: charset=utf-8
```

![总结](./image/accept.jfif)

## 对于定长和不定长的数据，HTTP 是怎么传输的？

### 定长包体

对于定长包体而言，发送端在传输的时候一般会带上 Content-Length, 来指明包体的长度。

使用 nodejs 服务器模拟

```js
const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
    if (req.url === "/") {
        res.setHeader("content-type", "text/plain");
        res.setHeader("content-length", 10);
        res.write("helloworld");
    }
});

server.listen(8080, () => {
    console.log("服务已启动");
});
```

启动后访问 localhost:8080,浏览器中显示 helloworld
这是长度正确的情况，那不正确的情况是如何处理的呢？

我们试着把这个长度设置的小一些:

res.setHeader('Content-Length', 8);
重启服务，再次访问，现在浏览器中内容如下:

hellowor
那后面的 ld 哪里去了呢？实际上在 http 的响应体中直接被截去了。

然后我们试着将这个长度设置得大一些:

res.setHeader('Content-Length', 12);
此时浏览器显示如下该网页无法正常运作

直接无法显示了。可以看到 Content-Length 对于 http 传输过程起到了十分关键的作用，如果设置不当可以直接导致传输失败。

### 不定长包体

对于不定长包体，需要介绍 Transfer-Encoding: chunked 字段。

表示分块传输数据，设置这个字段后会自动产生两个效果:

-   Content-Length 字段会被忽略
-   基于长连接持续推送动态内容

还是上方例子，替换如下代码

```js
res.setHeader("Content-Type", "text/html; charset=utf8");
res.setHeader("Content-Length", 10);
res.setHeader("Transfer-Encoding", "chunked");
res.write("<p>来啦</p>");
setTimeout(() => {
    res.write("第一次传输<br/>");
}, 1000);
setTimeout(() => {
    res.write("第二次传输");
    res.end();
}, 2000);
```

效果是先展示来啦，然后依次显示第一次，第二次。

使用抓包结果，响应头字段会有 connection：keep-alive

## http 处理大文件传输

总体是采用`范围请求`的方案。允许请求一部分数据。

需要服务器支持范围请求，就是返回一个响应头 `accept-ranges: none` 用来告知客户端是支持范围请求的。

### range 字段拆解

对于客户端而言，需要指定请求哪一部分，通过 range 请求头字段确定，格式为 bytes=x-y。

-   0-499 表示从开始到第 499 个字节。
-   500- 表示从第 500 字节到文件终点。
-   -100 表示文件的最后 100 个字节。

服务器收到请求之后，首先验证范围是否合法，如果越界了那么返回 416 错误码，否则读取相应片段，返回 206 状态码。

同时，服务器需要添加 Content-Range 字段，这个字段的格式根据请求头中 Range 字段的不同而有所差异。

具体来说，请求单段数据和请求多段数据，响应头是不一样的。

举个例子:

// 单段数据
Range: bytes=0-9
// 多段数据
Range: bytes=0-9, 30-39

接下来我们就分别来讨论着两种情况。

### 单段数据

对于单段数据的请求，返回的响应如下:

HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

i am xxxxx
值得注意的是 Content-Range 字段，0-9 表示请求的返回，100 表示资源的总大小，很好理解。

### 多段数据

接下来我们看看多段请求的情况。得到的响应会是下面这个形式:

HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes

--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101--
这个时候出现了一个非常关键的字段 Content-Type: multipart/byteranges;boundary=00000010101，它代表了信息量是这样的:

请求一定是多段数据请求
响应体中的分隔符是 00000010101
因此，在响应体中各段数据之间会由这里指定的分隔符分开，而且在最后的分隔末尾添上--表示结束。

以上就是 http 针对大文件传输所采用的手段。

## HTTP 中如何处理表单数据的提交？

在 http 中，有两种主要的表单提交的方式，体现在两种不同的 Content-Type 取值:

-   application/x-www-form-urlencoded
-   multipart/form-data

由于表单提交一般是 POST 请求，很少考虑 GET，因此这里我们将默认提交的数据放在请求体中。

### application/x-www-form-urlencoded

对于 application/x-www-form-urlencoded 格式的表单内容，有以下特点:

-   其中的数据会被编码成以&分隔的键值对
-   字符以 URL 编码方式编码。

如： "a%3D1%26b%3D2"

### multipart/form-data

对于 multipart/form-data 而言:

请求头中的 Content-Type 字段会包含 boundary，且 boundary 的值有浏览器默认指定。例: Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe。
数据会分为多个部分，每两个部分之间通过分隔符来分隔，每部分表述均有 HTTP 头部描述子包体，如 Content-Type，在最后的分隔符会加上--表示结束。
相应的请求体是下面这样:

```
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
----WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
----WebkitFormBoundaryRRJKeWfHPGrS4LKe--
```

## HTTP1.1 如何解决 HTTP 的队头阻塞问题？

### 什么是 HTTP 队头阻塞？

HTTP 传输是基于请求-应答的模式进行的，报文必须是一发一收，但值得注意的是，里面的任务被放在一个任务队列中串行执行，一旦队首的请求处理太慢，就会阻塞后面请求的处理。这就是著名的 HTTP 队头阻塞问题。

### 并发连接

对于一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其它所有任务。在 RFC2616 规定过客户端最多并发 2 个连接，不过事实上在现在的浏览器标准中，这个上限要多很多，Chrome 中是 6 个。

但其实，即使是提高了并发连接，还是不能满足人们对性能的需求。

### 域名分片

一个域名不是可以并发 6 个长连接吗？那我就多分几个域名。

比如 content1.sanyuan.com 、content2.sanyuan.com。

这样一个 sanyuan.com 域名下可以分出非常多的二级域名，而它们都指向同样的一台服务器，能够并发的长连接数更多了，事实上也更好地解决了队头阻塞的问题。

## cookie

http 是无状态的协议，但是与服务端交互还是需要保留一些状态。cookie 就是其中的一个选项。

cookie 其实就是保留在浏览器中存储的一个键值对形式的文本文件。cookie 是存储在域名和路径下的，请求同一域名下会携带该域名下的 cookie 数据。同时在服务端响应请求时，会返回一个 set-cookie 字段，用于向客户端本地写入 cookie

```
// 请求头
Cookie: a=xxx;b=xxx
// 响应头
Set-Cookie: a=xxx
set-Cookie: b=xxx
```

### cookie 属性

#### 有效期

Cookie 的有效期可以通过 Expires 和 Max-Age 两个属性来设置。

Expires 即过期时间
Max-Age 用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算。
若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

#### 作用域

关于作用域也有两个属性: Domain 和 path, 给 Cookie 绑定了域名和路径，在发送请求之前，发现域名或者路径和这两个属性不匹配，那么就不会带上 Cookie。值得注意的是，对于路径来说，/表示域名下的任意路径都允许使用 Cookie。

#### 安全相关

如果带上 Secure，说明只能通过 HTTPS 传输 cookie。

如果 cookie 字段带上 HttpOnly，那么说明只能通过 HTTP 协议传输，不能通过 JS 访问，这也是预防 XSS 攻击的重要手段。

相应的，对于 CSRF 攻击的预防，也有 SameSite 属性。

SameSite 可以设置为三个值，Strict、Lax 和 None。

a. 在 Strict 模式下，浏览器完全禁止第三方请求携带 Cookie。比如请求 sanyuan.com 网站只能在 sanyuan.com 域名当中请求才能携带 Cookie，在其他网站请求都不能。

b. 在 Lax 模式，就宽松一点了，但是只能在 get 方法提交表单况或者 a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。

c. 在 None 模式下，也就是默认模式，请求会自动携带上 Cookie。安全相关
![http](./image/http.awebp)
![http](./image/http1.awebp)
![http](./image/640.jfif)

### cookie 缺点

1. 容量缺陷。Cookie 的体积上限只有 4KB，只能用来存储少量的信息。

2. 性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过 Domain 和 Path 指定作用域来解决。

3. 安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在 HttpOnly 为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

## http 代理

在客户端与真实服务器之间加一层服务器处理

### 好处

1. 负载均衡 向客户端暴漏一个代理服务器地址用于请求。而从客户端发过来的请求具体要请求哪台真实服务器是不一定的。接收到的请求会被代理服务器处理为具体向哪台真实服务器发送，以保证每台服务器负载尽量平均。具体算法有很多
2. 保障安全。对于非法请求，可以做一次过滤；并且对于发现源服务器有故障的可以及时剔除。
3. 中转缓存，不必每次请求都耗费资源

### 相关的头部字段

#### Via

代理服务器需要标明自己的身份，在 HTTP 传输中留下自己的痕迹，怎么办呢？

通过 Via 字段来记录。举个例子，现在中间有两台代理服务器，在客户端发送请求后会经历这样一个过程:

客户端 -> 代理 1 -> 代理 2 -> 源服务器
在源服务器收到请求后，会在请求头拿到这个字段:

Via: proxy_server1, proxy_server2
而源服务器响应时，最终在客户端会拿到这样的响应头:

Via: proxy_server2, proxy_server1
可以看到，Via 中代理的顺序即为在 HTTP 传输中报文传达的顺序。

#### X-Forwarded-For

字面意思就是为谁转发, 它记录的是请求方的 IP 地址(注意，和 Via 区分开，X-Forwarded-For 记录的是请求方这一个 IP)。

#### X-Real-IP

是一种获取用户真实 IP 的字段，不管中间经过多少代理，这个字段始终记录最初的客户端的 IP。

相应的，还有 X-Forwarded-Host 和 X-Forwarded-Proto，分别记录客户端(注意哦，不包括代理)的域名和协议名。

## 013: 如何理解 HTTP 缓存及缓存代理？

缓存后结果。首先通过 Cache-Control 验证强缓存是否可用

如果强缓存可用，直接使用
否则进入协商缓存，即发送 HTTP 请求，服务器通过请求头中的 If-Modified-Since 或者 If-None-Match 这些条件请求字段检查资源是否更新
若资源更新，返回资源和 200 状态码
否则，返回 304，告诉浏览器直接从缓存获取资源

## 什么是跨域？浏览器如何拦截响应？如何解决？

在前后端分离的开发模式中，经常会遇到跨域问题，即 Ajax 请求发出去了，服务器也成功响应了，前端就是拿不到这个响应

### 跨域

浏览器遵循同源政策(scheme(协议)、host(主机)和 port(端口)都相同则为同源)。非同源站点有这样一些限制:

-   不能读取和修改对方的 dom
-   不能访问对方的 cookie、indexDB、localStorage
-   限制 XMLHttpRequest 请求。

当浏览器向目标 URI 发 Ajax 请求时，只要当前 URL 和目标 URL 不同源，则产生跨域，被称为跨域请求。

跨域请求的响应一般会被浏览器拦截，注意，是被浏览器拦截，响应其实是成功到达客户端了。

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
