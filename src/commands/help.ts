#!/usr/bin/env node

import colors from 'colors';

console.log([
  '',
  'Usage:',
  '',
  '    ' + colors.green.bold('npx taro-svg-generator-init [--output]') + '     : Generate configuration file, default file name is iconfont.json',
  '    ' + colors.green.bold('npx taro-svg-generator-sync [--config]') + '     : Generate icon component',
  '',
].join('\n'));
