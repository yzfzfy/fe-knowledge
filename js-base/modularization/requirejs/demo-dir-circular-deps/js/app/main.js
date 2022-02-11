define(['app/a', 'app/b'], function (a, b) {
    console.log('main starting');
    console.log('main', a, b);
});

/**
 * 有循环依赖的模块，需要添加exports依赖，这是一个内置依赖。添加后该模块的默认导出是一个对象。
 * 如果不添加则循环依赖的模块的导出是undefined，在解析到第二个模块时，前一个是undefined，读取就会报错。
 */
