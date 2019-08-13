# 选项互斥

在多选题中，有时有些选项比较特殊，彼此间会存在一种互相排斥的关系。当选了某个选项时，另外一个就不应该被选中，这时候就要用到选项排他功能。

因为单选题不存在选项互斥的可能，因此只有开启多选后才能使用选项互斥设置，对选择类型的题目开启多选后，打开选项的[附加设置](./option.md#附加设置)，就能看到选项排他设置框。点击设置框右边的箭头按钮，可以改变里面的值，有以下状态：
+ `N`：表示该选项不排他：
+ 1-9的数值：代表互斥编号，可设定为1-9之间的数值，当该选项被选中时，会排除掉和自己互斥编号相同的选项以及`EXC`的选项；
+ `EXC`：表示该选项与所有其他选项排斥，只要选中该选项，其他任何选项都自动会被取消选中，当选中任何其他选项时，这个选项也会自动被取消选中。
