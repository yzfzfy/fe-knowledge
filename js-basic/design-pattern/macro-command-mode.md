# 宏命令

宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行多个命令。

## 实现

```js
// 宏命令
// 基础命令
var CloseDoorCommand = {
    execute: function () {
        console.log('关门');
    },
};
var OpenTVCommand = {
    execute: function () {
        console.log('打开电视');
    },
};
var OpenQQComand = {
    execute: function () {
        console.log('登QQ');
    },
};

// 宏命令
var MacroCommand = function () {
    return {
        commandList: [],
        add: function (command) {
            this.commandList.push(command);
        },
        execute: function () {
            for (let index = 0; index < this.commandList.length; index++) {
                this.commandList[index].execute();
            }
        },
    };
};

// 添加命令到宏命令
var macroCommand = MacroCommand();
macroCommand.add(CloseDoorCommand);
macroCommand.add(OpenTVCommand);
macroCommand.add(OpenQQComand);

// 执行宏命令
macroCommand.execute(); // 依次输出：关门 打开电视 登QQ
```
