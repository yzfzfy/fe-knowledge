# 组合模式

## 定义

组合模式将对象组合成树形结构，以表示"部分-整体"的层次结构。

对宏命令为例，请求从树最顶端的对象往下传递，如果当前处理请求的对象是叶对象，叶对象自身会对请求做出相应的处理。如果当前处理请求的是组合对象，则遍历该组合对象下的子节点，将请求继续传递给这些子节点。

## 实现

```js
// 组合模式案例：文件扫描
// 文件夹类
var Folder = function (name) {
    this.name = name;
    this.files = [];
};
Folder.prototype.add = function (file) {
    this.files.push(file);
};
Folder.prototype.scan = function () {
    console.log('开始扫描文件夹:' + this.name);
    for (let index = 0; index < this.files.length; index++) {
        this.files[index].scan();
    }
};
// 文件类
var File = function (name) {
    this.name = name;
};
File.prototype.add = function () {
    throw new Error('文件下面不能添加文件');
};
File.prototype.scan = function () {
    console.log('开始扫描文件：' + this.name);
};

var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('jQuery');
var folder3 = new Folder('重构与实现');
var folder4 = new Folder('NodeJs');

var file1 = new File('JavaScript设计模式');
var file2 = new File('精通jQuery');
var file3 = new File('JavaScript语言精粹');
var file4 = new File('深入浅出的Node.js');

folder1.add(file1);
folder2.add(file2);
folder4.add(file4);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);
folder.add(folder3);
folder.add(folder4);

// 执行扫描
// 开始扫描文件夹:学习资料
// 开始扫描文件夹:JavaScript
// 开始扫描文件：JavaScript设计模式
// 开始扫描文件夹:jQuery
// 开始扫描文件：精通jQuery
// 开始扫描文件：JavaScript语言精粹
// 开始扫描文件夹:重构与实现
// 开始扫描文件夹:NodeJs
// 开始扫描文件：深入浅出的Node.js
folder.scan();
```

## 理解

也就是递归遍历子节点，遇到能操作的节点就操作，否则继续往下遍历寻找对应类型子节点。
