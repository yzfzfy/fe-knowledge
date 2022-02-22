# 正则表达式

字符匹配模式

# 元字符

-   单字符非特定字符 表示匹配该字符
-   \ 转义字符。和某些字符组成特殊的匹配模式。如果想要匹配\需要使用\\，还比如因为`()`在正则中有特殊含义,所以想要匹配(或)的化话，需要搭配转义\：`\(`或`\)`
-   . 匹配除换行符之外的其他字符。如果想要添加换行符，用`.|\n`
-   ? 匹配?前的字符 0 次或 1 次。
-   -   匹配\*前的字符 0 次或多次。
-   -   匹配+前的字符 1 次或多次。也就是至少 1 次。
-   {n,m}匹配次数最少 n 次最多 m 次
-   {n}匹配确定次数 n 次
-   {n,}匹配至少 n 次
-   ? 的另外一个使用方式。当?跟在以上的限制符后时，如:ab\*?，匹配是非贪婪的。贪婪的意思是正则会优先按最多的数量来匹配字符串。非贪婪模式下会优先按最少的匹配。例如，对于字符串 "oooo"，'o+?' 将匹配单个 "o"，而 'o+' 将匹配所有 'o'。
-   (pattern)匹配模式并保存这一匹配结果供之后使用。$0-$9
-   (?:pattern) 非获取匹配。
-   (?=pattern) 正向肯定预查。非获取匹配。
-   (?<=pattern) 反向肯定预查。非获取匹配。
-   (?!pattern) 正向否定预查。非获取匹配。
-   (?<!pattern) 反向否定预查。非获取匹配。
-   [abc]匹配 abc 中的任意一个
-   [^abc]相反。匹配非 abc 的其他字符
-   [a-zA-Z0-9]字符范围。
-   x|y 匹配 x 或 y
-   \b 匹配单词边界 相反\B 是非单词边界
-   \f 换页符 \t 制表符 \n 换行符 \r 回车符
-   \s 空白字符（包括\f\t\r\n）\S 非空白字符
-   \d 数字相当于[0-9] \D 非数字
-   \w 字母数字下划线 相当于[a-zA-Z0-9_] \W 取反

## 相关知识

1.  正则对象的 test 方法

用法:regexp.test(str);用正则去检测一个字符串。如果该串能匹配该正则，返回 true,否则返回 false。

```js
var exp = /[a-z]+\d+$/;
var str1 = '123sdf';
var str2 = 'sdf123';

exp.test(str1); // false
exp.test(str2); // true
```

2. 字符串对象的 replace 方法

用法：str.replace(regexp|substr, newSubStr|function)

参数：

-   regexp：正则表达式。该正则表达式匹配的内容将会被第二个的返回值替换。如果正则式有 g 标识，则全部替换
-   substr：字串。str 中 substr 会被第二个参数的返回值替换。只有找到第一个字串替换。
-   newSubStr 用于替换掉第一个参数在原字符串中的匹配部分的字符串。该字符串中可以内插一些特殊的变量名。

| 变量名                             | 代表的值                                                                                                                    |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| <div style="width: 100px">$$</div> | 插入一个$                                                                                                                   |
| $&                                 | 插入匹配的字串                                                                                                              |
| $`                                 | 插入匹配串左边的内容                                                                                                        |
| $'                                 | 插入匹配串右边的内容                                                                                                        |
| $n                                 | 这个就是当第一个参数是正则时，正则中通过`()`获取的匹配。（正则元字符中提到的获取匹配供之后使用的地方。n 是变量，从 1 开始。 |
| $<name>                            | 分组名称（一般不会用到，减少记忆）                                                                                          |

-   function ：用来创建新子字符串的函数，返回值将替换掉第一个参数匹配大屏的结果。

函数的参数：function (match,p1,p2....,offset,string)
参数的长度是不定的。
第一个参数：是第一个参数最终匹配的结果.
第二个参数：当第一个参数是正则对象时，正则对象中每个获取匹配的模式匹配的子串。对应上述的$n.
offset 和 string 暂时少用到。减少记忆。

```js
//实践
var str = 'Twas the night before Xmas...';
var newstr = str.replace(/xmas/i, 'Christmas');
console.log(newstr); // Twas the night before Christmas...

// 交换字符串中的两个单词顺序
var re = /(\w+)\s(\w+)/;
var str = 'John Smith';
var newstr = str.replace(re, '$2 $1');
// Smith, John
console.log(newstr);

// 驼峰转中划线
function styleHyphenFormat(propertyName) {
    function upperToHyphenLower(match) {
        return '-' + match.toLowerCase();
    }
    return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
}
```
