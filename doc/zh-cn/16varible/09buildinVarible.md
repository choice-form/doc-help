```index
9
```
```tag

```
```summary
```
# 系统变量

`系统变量`是系统事先定义好的变量，位于`变量选择器`中的`系统变量`组内。

包含以下几类：

## 基本类
+ 问卷ID：当前问卷的`问卷ID`;
+ 微信ID：被访者的`微信ID`，需要问卷设置微信授权，否则无法解析。预览状态无法解析；
+ 微信联合ID：被访者`微信联合ID`，需要问卷设置微信授权，否则无法解析。预览状态无法解析；
+ 微信昵称：被访者`微信昵称`，需要问卷设置微信授权，否则无法解析。预览状态无法解析；
+ 回复ID：被访者下载问卷时生成的一个唯一ID。预览状态下无法解析；
+ 收集器代码：问卷发布的`收集器`代码。预览状态下无法解析；
+ 收集器名称：问卷发布的`收集器`的名称。预览状态下无法解析；
+ 开始时间：被访者开始答题的时间；
+ 消耗时间：被访者回答问卷过程中所消耗的时间；
+ 结果：被访者回答到当前进度时所有的作答内容；

## 日期类
常用的日期相关变量。

## 定位类

+ 坐标：定位点所在的经纬度代码；
+ 国家：定位点所在的国家；
+ 省份：定位点所在的省；
+ 城市：定位点所在的市；
+ 区县：定位点所在的区或县；

## 上下文
提供了答题过程中某个时间点运行瞬间的状态变量。

+ 选项文字：当前选项的文字；
+ 选项备注：当前选项的备注内容；
+ 选项编号：当前选项的编号；
+ 选项分值：当前选项的分值或输入值；
+ 外层循环文字：当前外层循环变量的文字；
+ 外层循环索引：当前外层循环变量的索引；
+ 外层循环编号：当前外层循环变量的编号；
+ 外层循环分值：当前外层循环变量的分值；
+ 外层循环备注：当前外层循环变量的备注；
+ 内层循环文字：当前内层循环变量的文字；
+ 内层循环索引：当前内层循环变量的索引；
+ 内层循环编号：当前内层循环变量的编号；
+ 内层循环分值：当前内层循环变量的分值；
+ 内层循环备注：当前内层循环变量的备注；

`上下文变量`主要用于那些创建时无法确定，只有运行时才能确定的`变量`。一般在`接口请求变量`和选项的的`高级设置`中使用的最多。

比如，现在有一道题目有100个选项，需要对这些选项进行[显示控制](../logic/opt-display.md)，控制规则条件如下：
+ 需要用到之前一个题目的答复内容，和当前选项的文字作为条件；
+ 然后经过一些计算，决定这个选项应不应该显示；

所以我们需要创建一个`接口请求变量`，参数就是之前那个题目作答的内容和当前选项的文字。

当我们在这个`接口请求变量`中设置参数时，之前题目的答复内容可以直接从该节点引用变量。但是当前选项的文字设置会很麻烦，因为这么多选项，不知道设置哪个值好。

如果对每个选项都设置固定的文字为该选项的文字，需要创建100个这样的`接口请求变量`，然后在[逻辑编辑器](../logic/logic-editor.md)中为每个选项设置逻辑条件时，再为每个选项引用对应的`接口请求变量`。这样做虽然能达到效果，但效率非常低，如果后来又要添加新的选项的话，还得同步添加对应的`接口请求变量`，非常不方便。

这时，在设置选项文字参数的地方直接使用`上下文选项文字`变量，同时设置一个`接口请求变量`就能轻松解决该问题。所有的选项都用`上下文选项文字`变量做为逻辑条件。运行时，当对某个选项进行逻辑判断时，此时的选项就是这个会被用到的选项，所以`上下文选项文字`就能正确被解析为这个选项的选项文字。

另一个情况是，上面这个例子的题目是在循环圈中，`接口请求变量`的参数要加上当前循环圈的`循环变量`，这时在这个请求变量的设置面板中，是无法直接获得目标循环变量的，因为循环变量的值只能在目标节点的循环圈内节点才能访问到。这时，使用`上下文外层循环文字`变量就可以打破限制，当循环运行到第N圈时，`上下文外层循环文字`变量就会获得到这一运行时的循环变量文字。

上述2个案例也解释了为什么会存在`上下文变量`这个对象，因为虽然`变量`是用来解决动态值的问题，但是有些场合常规的变量还是无法做到。在创建上述案例的`接口请求变量`时，并不确定他会被用到哪里，也不确定可能被用到每个节点中，这时候无法得到明确设置，所以要引入`上下文变量`的概念。

使用了`上下文变量`后，以后无论这个`接口请求变量`被用到哪个节点中，只要运行的那一刻存在目标选项属性，就能得到该选项的文字，用于A节点的第1个选项，就能取到A节点第1个选项的文字；用于B节点的第3个选项，就能取到B节点的第3个选项的文字。

设计问卷时，`上下文变量`在任何地方都能被访问，意味着能在任何地方使用这些变量，但如果使用不当，变量不一定都能解析得到对应的值，比如在问题文字中引用上面的`接口请求变量`的话，因为问题文字生成的瞬间是没有运行时的选项的，所以`选项文字`这个参数就会为空，导致接口的代码运行不正确，解析不到结果。

## URL参数
答题页面的URL后面可以携带20个可解析的参数，多余的参数不会被解析。这些参数的名字必须是key1，key2，key3... 一直到key20。

参数被解析后，分别可以被`URL参数组`下面的对应key名的变量引用到。如果引用了某个URL参数变量，但是URL中没有携带这个参数，则引用不到任何内容。

+ 案列：

假设我们设计了一份员工调查问卷，该问卷发布后的原始地址是:https://q.choiceform.com?vG3y7W。

分发给每个员工的答题地址是原始地址加上对应员工的工号：https://q.choiceform.com?vG3y7W&key1=number。

这样在问卷中引用URL参数的`key1`变量，就能引用到该员工的工号。

> URL中拼接参数是key1参数较为特别，可以简写为key，其它的key名必须携带对应的数字。