# 隐式变量
无需手动创建，而是满足某些条件就会出现的变量叫隐式变量。

常见的隐式变量都是从节点中产生的。

在[变量选择器](./usage.md#变量选择器)中的节点列表中选中任何一个节点都能查看其下包含哪些隐式变量。

下面列出并讲解：
## 节点中抽取的常用变量：
+ 节点名称：目标节点的名称，在右侧编辑栏也叫编号。
+ 节点图片：目标节点的图片。
+ 节点问题：目标节点的问题文字。
+ 节点标签：目标节点的标签
+ 节点描述：目标节点的问题描述。
+ 消耗时间：受访者回答目标题目目消耗的时间，以毫秒为单位。
+ 结果：受访者在目标题目做出的回答内容。
+ 耗时过长：布尔变量，受访者回答目标题目的耗时是否多于[时间设置](../timing/concept.md)中指定的时间
+ 耗时过短：布尔变量，受访者回答目标题目的耗时是否少于[时间设置](../timing/concept.md)中指定的时间
+ 自定义验证失败：布尔变量，受访者回答目标题目的内容是否在进行自定义验证时失败了。
+ 自定义验证失败次数：布尔变量，受访者回答目标题目的内容是否在进行自定义验证时失败了几次。
+ 手机号码：目标验证节点中受访者填入的手机号码，仅验证节点可用。
+ 密码/验证码：目标验证节点中受访者填入的密码验证码，仅验证节点可用。
+ 手机已使用过：布尔变量，目标验证节点中受访者填入的手机号码是否在之前某次回答该问卷时使用过，仅验证节点可用。

除了直接从节点中抽取变量，还可以节点的某些过某个选项总抽取变量，要从选项中抽取变量，先得确定从那些或哪个中抽取，这是就要用到节点中抽取的变量组。


## 节点中抽取的常用变量组
> 选项范围不不包含其他选项

+ 全部选项：以目标题目的全部选项为前提进行后续的变量抽取。
+ 已选中的选项：以目标题目的已选中选项为前提进行后续的变量抽取。
+ 未选中的选项：以目标题目的未选中选项为前提进行后续的变量抽取。
+ 匹配的选项：以目标题目的已匹配选项为前提进行后续的变量抽取。仅定位题相关题目，它的匹配其实就是选中。
+ 未匹配的选项：以目标题目的未匹配选项为前提进行后续的变量抽取。仅定位题相关题目，它的匹配其实就是选中。
+ 已打分的选项：以目标题目的已打分选项为前提进行后续的变量抽取。
+ 未打分的选项：以目标题目的未打分选项为前提进行后续的变量抽取。
+ 已输入的选项：以目标题目的已输入选项为前提进行后续的变量抽取。
+ 未输入的选项：以目标题目的未输入选项为前提进行后续的变量抽取。
+ 已排序的选项：以目标题目的已排序选项为前提进行后续的变量抽取。
+ 未排序的选项：以目标题目的未排序选项为前提进行后续的变量抽取。
+ 指定选项：自行指定某个选项为前提进行后续的变量抽取。这里可以指定其他选项。

+ 定位：仅针对定位题，里面包含一些定位信息
    + 其中的`坐标，国家，省份，城市，区/县`和系统内置变量中的意义相同。
    + 失败：布尔变量，为真时表明目标节点定位失败。
    + 成功：布尔变量，为真时表明目标节点定位成功。
    + 失败且允许跳过：布尔变量，为真时表明目标节点定位失败，且因为开启了[定位失败可跳过](../nodes/location.md#定位方式)功能而自动有必答题转为了非必答题。
  

有了选项的范围分组为前提就可以从选项中提取变量了

## 选中抽取的常用变量
+ 选项文字： 目标选项的选项文字
+ 选项编号： 目标选项的选项编号
+ 选项分值： 目标选项的选项分值
+ 选项输入内容： 目标选项的选项输入内容
   > 对于填空题打分题等输入类型的题目，选项分值和选项输入内容其实指向的是相同的内容
+ 选项输入提示：目标选项的选项输入提示
+ 选项数量： 满足之前变量组条件所有选项的数量
+ 选项标签： 目标选项的标签
+ 映射属性1-6：一共有6个，分别对应[`映射属性`](../logic/option-mapping.md)设置中设置的6个映射数据
+ 选项图片：目标选项的图片
    > 插入到选项文字的的媒体变量虽然会被展示位图片一样，但他不是选项图片，而是选项文字的一部分，选项图片专指选项中通过图片选择器选中或者通过选项引用获取到的图片对象。
+ 选项图标：目标选项的图标


## 隐式引用传递

进行选项引用的时候是默认会生成一个`隐式引用传递数据`

对于打分题，选择题等题目来说默认是不会有选项图片的，所以如果引用了他们的的选项的图片，基本上是会引用不到内容的，但是如果之前有生成有效的`隐式引用传递数据`时，仍然可能引用到图片。

举例：有一个打分题`M1`，它后面有一个图片题`P1`，这时候`P1`如果引用`M1/全部选项/选项图片`，则会一个选项也引用不到，因为`M1`的选项默认是没有图片的；但是如果此时我们在`M1`前面添加要给演示评价题`R1`，演示评价题的选项是携带图片的，然后`M1`中引用`R1/已打分的选项/选项文字`作为自己的选项，`M1`虽然没有引用`R1`的选项图片（UI操作中也禁用了这样的操作，因为图片对于打分题选项是无用的），而是引用的选项文字，但是其实`M1`在引用`R1`选项的时候除了目标内容（此处为选项文字）以外，还会尝试把各种其他内容都引用过来的放到某个地方作为`隐式引用传递数据`，只是不会表现出来，也不会使用；后续在`P1`中引用了`M1`的图片时，`M1`发现自己的选项没有图片，就会去该选项的`隐式引用传递数据`中找，结果找到了从`R1`中隐式传递过来的图片数据，这样`P1`就顺利引用到了图片。

不仅仅是图片，其他数据如`选项分值`，`选项输入内容`等也有这样的功能，不过`选项图片`的该功能最经典。

如果自身选项中就有了某个数据，则被引用时优先使用自身选项的这个数据，这时候即使`隐式引用传递数据`中也有这个数据，但是它已经没有机会了(后续节点也不会有机会)，它被自身选项的相同数据屏蔽掉了，而且在后续节点的`隐式引用传递数据`也会存放更新后的数据。