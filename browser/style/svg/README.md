# SVG 介绍

## 什么是 SVG？

> 可缩放矢量图形（Scalable Vector Graphics，SVG），是一种用于描述二维的**矢量图形**，基于 XML 的标记语言。作为一个基于文本的开放网络标准，SVG 能够**优雅而简洁**地渲染不同大小的图形，**并和 CSS，DOM，JavaScript 和 SMIL 等其他网络标准无缝衔接**。本质上，SVG 相对于图像，就好比 HTML 相对于文本。

## 目前主要应用

- iconfont 图标
- svg path 地图
- svg 格式的图片资源

## 优点

- 矢量图形 图像在放大或改变尺寸的情况下其图形质量不会有所损失。（位图与矢量图的定义）
- 使用 XML 格式纯文本定义图形, 文本编辑器即可用来创建和修改。与 JPEG 和 GIF 图像比起来，尺寸更小。
- 开放的标准。在 2003 年一月，SVG 1.1 被确立为 W3C
- 优雅而简洁。在 css 中复杂的样式，可能在 svg 中很简单。

## 缺点：

- SVG 复杂度高会减慢渲染速度

## 兼容性

IE8-以及 Android2.3 默认浏览器是不支持 SVG。

## 用法

- 将 SVG 作为图像。将 svg 文件作为 img 标签的 src 属性值或者 background-image 的值。
- 将 SVG 作为应用程序。使用 object / embed 元素将 SVG 嵌入 HTML 文档中，object 元素的 type 属性表示要嵌入的文档类型，对用 SVG 应该是 type="image/svg+xml"。
- 使用内联 SVG,直接在 HTML 中嵌入 SVG

## 坐标系统

- 视口
  视口是指文档打算使用的画布区域。在 svg 元素上使用 width 和 height 属性确定视口的大小，属性值可以仅仅是为数字也可以为带单位的数字(单位可以为 em、ex、px、pt、pc、cm、mm 和 in)也可以为百分比。

- 默认用户坐标
  SVG 阅读器会设置一个坐标系统，即原点(0,0)位于视口的左上角，x 向右递增，y 向下递增。这个坐标系统是一个纯粹的几何系统，点没有大小，网格线被认为是无限细。

## 基本形状

- circle
- rect
- ellipse
- polygon
- polyline
- line
- text
- path 路径 基本形状都是 path 的简写形式，path 元素更通用，可以通过制定一系列相互连接的线、弧、曲线来绘制任意形状的轮廓，这些轮廓也可以填充或者绘制轮廓线，也可以用来定义裁剪区域或蒙版。 <path d="Ma Ll Vv Hh Aa Qq Tt Cc Ss" />

## 文档结构

### 结构和表现

| 表现方式   | 说明                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 内联样式   | 元素内部使用 style 属性                                                                                                            |
| 内部样式表 | 内部样式定义在 defs 元素内部                                                                                                       |
| 外部样式表 | 与 html 类似，将样式定义在 css 文件中，使用选择器来设置相应的元素样式                                                              |
| 表现属性   | SVG 允许以属性的形式指定表现样式，但是表现属性的优先级最低，如果以其他三种形式指定了相同的样式属性，则将覆盖通过表现属性指定的样式 |

### 分组和引用

- defs: 用来定义复用的元素，但是定义在 defs 内的元素并不会被显示，而是作为模板供其他地方使用。
- use: 元素用来复用图形中重复出现的元素，需要为 use 标签的 xlink:href 指定 URI 来引用指定的图形元素
- g: 用来将其子元素作为一个组合，可以使文档结构更清晰
- symbol: 与 g 元素不同，symbol 永远不会被显示，也可以用来指定被后续使用的元素
- image: 可以用来包含一个完整的 SVG 或栅格文件。

## 渐变

- 线性渐变
  ```
  <defs>
      <linearGradient id="linear">
          <stop offset="0%" style="stop-color:#ffcc00;"></stop>
          <stop offset="100%" style="stop-color:#0099cc;"></stop>
      </linearGradient>
      </defs>
      <rect x="20" y="20" width="200" height="100" style="fill:url(#linear);stroke:black;"></rect>
  ```
- 径向渐变

  ```
  <defs>
      <radialGradient id="radial" cx="50%" cy="50%" >
          <stop offset="0%" style="stop-color:#f00;"></stop>
          <stop offset="50%" style="stop-color:#0f0;"></stop>
          <stop offset="100%" style="stop-color:#00f;"></stop>
      </radialGradient>
  </defs>
  <rect x="20" y="20" width="200" height="200" style="fill:url(#radial);stroke:black;"></rect>
  ```

## 动画

- 基础动画元素 animate

  ```
      <rect x="10" y="10" width="200" height="200" stroke="black" fill="none">
          <animate
              attributeName="width"
              attributeType="XML"
              from="200" to="20"
              begin="0s" dur="5s"
              fill="freeze">
          </animate>
      </rect>
  ```

- 多边形和 path 动画

  ```
      <polygon points="30 30 70 30 90 70 10 70" style="fill:#fcc;stroke:black">
          <animate
              attributeName="points"
              attributeType="XML"
              to="50 30 70 50 50 90 30 50"
              begin="0s" dur="5s" fill="freeze"
          ></animate>
      </polygon>
      <path d="M15 50 Q40 15,50 50,65 32,100 40" style="fill:#fcc;stroke:black" transform="translate(0,50)">
          <animate
              attributeName="d"
              attributeType="XML"
              to="M50 15Q15 40,50 50,32 65,40 100"
              begin="0s" dur="5s" fill="freeze"
          ></animate>
      </path>
  ```

- 对坐标变换进行过渡
  ```
      <rect x="-10" y="-10" width="20" height="20" style="fill:#ff9;          stroke:black">
          <animateTransform
              attributeType="XML"
              attributeName="transform" type="scale"
              from="1" to="4 2"
              dur ="3s"
              begin = "0s" fill="freeze"
              additive = "sum"
          ></animateTransform>
          <animateTransform
              attributeType="XML"
              attributeName="transform" type="rotate"
              from="0" to="90"
              dur ="3s"
              begin = "3s" fill="freeze"
              additive = "sum"
          ></animateTransform>
      </rect>
  ```
- 沿着 path 运动
  ```
      <rect x="-10" y="-10" width="20" height="20" style="fill:#ff9;stroke:black">
          <animateMotion
              path="M50,135C100,25 150,225 200,125"
              dur="6s" fill="freeze" rotate="auto"
          ></animateMotion>
      </rect>
  ```
- CSS 处理 SVG 动画 通过选择器设置关键帧

# 相关链接

1. [creating my logo animation](https://www.cassie.codes/posts/creating-my-logo-animation/)
1. [Building a pure CSS animated SVG spinner](https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/)
1. [Simple Google Loader Using SVG And CSS](https://westonganger.com/posts/simple-google-loader-using-svg-and-css)
1. [前端进阶道路上不可错过的 21 个开源项目](https://mp.weixin.qq.com/s/-8GrPZPTPdaqCwENfRQCoA)
