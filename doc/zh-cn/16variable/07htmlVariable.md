```index
7
```
```tag

```
```summary
```
# HTML变量

`HTML变量`用于在答题页面中添加自定义的样式内容。同时也可以用HTML技巧调整答题页面的内容展示方式，一般在`问题文字`和`选项文字`中使用。

<img src='./assets/07htmlVariable/html-type.png'>

`HTML变量`的变量值输入框是一个HTML代码编辑器，可以输入任何有效的HTML代码和内嵌在style标签下的CSS样式代码。输入框右上方有2个按钮，功能分别是整理代码和进入全屏模式。

## HTML占位符

在HTML代码中如果输入`{{XXX}}`格式的代码，就创建了一个占位符。其中，半角的花括号作为占位符声明的开始和结束。包含`{{XXX}}`占位符的变量被使用后，点击被插入的`变量标签`会弹出`变量过滤`面板，在面板中可以设置占位符具体的值，答题过程中占位符就会被替换为真实的内容。

## 全局模式

如果`HTML变量`的名称中包含`TO_GLOBAL`字符，则这个`HTML变量`会被注入到答题页面的头部，这种模式可以自定义样式代码，并改变整个答题页面的展示样式效果。

`全局模式`只对样式代码有效.
