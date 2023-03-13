# 命令模式

## 定义

命令模式是最简单和优雅的模式之一，命令模式中的命令指的是一个执行某些特定事件的指令

## 应用场景

有时候需要向某些对象发送请求，但是并不知道请求的接受者是谁，也不知道被请求的操作是什么。此时希望有一种松耦合的方式来设计程序，使得请求发送者和接受者能够消除彼此之间的耦合关系。

## 案例

```js
// 有一个用户界面程序，该用户界面上至少有数十个Button按钮，因为项目比较复杂，所以我们觉得让某个程序员负责Button按钮的绘制，另外一个程序员负责编写点击按钮的具体行为，这些行为都将封装在对象里。

// 面向对象版本
var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
var button3 = document.getElementById('button3');
// 设置命令
var setCommand = function (button, command) {
    button.onclick = function () {
        command.execute();
    };
};
// 具体行为
var MenuBar = {
    refresh: function () {
        console.log('刷新界面');
    },
};
var SubMenu = {
    add: function () {
        console.log('添加子菜单');
    },
    remove: function () {
        console.log('删除子菜单');
    },
};
// 封装具体行为到对象中
var RefreshBarCommand = function (receiver) {
    this.receiver = receiver;
};
RefreshBarCommand.prototype.execute = function () {
    this.receiver.refresh();
};
var AddSubMenuCommand = function (receiver) {
    this.receiver = receiver;
};
AddSubMenuCommand.prototype.execute = function () {
    this.receiver.add();
};
var RemoveSubMenuCommand = function (receiver) {
    this.receiver = receiver;
};
RemoveSubMenuCommand.prototype.execute = function () {
    this.receiver.remove();
};
// 传入命令接受者
var refreshBarCommand = new RefreshBarCommand(MenuBar);
var addSubMenuCommand = new AddSubMenuCommand(SubMenu);
var removeSubMenuCommand = new RemoveSubMenuCommand(SubMenu);
setCommand(button1, refreshBarCommand); // 点击按钮输出：刷新界面
setCommand(button2, addSubMenuCommand); // 点击按钮输出：添加子菜单
setCommand(button3, removeSubMenuCommand); // 点击按钮输出：删除子菜单
```

## 理解

从 setCommand 函数中看出，button 和 command 都是以函数参数传入的，也就是说命令模式中发出命令的对象和命令的真实执行程序都是不定的，也就是动态的为不同的对象赋予不同的命令。也就是达到了松耦合的目的。
