# 适配器模式

## 定义

适配器模式的作用是解决两个软件实体间的接口不兼容的问题，使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。

```js
// 谷歌地图
var googleMap = {
    show: function () {
        console.log('开始渲染谷歌地图');
    },
};
// 百度地图
var baiduMap = {
    // 地图渲染接口不兼容
    display: function () {
        console.log('开始渲染百度地图');
    },
};
// 百度地图适配器
var baiduMapAdapter = {
    show: function () {
        return baiduMap.display();
    },
};
// 地图渲染
var renderMap = function (map) {
    if (map.show instanceof Function) {
        map.show();
    }
};
// 测试地图渲染
renderMap(googleMap); // 开始渲染谷歌地图
renderMap(baiduMapAdapter); // 开始渲染百度地图
```
