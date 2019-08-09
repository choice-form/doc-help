# 2-使用逻辑控制

视频教程演练稿概要

上一集中,我们设计了一份简单流程的问卷,在这一集中我们将根据需求增加一些高级分路流程控制.

首先我们有这样一个需求:我们不项一开始就暴露自己想要对汽车进行调查的动机,而是先问别人有购买哪方面产品的的意向或需求,如果回复其中提及到汽车,才让他继续答题,,否则让他们提前结束.

这样我们就要在最开头插入一个题目,询问消费意向.
您最近是否有过以下想法？ 
买房/换房/造房
买车/换车
买/换台笔记本电脑
买/换个手机

这个题目应该开启为多选,因为消费意向可能有很多个,

接下来我们需要进行流程控制,当别人选中的消费意向中包含买车换车的话我们就要让他继续答题,否则就提前结束.

之前,我们用选择题选项输出口输入连线的方式,对某些选项指定了特殊的分路,从而达到了分路的流程控制,但是那只能针对单选类型的题目,
变成多选以后,选项变得不能输出连线了,因为如果还能输出连线的话多个选项的输出在逻辑上可能造成冲突,导致最终无法确定该走哪一条路.

这时候没法靠选项分路了,就需要另外用到逻辑节点来进行流程控制,逻辑节点可以获取之前的题目中的回复内容,然后对回复内容进行判断,来决定如何分路.

添加逻辑节点.

一顿操作猛如虎....


这样我们就用这个逻辑节点达到了分路流程控制的效果.

然后我们还有一个需求:之前我们已经把两年以后才想买车的人排除在外了.

现在我们其实对于一年半内和两年内买车的人也不太感兴趣,但是又不想直接将他们排除掉,我们真正想要的是这样:如果有人选中了一年半或两年内买车的,我们就再看一下他是否选中了买的车是第一辆车,如果是我们就排除掉他,否则我们就留住他.

我们同样使用逻辑节点来进行控制.

添加两个逻辑节点.逻辑与和或说明.

一顿操作猛如虎...


排除流程较错综复杂.
顺便使用一下中转点.
或使用多个结束来让流程更清晰.

增补说明逻辑节点可以靠选项选中之外的许多条件进行判断.

其他题型默认都是不能自己开路的.

这样我们就学会了使用逻辑来进行高级的流程控制了.

下一集我们将使用选项控制功能.


预览效果


