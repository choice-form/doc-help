```index
3
```
```tag

```
```summary

```

# 问题设置

用于设置问题题目内容、题目附加描述和媒体资源等属性。
<img src='../../assets/snapshots/node-setting/question/normal.png'>

## 题目内容
输入问题的文字内容，文字内容中可以插入变量的内容。例如：先询问被访者喜欢什么水果，然后追问被访者喜欢这个水果的具体原因。
<img src='../../assets/snapshots/node-setting/question/variable.png'>

## 题目描述
开启后，会出现描述输入框，可以在问题文字的基础上增加辅助描述。
<img src='../../assets/snapshots/node-setting/question/description.png'>

## 添加媒体
开启后，会出现[图片选择器](../media/image.md)和[视频选择器](../media/video.md)。
<img src='../../assets/snapshots/node-setting/question/image.png'>

上传图片或视频媒体资源后，点击右侧按钮，可以设置如下选项：
  + 图片媒体：开启缩放
  + 视频媒体：完整播放、自动播放

+ 图片：

  打开媒体选择器，从图片资源库选择一张图片，也可以上传的新的图片。
  <img src='../../assets/snapshots/node-setting/question/assets/image-menu.png'>

  + `开启缩放`：允许图片放大显示。
  <img src='../../assets/snapshots/node-setting/question/assets/zoom-in.png'>
  开启后，被访者点击图片可以进入全屏看图模式，放大查看完整图片。
  <img src='../../assets/snapshots/node-setting/question/assets/zoom-in-preview.png'>

+ 视频：
  打开媒体选择器，从视频资源库选择一段视频，也可以上传的新的视频。
  <img src='../../assets/snapshots/node-setting/question/video.png'>

  + `完整播放`： 被访者必须看完视频是才能进入下一题的。
  + `自动播放`：进入题目时，自动播放视频。
  <img src='../../assets/snapshots/node-setting/question/auto-play.png'>

  > 由于手机生态系统普遍存在深度定制的现象，`自动播放`在某些定制的手机系统中可能会失效。

## 题目标签
可以给题目添加自定义标签，标签主要用途是使数据表格更加简明。对于比较长的问题文字，可能会影响数据结果表格的视觉效果。如果设置了该标签，则结果中会以标签内容代替问题内容，否则使用问题文字。如下图，为当前问题设定了“乘车舒适性”标签文字，在数据结果中，这道题目的列名就会以“乘车舒适性”来命名。
  <img src='../../assets/snapshots/node-setting/question/label.png'>

