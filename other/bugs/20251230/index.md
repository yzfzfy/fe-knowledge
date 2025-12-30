# DatePicker 的 popup 问题

更新于 2025-12-30

## 问题描述

如果弹窗中的 datepicker 组件在靠近右边缘，他的 popup 弹出后没有自动调整为类似 bottomRight 的效果，而是撑大了容器的宽度。

## 解决

试了一天，发现将 modal 挂载到 body 上或参考了一个挂载到其他容器上就没问题。

他原本的容器只有一个 flex 属性，也没啥特殊的。
