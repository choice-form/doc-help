---
  index: 5
  tags: [学习案例,教学,sample,tutor,]
  summary: 创建逻辑变量；设定条件，过滤变量；使用逻辑节点判断变量；
---






# Lesson5-使用变量实现逻辑判断

通过本案例，将学习到：

+ 创建逻辑变量；
+ 设定条件，过滤变量；
+ 使用逻辑节点判断变量；

通过之前的练习，我们掌握了多种逻辑判断方法。下面我们来看看如何通过变量功能实现之前的问卷判断逻辑。

## 1. 用逻辑节点判断变量

### 创建变量

打开问卷组件工具栏中的变量面板，按如下设定：

+ 点击创建变量并创建一个==布尔变量==
+ 变量名：排序位置
+ 变量值：在输入框里输入==@==，在弹出菜单中选择==Q4->指定选项->卫生情况->选项排序序号==

如下图所示：

![05addVariableIntoSatisfactionSurvey01](assets/05addVariableIntoSatisfactionSurvey/05addVariableIntoSatisfactionSurvey01.png)

+ 会看到变量值输入框中创建了一个变量，点击这个变量，弹出==变量过滤==面板，按如下设定：
  + 要求：排序号
  + 满足以下条件：大于，2

如下图所示：

![05addVariableIntoSatisfactionSurvey02](assets/05addVariableIntoSatisfactionSurvey/05addVariableIntoSatisfactionSurvey02.png)

以上设定代表当使用该变量时，会判断Q4的卫生情况选项的排位是否大于2。

### 删除之前的判断条件

双击逻辑节点LOGIC1，删除==逻辑运算选项==里的所有条件。

### 设定变量的逻辑判断

按如下依次设定：

+ 可判断的内容：选择@布尔变量
+ 可判断的选项：排序位置
+ 点击`>`箭头，将条件加到`逻辑运算选项`
+ 逻辑运算选项：运算操作符为AND

如下图所示：

![05addVariableIntoSatisfactionSurvey03](assets/05addVariableIntoSatisfactionSurvey/05addVariableIntoSatisfactionSurvey03.png)

这代表当前逻辑节点会判断==排序位置==变量的结果是否为真。

这份问卷已经设定为通过变量来判断排序的结果，当被访者对Q4排序后，==卫生情况==的排序位置大于2时，会从==逻辑节点==的==Y输出端==连线走到Q7，反之从==N输出端==连线走到Q5。


通过变量引入了更为便捷的逻辑判断，同时变量也能完成更多个性化的复杂设定。

## 2. 用逻辑节点判断多个变量

### 增加一个变量

打开变量面板，增加一个变量，按如下设定：

+ 点击创建变量并创建一个==布尔变量==
+ 变量名：就餐场景
+ 变量值：在输入框里输入==@==，在弹出菜单中选择==Q1->已选中选项->选项编号==
+ 会看到变量值输入框中创建了一个变量，点击这个变量，弹出==变量过滤==面板，按如下设定：
  + 要求：编号
  + 满足以下条件：等于，1

如下图所示：

![05addVariableIntoSatisfactionSurvey04](assets/05addVariableIntoSatisfactionSurvey/05addVariableIntoSatisfactionSurvey04.png)

选项编号对应着问卷题目的一个选项，同一道题目的选项编号是唯一的。点击Q1，在==属性编辑栏==打开==编号==开关，可以看到每个选项前会显示编号数字号码，我们需要判断的自己的工作餐选项的对应编号是==1==。因此，当变量==就餐场景==会判断被访者在Q1里是否选中了==自己的工作餐==。

### 设定变量的逻辑判断

双击逻辑节点LOGIC1，按如下依次设定：

+ 可判断的内容：选择@布尔变量
+ 可判断的选项：就餐场景
+ 点击`>`箭头，将条件加到`逻辑运算选项`
+ 逻辑运算选项：运算操作符为AND

如下图所示：

![05addVariableIntoSatisfactionSurvey05](assets/05addVariableIntoSatisfactionSurvey/05addVariableIntoSatisfactionSurvey05.png)

这代表当被访者在Q1选中了==自己的工作餐==，并且对Q4排序后，==卫生情况==的排序位置大于2时，会从==逻辑节点==的==Y输出端==连线走到Q7，反之从==N输出端==连线走到Q5。