import { version } from '../package.json';

// 打包结果只有version信息。并没有package.json中其他字段，这就是tree-shaking的强大
/**
 * 'use strict';
 * var version = "1.0.0";
 * function main () {
 *  console.log('version ' + version);
 * }
 * module.exports = main;
 *
 */
export default function () {
    console.log('version ' + version);
}
