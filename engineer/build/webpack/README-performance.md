# 性能优化

## 体积优化

### 压缩

## 速度优化

### 减少查找过程

-   resolve.extensions 导入没有后缀的文件时，webpack 需要带上后缀去查找文件。查找的顺序是按照配置的 extensions 顺序从前往后查找，webpack 默认支持的后缀是 js、json。

虽然 extensions 会优先查找数组内的值，但是多个扩展 webpack 会调用多次文件查找，会减慢打包速度。

-   优化 resolve.modules 配置 webpack 解析模块时应该搜索的目录，绝对路径和相对路径都可以，使用绝对路径后，将只在给定目录中搜索，从而减少模块搜索层级。
-   resolve.alias 检查查找过程。项目常用到的相对路径可以使用 alias 减少查找过程。

### 缩小构建目标

不必要解析的文件排除掉，比如在使用 loader 时，将目标解析的文件类型通过 includes 和 excludes 设置，尽量精确，对于不在范围内的文件不加入解析编译的过程。

### 多线程构建

webpack 是运行在 nodejs 上的，它是单线程模型。如果同一时间处理多个任务，可以明显缩短构建时间。

-   happypack 使用 happypack 后，webpack 每解析一个模块，会将该模块和他的依赖分配给 worker 线程中，处理完成之后，将处理好的资源返回给 happywebpack 的主线程，从而加快打包速度。
-   thread-loader webpack 官方推出的多进程方案。用来代替 happypack。和 happypack 原理差不多，使用上是将 thread-loader 加在每个 rule 项的 use 值的第一项。

### 缓存

可以开启相应 loader 或者 plugins 的缓存，目标是提升二次构建的速度。常用的有

-   babel-loader 开启缓存
-   terser-webpack-plugin 开启缓存
-   使用 cache-loader

如果项目中有缓存的话，在 node_modules 下会有相应的.cache 目录来存放响应的缓存。

#### babel-loader

首先我们开启 babel-loader 缓存，通过设置 loader 的 cacheDirectory 为 true

```js
module: {
    rules: [
        {
            test: /\.jsx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                    },
                },
            ],
        },
    ];
}
```

首次构建后，在 node_modules 下生成了一个.cache 目录，其中存放了 babel 的缓存文件。再次构建时，时间缩短。

#### TerserPlugin

将 TerserPlugin 中的 cache 设为 true，就可以开启缓存：

```js
optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
        cache: true,
      }),
    ],
},
```

同样的首次打包后在 node_modules 中生成了该插件的缓存,文件夹命名为插件名称`terser-webpack-plugins`

### source-map 设置

### 其他

#### tree-shaking

#### 设置 external 包

####
