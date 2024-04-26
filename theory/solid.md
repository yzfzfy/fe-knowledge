# SOLID

面向对象设计五个最重要原则的首字母缩写

## 单一职责原则

The Single Responsibility Principle， 简称 SRP。这一设计原则的主要思想是一个模块只负责一个职责。

例如下面这个调制解调器的类就违反了 SRP:

```ts
class Modem {
    dial: (pno: string) => {};
    hangup: () => {};
    send: (s: string) => {};
    recv: () => {};
}
```

它既负责了连接管理又负责了数据通信, 出于提高代码内聚性(模块组成元素之间的功能相关性)，降低耦合性的考量，我们应该将其拆分为两个类, 如果真的有必要我们再将其组合成一个超类:

```ts
class Connection {
  dial: (pno: string) => {}
  hangup: () => {}
}

class DataChannel {
  send: (s: string) => {}
  recv: () => {}
}

// 如果真的有必要我们再将其组合成一个超类
class Modem extends Connection, DataChannel {}
```

## 开放-封闭原则

The Open-Closed Principle, 简称 OCP。这一设计原则的主要思想是拓展软件实体时(类、模块、函数等)，不应当修改原本正常运行的代码。即对于拓展是开放的，对于更改是封闭的。

例如下面这个绘制所有形状的函数就违反了 OCP:

```ts
enum ShapeType {
    circle,
    square,
}

interface ICircle {
    type: ShapeType;
    radius: number;
}

interface ISquare {
    type: ShapeType;
    size: number;
}

type IShape = ICircle | ISquare;

function drawAllShapes(list: IShape[]) {
    for (const item of list) {
        switch (item.type) {
            case ShapeType.circle:
                return drawCircle(item);
                break;
            case ShapeType.square:
                drawSquare(item);
                break;
        }
    }
}
```

每当我们需要新增一个形状的时候，我们都需要修改一次 drawAllShapes 函数，显然违反了"对于更改是封闭的"这一原则。

我们可以改变思路，将绘制函数内聚在各个形状之中，顺便为绘制所有形状的函数添加 hooks 以应对后续的拓展:

```ts
class Circle extends ICircle {
    draw() {}
}

class Square extends ISquare {
    draw() {}
}

type Shape = Circle | Square;

interface IHook {
    beforeDraw: (list: Shape[]) => Shape[];
    afterDraw: (list: Shape[]) => Shape[];
}

function drawAllShapes(list: Shape[], hook: IHook) {
    // 添加 hooks
    list = hook?.beforeDraw?.(list);
    for (const item of list) {
        item.draw();
    }
    list = hook?.afterDraw?.(list);
}
```

## 里氏替换原则

The Liskov Substitution Principle, 简称 LSP。这一设计原则的主要思想是子类必须能够替换掉他的基类。

例如下面这个 Square 和 Rectangle 类的例子就违反了 LSP：

```ts
class Rectangle {
    private _w: number = 0;
    private _h: number = 0;
    setWidth(width: number) {
        this._w = width;
    }
    setHeight(height: number) {
        this._h = height;
    }
    getWidth() {
        return this._w;
    }
    getHeight() {
        return this._h;
    }
}

class Square extends Rectangle {
    setWidth(width: number): void {
        super.setWidth(width);
        super.setHeight(width);
    }

    setHeight(height: number): void {
        super.setWidth(height);
        super.setHeight(height);
    }
}
```

Square 作为子类并不能替换掉基类 Rectangle, Square 在修改高度的时候会同时修改宽度以保持正方形的特性, 对于下面这个函数，传入一个矩形和正方形会导致不一样的运行结果:

```ts
function printWidth(shape: Rectangle) {
    shape.setHeight(32);
    console.log(shape.getWidth());
}

printWidth(new Square()); // 32
printWidth(new Rectangle()); // 0
```

## 依赖倒置原则

The Dependency Inversion Principle, 简称 DIP。这一设计原则的主要思想是高层模块不应当依赖于底层模块，两者都应该依赖于抽象。

例如下面这个 Button 类就违反了 DIP:

```ts
class Button {
    private lamp: Lamp = new Lamp();
    private status = false;

    poll() {
        this.status = !this.status;
        const method = this.status ? "turnOn" : "turnOff";
        this.lamp[method]();
    }
}
```

lamp 耦合在了 Button 中，这意味着 Lamp 类改变时，Button 类会受到影响。此外，想用 Button 类来控制一个 Motor 对象是不可能的。因此我们需要将 Lamp 类 抽象成一个 SwitchableDevice 类, 然后将 device 实例在实例化时动态注入：

```ts
class Button {
    private device: SwitchableDevice;
    private status = false;

    constructor(device: SwitchableDevice) {
        this.device = device;
    }

    poll() {
        this.status = !this.status;
        const method = this.status ? "turnOn" : "turnOff";
        this.device[method]();
    }
}

const lampButton = new Button(new Lamp());
const motorButton = new Button(new Motor());
```

## 接口隔离原则

The Interface Segregation Principle, 简称 ISP。 这一设计原则的主要思想是如果类的接口不是内聚的，就应该被拆解为多个。类似于接口（架构设计）层面的 SRP。

例如下面这个 IOrder 接口就违反了 ISP:

```ts
interface IOrder {
    // 申请
    apply: () => void;
    // 审核
    approve: () => void;
    // 结束
    end: () => void;
    // 切换供应商
    changeSupplier: () => void;
    // 切换门店
    changeShop: () => void;
}
```

上面的 apply、approve、end 还算是订单通用的接口，而 changeSupplier 显然是生产订单才会用到的接口，changeShop 销售订单才会用到。因此我们应该将其拆解开, 需要使用时可以利用多继承将它们组合到一起:

```ts
interface IOrder {
    // 申请
    apply: () => void;
    // 审核
    approve: () => void;
    // 结束
    end: () => void;
}

interface IProductOrder extends IOrder {
    // 切换供应商
    changeSupplier: () => void;
}

interface ISaleOrder extends IOrder {
    // 切换门店
    changeShop: () => void;
}

// 产销订单
interface IProductSaleOrder extends IProductOrder, ISaleOrder {
    bindSupplierWithShop: () => void;
}
```
