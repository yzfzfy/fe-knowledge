# 代理模式

## 定义

> 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

代理模式的关键所在就是：当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象，替身对象作出一些请求后再把请求转接给本体对象

## 案例

```js
// 小明打算向女神表白，又怕直接被拒绝而尴尬，决定找女神的同学帮忙转接鲜花给女神

var Flower = function () {};

var xiaoming = {
    sendFlower: function (target) {
        var flower = new Flower();
        target.receive(flower);
    },
};
var classmate = {
    receive: function (flower) {
        girl.receive(flower);
    },
};
var girl = {
    receive: function (flower) {
        console.log('女神收到了花');
    },
};
xiaoming.sendFlower(classmate); // 输出女神收到了花
```

```js
// 保护代理
// 在代理模式中，替身对象能做到过滤一些对本体不合理的请求时，这种代理就叫保护代理
// 保护代理
function Flower() {}
function Person(name, age, salary) {
    this.age = age;
    this.name = name;
    this.salary = salary;
}
Person.prototype.sendFlower = function (target, person) {
    var flower = new Flower();
    target.receive(flower, person);
};
var person1 = new Person('www', 20, 4000);
var person2 = new Person('AAA', 25, 8000);
var person3 = new Person('BBB', 45, 16000);

var proxyObj = {
    receive: function (flower, person) {
        if (person.age >= 40) {
            console.log(person.name + ',你年龄太大了');
            return false;
        }
        if (person.salary < 5000) {
            console.log(person.name + ',你工资太低了');
            return false;
        }
        originObj.receive(flower);
        console.log(person.name + ',恭喜你,女神收下了你的花');
    },
};
var originObj = {
    receive: function (flower) {},
};
person1.sendFlower(proxyObj, person1); // 输出www,你工资太低了
person2.sendFlower(proxyObj, person2); // 输出AAA,恭喜你,女神收下了你的花
person3.sendFlower(proxyObj, person3); // 输出BBB,你年龄太大了
```

```js
// 用代理实现图片懒加载
var myImage = (function () {
    var image = document.createElement('img');
    document.body.appendChild(image);
    return {
        setSrc: function (src) {
            image.src = src;
        },
    };
})();

var proxyImage = (function () {
    var img = new Image();
    img.onload = function () {
        myImage.setSrc(this.src);
    };
    return {
        setSrc: function (src) {
            myImage.setSrc('file:///C:/Users/admin/Desktop/mask/img/7.jpg');
            img.src = src;
        },
    };
})();
proxyImage.setSrc('https://img1.sycdn.imooc.com/5c09123400014ba418720632.jpg');
```

```js
//缓存代理
// 缓存代理：计算乘积
var mult = function () {
    console.log('开始计算乘积');
    var sum = 1;
    for (var i = 0; i < arguments.length; i++) {
        sum = sum * arguments[i];
    }
    return sum;
};
var proxyMult = (function () {
    var cache = {};
    return function () {
        var args = Array.prototype.join.call(arguments, ',');
        if (cache.hasOwnProperty(args)) {
            return cache[args];
        }
        return (cache[args] = mult.apply(this, arguments));
    };
})();
console.log(proxyMult(1, 2, 3, 4)); // 输出：开始计算乘积 24
console.log(proxyMult(1, 2, 3, 4)); // 输出24
```

```js
// 代理工厂
// 缓存代理：计算乘积
var mult = function () {
    console.log('开始计算乘积');
    var sum = 1;
    for (var i = 0; i < arguments.length; i++) {
        sum = sum * arguments[i];
    }
    return sum;
};
var proxyMult = (function () {
    var cache = {};
    return function () {
        var args = Array.prototype.join.call(arguments, ',');
        if (cache.hasOwnProperty(args)) {
            return cache[args];
        }
        return (cache[args] = mult.apply(this, arguments));
    };
})();
console.log(proxyMult(1, 2, 3, 4)); // 输出：开始计算乘积 24
console.log(proxyMult(1, 2, 3, 4)); // 输出24
```

## 总结

代理就是顾名思义，想要的对象或行为藏在另在另外一个对象之内，想要找到源对象那就先通过代理对象，只不过保护代理是在代理对象上加些判断，缓存代理是在代理对象做缓存，代理工厂是代理了传入的函数，总之就是加了一层，就像服务器代理，正向代理是代理了客户端，是服务端不知道确定的请求来源是哪，而反向代理是代理了服务端，客户端请求都是发向代理服务器，然后由代理服务器分发到真实服务器。
