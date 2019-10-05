```index
2
```

```tag

```

```summary

```
# 中转节点

`中转节点`用于把连接到同一个节点的连线汇集在一起，先把这些连线一起连接到中转节点，然后把`中转节点`连接到后续节点，从而优化问卷连线的视觉效果。在连线比较复杂的情况下，添加`中转节点`可以让连线更加整洁。`中转节点`可以接受多个输入，只可以输出一次。和`中转节点`相连的连线都会变成直线。

<img src='../../assets/snapshots/nodes/breakpoint/node.png'>

## 添加中转节点
按住`Alt`键同时点击连线，就可以在连线上添加一个`中转节点`。

问卷编辑过程中，常常会有一些节点会输出到同一个节点，当这些节点分离较远时，连接他们会变得困难。

例如，问卷的第3，12，18道题目都会连接道问卷的最后一个结束节点，而这个结束节点离开这3道题目很远。这时可以利用一个`中转节点`，`中转节点`只需把自己的输出连线连接到结束节点的输入，代表中转的所有输入都会中转给这个输出，然后把中转点放到接近那3道题目的合适位置，把原本都要连接到最后一个结束节点的连线都连接到中转节点就行了。

> `中转节点`不代表任何题目，答题过程中也不会被显示，不会对答题流程产生任何影响。