# 策略模式

## 定义

> 定义一系列算法，把他们一个一个封装起来，并且使他们可以相互替换。

简单理解：不同情况采用不同策略。

## 优点

1. 策略模式利用组合、委托和多态等技术的思想，可以有效的避免多重条件分支语句
2. 策略模式提供了对开放-封闭原则的完美支持，将算法封装在独立的策略类中，使它们易于切换、易于理解、易于扩展。
3. 策略模式中的算法也可以复用在系统的其他地方
4. 策略模式利用组合和委托来让 Context 拥有执行算法的能力，这也是继承的一种更轻便的替代方案。

## 案例

```js
// 基础表达意思版本
// 案例描述：某公司的年终奖是根据员工的工资基数和年底绩效来发放的。例如，绩效为S的人年终奖有4倍工资，绩效为A的人年终奖有3倍工资，绩效为B的人年终奖有2倍工资，财务部要求我们提供一段代码，来方便他们计算员工的年终奖。

// 计算奖金：JavaScript的完善版本
var strategy = {
    S: function (salary) {
        return salary * 4;
    },
    A: function (salary) {
        return salary * 3;
    },
    B: function (salary) {
        return salary * 2;
    },
};
var calcluateBouns = function (level, salary) {
    return strategy[level](salary);
};
console.log(calcluateBouns('S', 4000)); // 输出16000
console.log(calcluateBouns('A', 3000)); // 输出9000
console.log(calcluateBouns('B', 2000)); // 输出4000
```

```js
// 表单验证   1. 用户名(验证是否为空)  2. 密码(验证长度不能小于6位)  3. 手机号(验证是否是手机号格式)

// 策略模式案例：表单验证
var strategies = {
    isEmpty: function (value, errMsg) {
        if (value === '') {
            return errMsg;
        }
    },
    minLength: function (value, length, errMsg) {
        if (value.length < length) {
            return errMsg;
        }
    },
    isMobile: function (value, errMsg) {
        if (!/^1[34578]\d{9}$/.test(value)) {
            return errMsg;
        }
    },
};
var Validator = function () {
    this.cache = [];
};
Validator.prototype.add = function (dom, rule, msg) {
    var ary = rule.split(':');
    this.cache.push(function () {
        var strategy = ary.shift();
        ary.unshift(dom.value);
        ary.push(msg);
        return strategies[strategy].apply(dom, ary);
    });
};
Validator.prototype.run = function () {
    for (let index = 0; index < this.cache.length; index++) {
        var msg = this.cache[index]();
        if (msg) {
            return msg;
        }
    }
};

var validateFunc = function () {
    var validator = new Validator();
    validator.add(registerForm.username, 'isEmpty', '用户名不能为空');
    validator.add(registerForm.password, 'minLength:6', '密码长度不能小于6位');
    validator.add(registerForm.phone, 'isMobile', '手机号格式不正确');
    var errMsg = validator.run();
    return errMsg;
};

var submitBtn = document.getElementById('submitBtn');
var registerForm = document.getElementById('registerForm');
submitBtn.onclick = function () {
    var errMsg = validateFunc();
    if (errMsg) {
        console.log(errMsg);
        return false;
    } else {
        console.log('表单验证成功');
    }
};
```
