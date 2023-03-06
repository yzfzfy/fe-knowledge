# webpack 实现实时编译的几种方式

如果我们每次改动一个文件就手动执行一下 webpack 打包的话，效率未免也太低了。所以需要实时编译。常用在开发模式下改动文件后需要实时编译查看效果。

- 使用 webpack 的 watch 模式
  该模式下当代码改动后会启用自动编译，自动替换掉 dist 下代码。注意`output.publicPath`的值不能是`/`。那么打开 dist 下的 index.html 会看到页面效果。但是缺点就是**编译后必须手动刷新页面**。

```js
"scripts": {
    ...
    "watch": "webpack --watch",
    ...
},
```

- 使用`webpack-dev-server`库
  在 webpack 配置中增加`devServer`配置。webpack 会识别该配置启动本地服务

```js
{
    ...
    devServer: {
        // 告诉服务从哪个文件下找文件
        static: './dist'
    }
    ...
}
```

```json
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch": "webpack --watch",
        // 启动server
        "start": "webpack serve --open",
        "build": "webpack"
    },
```

- 使用`webpack-dev-middleware`
  该库就是用来把 webpack 打包后的文件发送到本地服务，用来实时查看。其实 webpack-dev-server 内置了该库。也就是用它来将编译的文件发送到到服务的。如果用该库，则服务的启动初始化等支持更多自定义（初始化、启动服务，配置端口号等等）

```js
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const config = require("./webpack.config.js");
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!\n");
});
```

```json
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch": "webpack --watch",
        "start": "webpack serve --open",
        // 自定义server
        "server": "node server.js",
        "build": "webpack"
    },
```
