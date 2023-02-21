# BFC Block Formatting Contexts

块级格式化上下文。浏览器根据在我们编写的 html 标签和 css 样式显示在浏览器中时，
需要遵循一定的规则。BFC 就是该规则的一部分，还有 IFC。
BFC 就是浏览器渲染页面的布局块。用于决定块级盒的布局及浮动相互影响范围的一个区域,隔离。
页面布局有 常规布局(float 为 none position 为 relative 或 static) 浮动布局（float left top） 定位布局（fixed absolute ）
当设置某些属性时，会触发布局块成为 BFC。
这些条件为：

1. html 元素
2. float 不为 none
3. 绝对定位元素 fixed absolute
4. overflow 不为 visible
5. display 为 inline-block
6. 表格标签 display table table-caption inline-table table-cell
7. display flex inline-flex grid inline-grid

## BFC 包含创建它的元素的所有子元素，但是不包括创建了新的 BFC 的子元素的内部元素。 **一个元素不能同时存在于两个 BFC 中。**

## BFC 的特性（隔离）

1. 内部的块级盒会在垂直方向上一个接一个排列
2. 同一个 BFC 下相邻(相邻的意思包括父元素与第一子元素，所以第一子元素的 margin-top 会加在父元素上。给父元素加 border 和 padding 也可解决)的块级元素可能会发生外边距折叠（避免可以建立新的 BFC）
3. 每个元素的外边距盒的左边都与包含块边框盒的左边相接触，即使存在浮动也是如此
4. 浮动盒的区域不会与 BFC 重叠
5. 计算 BFC 的高度时，浮动元素也会参与计算
