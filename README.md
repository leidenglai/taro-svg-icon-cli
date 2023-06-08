# taro-svg-icon-cli
在Taro框架中使用svg图片生成图标组件，不依赖字体，支持多色彩和大小。

# 支持平台

* 微信小程序
* 支付宝小程序

# 特性
1、一键生成标准组件，多端支持
<br>
2、使用方便，import即可
<br>
3、支持自定义颜色和大小
<br>
4、支持es6和typescript两种模式

# Step 1
安装插件

```bash
# Yarn
yarn add taro-svg-icon-cli --dev

# Npm
npm install taro-svg-icon-cli --save-dev
```


# Step 2
生成配置文件
```bash
npx iconfont-init

# 可传入配置输出路径
# npx iconfont-init --output iconfont.json
```
此时项目根目录会生成一个`iconfont.json`的文件，内容如下：
```json
{
  "local_svgs": "请参考README.md，本地svg文件夹，使用本地svg图标时配置",
  "save_dir": "./src/components/iconfont",
  "use_typescript": false,
  "platforms": "*",
  "use_rpx": true,
  "trim_icon_prefix": "icon",
  "default_icon_size": 18,
  "design_width": 750
}
```
### 配置参数说明：
### local_svgs
本地svg图标文件夹。

### save_dir
生成的图标组件存放的位置。每次生成组件之前，该文件夹都会被清空。

### use_typescript
如果您的项目使用Typescript编写，请设置为true。这个选项将决定生成的图标组件是`.tsx`还是`.js`后缀。

当该值为false时，我们会为您的图标生成`.js`和`.d.ts`两个文件，以便您能享受到最好的开发体验。

### platforms
选择需要支持的平台，默认是`*`，意味着所有平台都需要支持（如果有）。如果你只想支持部分平台，也可以设置成数组：
```json5
{
  // 选择你需要的平台
  // 说明 =>  weapp: 微信   |  alipay: 支付宝和钉钉
  "platforms": ["weapp", "alipay", ]
}
```

### use_rpx
是否使用[尺寸单位rpx](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html#%E5%B0%BA%E5%AF%B8%E5%8D%95%E4%BD%8D)还是普通的像素单位`px`。默认值为true，与Taro保持一致的缩放。您也可以设置为false，强制使用`px`

### design_width
若 `use_rpx: true` 且当前设计图尺寸不为 750 时，可以通过修改这个字段来修改设计尺寸。

### trim_icon_prefix
如果你的图标有通用的前缀，而你在使用的时候又不想重复去写，那么可以通过这种配置这个选项把前缀统一去掉。

### default_icon_size
我们将为每个生成的图标组件加入默认的字体大小，当然，你也可以通过传入props的方式改变这个size值。


# Step 3
开始生成Taro标准组件
```bash
npx iconfont-taro

```
生成后查看您设置的保存目录中是否含有所有的图标

-------

在生成代码之前，你可以顺便参考snapshots目录自动生成的快照文件。

# Step 4
需要在`src/app.config.js`下填写`usingComponents`。
```typescript
// src/app.config.js
// 如果是钉钉小程序，由于他的限制，需要在每个page的config添加usingComponents
export default {
  usingComponents: {
    iconfont: '@/components/iconfont/weapp/weapp',
  },
}
```

# 使用
在Page中使用图标
```jsx harmony
import React, { Component } from 'react';
import IconFont from 'yourpath_xx/components/iconfont';

class App extends Component {
  render() {
    return <IconFont name="alipay" />;
  }
}

export default App;
```
更多用法：
```jsx harmony
// 原色彩
<IconFont name="alipay" />

// 单色：红色
<IconFont name="alipay" color="red" />

// 大小
<IconFont name="alipay" size="16" />

// 与文字对齐
<View style={{ display: 'flex', alignItems: 'center' }}>
  <Text>Hello</text>
  <IconFont name="alipay" />
</View>
```

# 更新图标
将svg图片添加到文件夹，再次执行生成命令
```bash

npx iconfont-taro
```

--------

## 感谢[taro-iconfont-cli](https://github.com/iconfont-cli/taro-iconfont-cli) 提供灵感和部分代码
