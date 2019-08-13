# 数值变量

数值变量是变量类型的一种，其计算结果会是一个数值。

变量之中可以使用一些内置的数值操作符对多个数据进行计算，如果引用了某个非数值变量作为计算数据，则会将该变量结果转成数值后再计算。

## 数值操作符
当在编辑数值变量的变量值时，@出的[变量选项器](./usage.md#变量选择器)中包含了一个`数值操作符`变量组，里面包含了一些数值运算操作符。

> 当进行数值运算时，使用的运算符必须是从变量选择器中选择的，直接键盘输入的加减乘除等符号是没有用的

以下是对各种运算符的说明：

+ `+`运算符：对两个数做加法运算。
+ `-`运算符：对两个数做减法运算。
+ `/`运算符：对两个数做除法运算。
+ `*`运算符：对两个数做乘法运算。
+ `SUM`运算符：对后续的多个数据进行求和运算
    > 对于像`SUM 题目/已选中选项/选项分值`这样的运算，虽然后面只有一个变量标签，但是这个标签中其实包含了多个分值，所以就达到了对题目中各个选项分值求和的效果。
+ `MIN`运算符：在后续的多个数据中找到最小值。
    > 定义
+ `MAX`运算符：在后续的多个数据中找到最大值。
+ `AVG`运算符：对后续的多个数据中求平均值。
+ `ROUND`运算符：对后面一个数求四舍五入。
+ `FLOOR`运算符：对后面一个数向下取整。
+ `CEIL`运算符：对后面一个数向上取整。
+ `(`运算符：配合`)`操作符可以控制运算优先级
+ `)`运算符：配合`(`操作符可以控制运算优先级

如果数值计算过于复杂，靠这些操作符组合无法达到要求，可以使用[接口请求变量](../request-type.md)来计算。


