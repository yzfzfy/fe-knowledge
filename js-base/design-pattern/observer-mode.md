# 发布订阅模式

又叫观察者模式。他定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

优点：发布-订阅模式一为时间上的解耦，二为对象之间的解耦。它的应用非常广泛，既可以用在异步编程中，也可以帮助我们完成更加松耦合的代码编写。发布-订阅模式还可以用来帮助实现一些其他的设计模式，例如中介者模式。
缺点：创建订阅者本身要消耗一定的时间和内存，而当你订阅一个消息后，也许此消息最后都没有发生，但订阅者依然存在于内存中，造成了一种浪费。发布-订阅模式虽然弱化了对象之间的联系，但过度使用的话，对象和对象之间的必要联系也将深埋在背后，会导致程序难以追踪维护和理解。

## 案例

常用的在 dom 上绑定事件就是浏览器 dom 实现的观察这模式

```js
// 自定义发布-订阅
// 背景：小明最近看中一套房子，到销售中心才告知已经卖完了，好在销售楼中心准备出后期工程，但不知道什么时候出，只要小明留下自己的联系方式，楼盘开启后销售中心会通知小明相关信息。而对于其他像小明那样的客户，只要同样留下联系方式都可以收到相关信息。

// 自定义发布-订阅事件
var sales = {
    clientList: {},
    listen: function (key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger: function () {
        var type = Array.prototype.shift.call(arguments);
        var fns = this.clientList[type];
        if (!fns || fns.length < 1) {
            return false;
        }

        for (let index = 0; index < fns.length; index++) {
            fns[index].apply(this, arguments);
        }
    },
};

// 订阅
sales.listen('88', function (price) {
    console.log('88平米的房子价格是：' + price);
});
sales.listen('100', function (price) {
    console.log('100平米的房子价格是：' + price);
});

// 发布
sales.trigger('88', 200000); // 88平米的房子价格是：200000
sales.trigger('100', 300000); // 100平米的房子价格是：300000

// 取消订阅
var sales = {
    clientList: {},
    listen: function (key, fn) {},
    trigger: function () {},
    remove: function (type) {
        var fns = this.clientList[type];
        if (!fns || fns.length < 1) {
            return false;
        }
        // 全部取消订阅
        fns.length = 0;
    },
};
```

```js
// 网站登录
// 一个商场网站，有头部header，有导航nav，有购物车cart，有消息列表message等等模块度依赖于登录成功后的用户信息。而用户不知道什么时候会登陆。需要将以上各个模块与登录模块做一个发布-订阅
// 一个真实的发布-订阅例子：网站登录
var login = {
    clientList: {},
    listen: function (key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger: function () {
        var type = Array.prototype.shift.call(arguments);
        var fns = this.clientList[type];
        if (!fns || fns.length < 1) {
            return false;
        }
        for (let index = 0; index < fns.length; index++) {
            fns[index].apply(this, arguments);
        }
    },
};

// 头部
var header = (function () {
    login.listen('loginSuccess', function (data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function (avatar) {
            console.log('设置header头像：' + avatar);
        },
    };
})();

// 导航
var nav = (function () {
    login.listen('loginSuccess', function (data) {
        nav.setAvatar(data.avatar);
    });
    return {
        setAvatar: function (avatar) {
            console.log('设置nav头像：' + avatar);
        },
    };
})();

// 购物车
var cart = (function () {
    login.listen('loginSuccess', function (data) {
        cart.getOrders(data);
    });
    return {
        getOrders: function (data) {
            console.log('获取' + data.name + '的购物车订单列表');
        },
    };
})();

setTimeout(function () {
    // 依次输出
    // 设置header头像：https://www.baidu.com/1.jpg
    // 设置nav头像：https://www.baidu.com/1.jpg
    // 获取AAA的购物车订单列表
    login.trigger('loginSuccess', { name: 'AAA', avatar: 'https://www.baidu.com/1.jpg' });
}, 1500);
```
