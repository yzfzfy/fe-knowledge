## 使用 ref 与组件外变量的区别

1. 使用 ref 定义是组件级别的，该组件被多次使用时，每个组件内的 ref 是独立的，不会互相影响
2. 而组件外的定义的变量是全局的，不是指的全局变量，编译时属于当前 module 的，如果当前组件被多次使用，使用的只有这一个变量，会互相影响。

### 例子

在下例中，使用 ref 的例子中，初始值使用 props 中的 index，每个组件中的 current 是不同的。

而在使用全局变量的例子中，组件被多次使用，每个传入的 props 值最终都赋值在了同一个变量上，所以多个组件引用的值都是一个，就会互相影响。

```js
// main.js
import React from "react";
import RefExample from "./components/RefExample";
import GlobalConstantExample from "./components/GlobalConstantExample";
import "./styles.css";
import ClosureExample from "./components/ClosureExample";

export default function App() {
    return (
        <div className="App">
            <h1>测试组件全局变量</h1>
            <RefExample index={1} />
            <RefExample index={2} />
            <RefExample index={3} />
            <GlobalConstantExample index={4} />
            <GlobalConstantExample index={5} />
            <GlobalConstantExample index={6} />
        </div>
    );
}
```

使用 ref 的组件

```js
import React, { useRef } from "react";

const RefExample = ({ index }) => {
    const myConstant = useRef(index);

    return (
        <div
            onClick={() => {
                console.log(myConstant.current);
            }}
        >{`点击Ref${index}`}</div>
    );
};

export default RefExample;
```

使用全局变量的例子

```js
import React, { useRef } from "react";

let myConstant = null;
const GlobalConstantExample = ({ index }) => {
    myConstant = index;

    return (
        <div
            onClick={() => {
                console.log(myConstant);
            }}
        >{`点击Global${index}`}</div>
    );
};

export default GlobalConstantExample;
```
