# 模板方法模式

## 定义

模板方法是一种只需使用继承就可以实现的非常简单的模式。模板方法由两部分组成，一部分是抽象的父类，另一部分是具体的子类。
通常而言，在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承抽象的父类，也继承了整个算法结构。

## 案例

泡咖啡的步骤：

1. 把水煮沸
2. 用沸水泡咖啡
3. 把咖啡倒进杯子
4. 加糖和牛奶

```js
// 泡咖啡
var Coffee = function () {};
Coffee.prototype.boilWater = function () {
    console.log('把水煮沸');
};
Coffee.prototype.brewCoffee = function () {
    console.log('冲泡咖啡');
};
Coffee.prototype.purInCup = function () {
    console.log('把咖啡倒进杯子里');
};
Coffee.prototype.addSugarAndMilk = function () {
    console.log('加牛奶和糖');
};
Coffee.prototype.init = function () {
    this.boilWater();
    this.brewCoffee();
    this.purInCup();
    this.addSugarAndMilk();
};

var coffee = new Coffee();
// 依次输出： 把水煮沸 冲泡咖啡 把咖啡倒进杯子里 加牛奶和糖
coffee.init();
```

泡茶的步骤:

1. 把水煮沸
2. 用沸水浸泡茶叶
3. 把茶水倒进杯子
4. 加柠檬

```js
// 泡茶
var Tea = function () {};
Tea.prototype.boilWater = function () {
    console.log('把水煮沸');
};
Tea.prototype.brewTea = function () {
    console.log('用沸水浸泡茶叶');
};
Tea.prototype.purInCup = function () {
    console.log('把茶水倒进杯子');
};
Tea.prototype.addLemon = function () {
    console.log('加柠檬');
};
Tea.prototype.init = function () {
    this.boilWater();
    this.brewTea();
    this.purInCup();
    this.addLemon();
};
var tea = new Tea();
// 依次输出： 把水煮沸 用沸水浸泡茶叶 把茶水倒进杯子 加柠檬
tea.init();
```

经过对比分析，泡咖啡和泡茶虽然具体实现的方法是不一样的，但是步骤大致是类似的：

1. 把水煮沸
2. 用沸水
3. 倒进杯子
4. 加调料

泡咖啡和泡茶主要的不同点

1. 原料不同，一个是咖啡，一个是茶，统称为饮料
2. 泡的方式不同，一个是冲泡，一个是浸泡，统称为泡
3. 加入的调料不同，一个是牛奶和糖，另一个是柠檬。

```js
// 抽象父类提取
var Beverage = function () {};
Beverage.prototype.boilWater = function () {
    console.log('把水煮沸');
};
// 抽象方法，由子类去具体实现
Beverage.prototype.brew = function () {};
// 抽象方法，由子类去具体实现
Beverage.prototype.pourInCur = function () {};
// 抽象方法，由子类去具体实现
Beverage.prototype.addCondiments = function () {};
Beverage.prototype.init = function () {
    this.boilWater();
    this.brew();
    this.pourInCur();
    this.addCondiments();
};
```

```js
// 创建子类以及实例化子类
var Coffee = function () {};
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function () {
    console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCur = function () {
    console.log('把咖啡到进杯子里');
};
Coffee.prototype.addCondiments = function () {
    console.log('加糖和牛奶');
};
var Tea = function () {};
Tea.prototype = new Beverage();
Tea.prototype.brew = function () {
    console.log('用沸水浸泡茶');
};
Tea.prototype.pourInCur = function () {
    console.log('把茶到进杯子里');
};
Tea.prototype.addCondiments = function () {
    console.log('加柠檬');
};
// 实例化子类
var coffee = new Coffee();
// 依次输出：用沸水冲泡咖啡 把咖啡到进杯子里 加糖和牛奶
coffee.init();
var tea = new Tea();
// 依次输出：用沸水浸泡茶 把茶到进杯子里  加柠檬
tea.init();
```

从实现中可以看到，定义中的模板方法其实就是上述的 Beverage.prototype.init,这是因为该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法。

重写案例

```js
// 重构父类
var Beverage = function (params) {
    var boilWater = function () {
        console.log('把水煮沸');
    };
    var brew =
        params.brew ||
        function () {
            throw new Error('子类必须重写brew方法');
        };
    var pourInCup =
        params.pourInCup ||
        function () {
            throw new Error('子类必须重写pourInCup方法');
        };
    var addCondiments =
        params.addCondiments ||
        function () {
            throw new Error('子类必须重写addCondiments方法');
        };
    var F = function () {};
    F.prototype.init = function () {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };
    return F;
};
// 创建子类
var Coffee = Beverage({
    brew: function () {
        console.log('冲泡咖啡');
    },
    pourInCup: function () {
        console.log('把咖啡倒进杯子里');
    },
    addCondiments: function () {
        console.log('加牛奶和糖');
    },
});
var Tea = Beverage({
    brew: function () {
        console.log('用沸水浸泡茶叶');
    },
    pourInCup: function () {
        console.log('把茶水倒进杯子');
    },
    addCondiments: function () {
        console.log('加柠檬');
    },
});
// 实例化子类
var coffee = new Coffee();
// 依次输出： 把水煮沸 冲泡咖啡 把咖啡倒进杯子里 加牛奶和糖
coffee.init();
var tea = new Tea();
// 依次输出： 把水煮沸 用沸水浸泡茶叶 把茶水倒进杯子 加柠檬
tea.init();
```
