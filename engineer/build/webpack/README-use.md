# webpack

## 简述

    > Webpack is used to compile JavaScript modules.

它是一个构建工具。可以通过 Cli、API 使用。为 webpack 传入 options，webpack 大体会经过
`初始化参数`=>`编译准备阶段`=>`编译`=>`编译完成`=>`输出文件`几个步骤。

## 常用的配置参数

```js
module.exports = function(isEnvProduction) {
    return {
        // process.env.NODE_ENV
        // development: 开发环境使用，如开发环境开启 HMR
        // production: 生产环境，如打包时开启压缩代码等插件
        mode: 'production | development',
        // 打包入口文件，从该文件开始解析依赖，构建依赖树。多入口打包
        entry: '',
        // 是否生成 sourceMap，用于调试
        devtool: '',
        // 打包结果输出目录。
        output: '',
        devtool: '',
        // 压缩代码配置、分包配置
        optimization: {},
        // 解析模块。常用设置@Components @Pages 别名
        resolve: {};
        // 用于配置解析文件的 loader
        modules: [],
        // 常见的 HtmlWebpackPlugin 插件
        plugins: [],
    }
}
```

## 目前实际项目中用过/改过的配置项

### `devtool`: 生成 source 文件

```js
`devtool: isEnvProduction ? (shouldUseSourceMap ? 'source-map' : false) : isEnvDevelopment && 'cheap-module-source-map'`;
```

### `output.publicPath`

```js
/* 为项目中的所有资源指定一个基础路径，它被称为公共路径(publicPath)。一般默认*就是'/'，修改为'/scene'后，html 中引用 js 等的路径为`/scene/static/....*`.主要修改该配置时，需要修改项目部署目录的 nginx 配置等，以防资源找不到。
 */
```

### `optimization.splitChunks`。对公共的依赖库，分割打包，防止重复打包，增加包体积。

```js
splitChunks: {
    chunks: 'all',
    name: false,
    cacheGroups: {
        'oss-ui': {
            name: 'chunk-oss-ui',
            test: /[\\/]node_modules[\\/](oss-ui|antd|oss-web-common|@ant-design)[\\/]/,
            priority: 20,
            chunks: 'all',
            enforce: true,
        },
        base: {
            name: 'chunk-base',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // 只打包初始时依赖的包
            enforce: true,
        },
        common: {
            name: 'chunk-common',
            test: /[\\/]src[\\/]components[\\/]/,
            enforce: true,
            priority: 2,
            reuseExistingChunk: true,
        },
        default: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -2,
            reuseExistingChunk: true,
        },
    },
},
```

### `module.rules`:

```js
/* 检测特定类型文件(test 字段)，使用特定的 loader 处理(loader 字段)。loader 执行顺序是从右向左。比如处理样式文件，loader 书写：'style-loader','css-loader','less-loader'*/
```

### `plugins`:

```js
/*在 webpack 的不同生命周期执行任务。如 `HtmlWebpackPlugin`、`ESLintPlugin`、`BundleAnalyzerPlugin` 等 */
```

## 目前对于编译过程的粗浅理解

### webpack 函数

有默认的参数值，会将传入的 option 和默认的值合并。`Object,assign({}, defaultOption, options)`

### 初始化编译器

`require('webpack')`后返回是一个 webpack 函数，使用方式是`webpack(finalOptions)`,执行后返回的是一个`compiler`,

```js
class Compiler{
    constructor{options}{
        this.options = options;
    }
}

const compiler = webpack(options);

// 开始编译
compiler.run(() => {});

function webpack(options) {
    const compiler = new compiler(options)

    ...
    ...

    return compiler;
}

```

### 编译器功能

- 注册 options 中传入的插件
- 执行编译，编译过程中特定时期触发特定的 plugin
- 生成编译结果对象。

```js
//
// 基于https://webpack.js.org/contribute/writing-a-plugin/一个最简自定义插件的结构推测
// compiler需要具备的内容:

class Compiler{
    constructor{options}{
        this.options = options;

        this.hooks = {
            run: {},
            emit: {},
            ...
        }
    }

    run(callback){}
}

function loadPlugins(plugins, compiler) {
    plugins.forEach(plugin => {
        plugin.apply(compiler)
    })
}

// 插件实例中的apply方法，是在compiler的hooks中的某个属性tap了一个方法
compiler.hooks.run.tap('pluginName', () => {});

// run这个hook中包含tap方法。查文档后，是引用tapable库后，实例化的hook中key
// 类似 这种处理
import { SyncHook } from 'tapable';
{
    this.hooks = {
        run: new SyncHook()
    }
}
// Hook 类
class Hook {
	constructor(args = [], name = undefined) {
		this._args = args;
		this.name = name;
		this.taps = [];
		this.interceptors = [];
		this._call = CALL_DELEGATE;
		this.call = CALL_DELEGATE;
		this._callAsync = CALL_ASYNC_DELEGATE;
		this.callAsync = CALL_ASYNC_DELEGATE;
		this._promise = PROMISE_DELEGATE;
		this.promise = PROMISE_DELEGATE;
		this._x = undefined;

		this.compile = this.compile;
		this.tap = this.tap;
		this.tapAsync = this.tapAsync;
		this.tapPromise = this.tapPromise;
	}

    _tap(type, options, fn) {
		if (typeof options === "string") {
			options = {
				name: options.trim()
			};
		} else if (typeof options !== "object" || options === null) {
			throw new Error("Invalid tap options");
		}
		if (typeof options.name !== "string" || options.name === "") {
			throw new Error("Missing name for tap");
		}
		if (typeof options.context !== "undefined") {
			deprecateContext();
		}
		options = Object.assign({ type, fn }, options);
		options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

	tap(options, fn) {
		this._tap("sync", options, fn);
	}
}

// SyncHook类
function SyncHook(args = [], name = undefined) {
	const hook = new Hook(args, name);
	hook.constructor = SyncHook;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE;
	return hook;
}


// 可以看到tap方法传入的函数是在tapable代码中也是注册了一个回调函数的形式，
// 在编译器走到某个阶段，就触发订阅的回调函数即可。
// 所以说：webpack的插件的执行是采用发布订阅的模式。
```
