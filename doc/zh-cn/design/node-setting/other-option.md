```index
11
```
```tag

```
```summary

```
# 其他选项

系统大多数题型都可以添加`其他`选项，`其他`选项在节点属性编辑栏的`设置`面板中。
<img src='../../assets/snapshots/node-setting/other/choice.png'>

打开`设置`面板并添加一个`其他`选项，可以看到`其他`选项有3种不同选项类型，分别是：`选项`、`备注栏`、`选项+备注栏`。
+ 选项：显示成可选择的选项；
<img src='../../assets/snapshots/node-setting/other/choice.png'>

+ 备注栏：显示成输入框；
<img src='../../assets/snapshots/node-setting/other/comments.png'>

+ 选项+备注栏：显示成选项，选中该选项后，选项下方显示输入框；
<img src='../../assets/snapshots/node-setting/other/both.png'>

当设置为`备注栏`或`选项+备注栏`时，点击选项输入框右侧的`附加设置`小箭头按钮，可以设置验证备注栏中输入的内容，具体参见[输入验证](./input-validation.md)。

和普通选项相比，其他选项有些特殊行为：
+ 永远显示在普通选项的后面，而且不会参与随机；
+ `其他`选项不属于[变量引用](../variable/usage.md)中的`全部选项`变量；

