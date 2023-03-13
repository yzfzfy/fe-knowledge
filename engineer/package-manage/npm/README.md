# 包管理

## 链接

[npm docs](https://docs.npmjs.com/)

## 命令

- [npm init]初始化一个目录为 npm 包目录，询问一系列问题生成 package.json 文件的字段，生成 package.json。如果这些字段值为默认值，则用-y 参数。（package.json 中有哪些字段可以自定义，参考[Customizing the package.json questionnaire](https://docs.npmjs.com/creating-a-package-json-file#customizing-the-packagejson-questionnaire)）
- [*^~] 版本号 [npm 版本号规则](https://semver.npmjs.com/)
- [npm dist-tag add <package-name>@<version> [<tag>]] 为一个包的某个版本增加 tag，如： npm dist-tag add lodash@3.0.0 latest。使用是就可以这样使用 `npm install lodash@latest`
- [npm install <package-name> --save-prod(default)| --save-dev]安装依赖并写到 package 依赖字段中
- [npm update <package_name>] 更新项目中所有依赖的包到最新版本,加 packages_name 则是更新指定包
- [npm outdated] 查看项目中所有包是否都是最新版本, 如果是则不会有任何输出
- [npm search <terms>] 通过关键字搜索 npm 包，这个关键字需出现在包的 description 字段中
- [npm link] 本地开发一个包并在本地测试（不想在完成之前一直 rebuild）时使用，目录结构如下
- [发包流程] 代码修改完成后，执行 npm version [patch|minor|major]，这里就是自动修改 package.json 中的版本号，也可以手动修改,然后执行 npm login 登录在当前 registry 下的账户，然后执行 npm publish 即可。
- [npm view <package—name>] 查看包的信息。
- [npm whoami] 显示当前登录的用户信息 npm logout 退出登录
- [npx] npx 是 npm5.2.0 版本新增的一个工具包，定义为 npm 包的执行者，相比 npm，npx 会自动安装依赖包并执行某个命令。npx 会在当前目录下的./node_modules/.bin 里去查找是否有可执行的命令，没有找到的话再从全局里查找是否有安装对应的模块，全局也没有的话就会自动下载对应的模块，如 create-react-app，npx 会将 create-react-app 下载到一个临时目录，用完即删，不会占用本地资源。

- [npm publish] 自己开发一个包需要发布到 npm 中，公网开发者可以下载包。npm login 输入账号密码后，一般在 npm 的 prepublish 生命周期执行 build 命令后发布包。
- [npm ls] 罗列出依赖的包。加--depth 参数表示层级 0 开始。-g 表示罗列全局的包。比如`npm ls -g --depth 0`逻辑出全局安装的包，只展示一级。

```
+--project
    a+--开发的将要发布的包
        ...
        packages.json
    b+--实际想要使用a包的项目
        ...
        package.json
```

首先在 a 工程下执行`npm link`, 然后在 b 工程下执行`npm link a工程下package.json中的name`,如果两步合成一步就是在 b 工程下执行`npm link ../a`

## package.json 字段

- `files` 发布包时需要发布的文件或整个目录。固定的四个文件默认会被包括
  - package.json
  - README
  - LICENSE
  - main 字段指定的文件
    .gitignore 文件和.npmignore 文件也会被解析，作为忽略文件。.npmignore 语法类似.gitignore,在根目录中这两个文件定义的优先级不如 files 字段，即就算 gitignore 忽略，而 files 包括了，最终还是会包括其中。但是如果 npmignore 子目录，那么就相反。npmignore 的优先级低于 gitignore
- `main`字段是引用包时的默认导出入口文件，值为相对于根目录的相对路径，如果没有指定该值，那么就是根目录下的 index.js 文件。
- `browser` 当该包是用于在浏览器中运行时（假如用到 window 等特有环境变量），不用 main 字段而使用 browser 字段，
- `bin` 如果该包需要为安装该包的机器的 Path 中安装可执行的全局命令时使用该字段，字段值为一个对象，key 为命令名称，value 为命令入口文件。当不作为全局命令使用，而是被其他包作为依赖安装，可以通过`npm exac`或 npm run-script 执行。（注意：命令入口文件内容必须以`#!/usr/bin/env node`开头，才可能识别为一个 node 可执行文件）
- `repository` 指示源码的仓库
- `scripts` 定义开发改包常用的脚本命令.
  - 这些命令通过`npm run-script <stage>`执行,简写是`npm run <stage>`。
  - 当一个命令名为 compress, 可添加两个命令用于在 compress 执行前后执行。precompress 与 postcompress，增加前缀的方式。
  - npm 内部有一些生命周期 `install`、`publish`、`pack` 等和内置命令`prepare` `prepublish` `prepublishOnly` `prepack` `postpack`
  - 如果依赖的包中有可执行命令，那么这些命令就会放在.bin 目录中，在 scripts 中可使用这些命令。
  - 脚本命令执行退出码为非 0 时，将终止进程
- `config` https://docs.npmjs.com/cli/v8/configuring-npm/package-json#config
- `dependencies`
- `devDependencies`
- `peerDependencies`>。如果你依赖别的框架或库，将它设置为 `peerDependency`,你应该外置框架。然而，这样做后，你的库只有在开发人员自行安装你需要的框架后才能工作。设置 peerDependencies 让他们知道他们需要安装的框架。- 例如，如果你在创建一个 React 库：

```json
{
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

你应该以书面形式来体现这些依赖；例如，**npm v3-v6 不安装 peer dependencies，而 npm v7+ 将自动安装 peer dependencies。**

- `bundledDependencies`
- `optionalDependencies`
- `overrides` 复写使用包的版本 https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides
- `engines` 指定包可正常使用的引擎(node/npm)的版本,如：

```js
    {
        "engines": {
            "node": ">=0.10.3 <15",
            "npm": "~1.0.20"
        }
    }
```

这里指定的版本并不是强制的，如果安装该包时，环境不满足也只是会发出 warning。要想强制使用`engine-strict`配置

- `os` 模块运行操作系统 `"os": ["linux", "!win32"]`(!表示非)
- `cpu` 同上`os`
- `private` 当该值为 true 时，发布该包会失败.想要只允许特定 registry 发布，那么配合 publishConfig 使用。"publishConfig： {registry: 'url'}"
- `publishConfig` 发布包的一些特定配置
- `workspaces` 当一个项目管理多个包时，这个项目相当于一个 workspace，目录结构可能是

```js
.
+-- package.json
    `-- packages
        +-- a
        |   `-- package.json
        `-- b
            `-- package.json
```

- 一些默认值 DEFAULT VALUES https://docs.npmjs.com/cli/v8/configuring-npm/package-json#default-values

package.json 中定义的所有字段，在运行程序时，都会在环境变量中对应生成一个环境变量。如 name 字段生成 process.env.npm_package_name.嵌套对象在生成时不会为一个环境变量的值设置为一个对象，而是 key 一层层拼装，知道值是一个字符串.如 scripts:{test: ''}生成为 process.env.npm_package_scripts_test

## package-lock.json 字段[待补充]

[链接](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json)
该文件是自动生成，生成/修改的时机是当执行一些操作会修改 node_modules 或 package.json 中的内容。发布包时该文件会被忽略。描述了相关包的版本，提交到代码仓中团队共享为了团队中依赖树保持一致（如果某些依赖更新时，没有该文件，不同成员安装的包会不同）。该文件的好处有：

1. 描述项目的依赖树，保证团队间保持一致。
2. 记录 node_modules 中的状态，查看历史记录
3. 可通过源码控制 diff 查看依赖改变。
4. 新 clone 项目无需重复解析包数据，直接下载包
5. 无需解析 package.json,提高效率

```js
// “”中是根目录依赖的包，其他包不在“”中，直接相对路径列出
{
    "name": "",
    "version": "",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
        "": {
            "dependencies": [],
            "devDependencies": []
        },
        "./node_modules/xxx"
    },
    "dependencies": {}
}
```
