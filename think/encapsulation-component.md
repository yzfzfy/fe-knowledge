# 封装组件

在面试时虽然都会写到可以封装常用的组件，但是在业务中观察不同人的组件还是可以看出区别与优劣，所以总结一下自己封装组件时的思路或者心路历程。

首先，【挖掘需求】。我们接到需求时，要首先尽量全面的思考需求。可能在深层次会有隐藏的、关于扩展性的要求。这些内容，组件使用方目前并没有这样的硬性要求，但是不代表他未来不会用到，他只是前瞻性不够。而且如果全面性不够，这会影响到你的代码可扩展性，当未来需要扩展时，可能会出现组件需要重写的情况。

确定全面的需求之后，就可以知道最终输出的产物是什么，需要具备什么特性等等。这里就需要在研发层面定义我们的组件。首先定义产出组件的行为有哪些，这就是功能；然后我们如何实现这些功能，例如需要什么技术方案、技术难点等，再向上反推就是为了具备功能我们需要什么前提条件，也可以说是入参物料准备。

用 ts 类型描述就是定义一个组件类型，以 react 组件为例：

```ts
interface IComponentProps {
    ...
}
const Component: Reat.FC<IComponentProps> = () => {
    return <></>
}
```

组件需要具备的入参，类型是`IComponentProps`。

接下来就是开发组件逻辑。根据代码质量指标的三个原则：`可维护性`,`鲁棒性`,`可测试性`。这里先只讨论第一个可维护性。可维护性又包括可读性与可复用性。可读性就是你的代码是否精简、易懂。

总结出一些可能会导致可读性变差的点：

1. 变量命名。

有时候在着急开发功能时，对于变量命名没有做到见名知意，甚至有时只用一个字母代替。

2. 逻辑不清晰

开发代码逻辑时，写出第一版后，应回过头再梳理逻辑是否易懂、是否有需要抽离出主逻辑的函数等。

3. 一些判断 否 并 交集等不易懂。

可复用性：

1. 预留插槽逻辑
