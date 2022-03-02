# 跳过跨域请求大法 JSONP

## 原理

利用 script 标签的 src 请求没有跨域限制的特性，来请求跨域资源或接口。
使用该方式需要前后端配合使用。也就是要约定后才可成功

## 例子

以下`https://www.runoob.com/try/ajax/jsonp.php`接口是一个支持 jsonp 的接口，返回一个数组数据。前端使用 script 标签，src 属性值为该地址。执行第一个 script 时，会定义一个`callbackFunction`函数.然后执行第二个 script，发起对于 url 的 get 请求，同时带 jsoncallback 参数，参数值是前边定义好的函数。服务端接收到请求之后，找到请求上挂接的之前已约定好的 jsoncallback 参数(这个 jsoncallback 名称需约定好，否则后端不知道用哪个函数包裹参数)。然后返回数据。返回的数据格式为`return callbackFunction(${data})`;所以前端收到响应后收到的响应就是`callbackFunction(${data})`,就相当于自动执行了传参后的 callbackFunction 函数。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>JSONP 实例</title>
    </head>
    <body>
        <div id="divCustomers"></div>
        <script type="text/javascript">
            function callbackFunction(result, methodName) {
                console.log(result);
                var html = '<ul>';
                for (var i = 0; i < result.length; i++) {
                    html += '<li>' + result[i] + '</li>';
                }
                html += '</ul>';
                document.getElementById('divCustomers').innerHTML = html;
            }
        </script>
        <script type="text/javascript" src="https://www.runoob.com/try/ajax/jsonp.php?jsoncallback=callbackFunction"></script>
    </body>
</html>
```
