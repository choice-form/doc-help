```index
1
```

```tag

```

```summary

```
# 选择题

`选择题`提供一系列选项给被访者，被访者从中选择一项或多项作为问题的答案。
<img src='../../assets/snapshots/nodes/multiple-choice/node.png'>

当设置为多选时，选项之间可以进行互斥控制，通常用于选项间存在互相矛盾而无法被同时选中的情况。

> 设置为多选题时，根据所选选项决定后续问卷题目，需要使用[逻辑节点](./logic.md)进行逻辑判断。

## 选项设置

+ 预设选项：
`选择题`预设了一些常用的选项内容，点选即可直接使用预设的选项内容。
<img src='../../assets/snapshots/node-setting/answer-choices/answer-presets/normal.png'>
预设内容类型有：
  + 性别
  + 年龄
  + 婚姻
  + 学历
  + 行业
  + 职业
  + 职位
  + 收入
  + 同意/不同意
  + 满意/不满意
  + 可能/不可能
  + 熟悉度
  + 适量
  + 兴趣
  + 容易/难
  + 频率
  + 更好/更坏
  + 赞同/反对
  + 平均
  + 质量
  + 是/非
  + 意向
  + 有用度
  + 价值
  + 清晰度
  + 比重
  + 友好度

+ 选项备注
`选择题`默认包含一个`选项备注`的附加设置。点击选项右侧箭头，并开启`选项备注`后，当选中该选项时，下方会出现要求输入备注文字的输入框。

  `选项备注`与`其他`选项的`选项+备注方式`非常类似，区别是`其他`选项的`选项+备注方式`支持输入验证。

+ 选项排他
当开启`多选题`后，选项设置的中还可以设置[选项排他](../node-setting/option-exclude.md)。

## 布局设置

+ 选项布局：
  + 选项布局：用于设置选项图标的排列方式，可选方式有：垂直、水平和指定列数。
  <img src='../../assets/snapshots/nodes/multiple-choice/node.png'>
  + 选项展示方式：
    + 常规标记：选项左侧显示圆圈（单选）或方框（多选）作为选中标记。
    <img src='../../assets/snapshots/node-setting/adjust-layout/display-type/normal.png'>
    + 无标记：没有标记，选项文字外围显示矩形边框。
    <img src='../../assets/snapshots/node-setting/adjust-layout/display-type/normal.png'>

> 不同题型或功能节点共有的通用设置在[节点设置](../node-setting/concept.md)中有讲解，此处只讲解选择题特有的功能。