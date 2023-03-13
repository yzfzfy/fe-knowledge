// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    // 默认是html页放置的目录
    baseUrl: 'js',
    // paths中的value都是相对与baseUrl值的路径，支持../这种形式。并且没必要写后缀.js，requirejs默认认为模块文件时js的.
    // 如果不想用baseUrl+paths的方式查找模块，可用下列三种方式
    // 1.值以.js结尾  2.值以/开头  3.值以协议http://或https://开头
    paths: {
        // message: 'app/message',
        // print: 'app/print',
    },
});

// Start loading the main app file. Put all of your application logic in there.
// 项目的主入口执行入口
requirejs(['app/main']);
