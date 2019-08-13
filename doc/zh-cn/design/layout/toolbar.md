# 问卷组件工具栏

问卷组件工具栏上整合了问卷编辑系统核心功能组件的入口，鼠标覆盖按钮后会出现提示文字，点击后会滑出具体的组件工具面板。从上到下依次是：
1. 新增节点
2. 媒体库
3. 主题
4. 变量库
5. 计时器
6. 节点导航
7. 内置接口
8. 打印问卷
9. 文件操作
10. 帮助

## 新增节点
点击滑出新增节点库面板，其中包含`节点`和`模块`两个功能区，点击面板上方的tab按钮切换功能区。

<img src='./images/node-kit.png' height='600'>

节点库面板里是系统支持的所有基本节点和工具节点。
节点功能区包含基本节点和工具节点两个栏目：
+ 基本节点：问卷系统的各种题型节点；
+ 工具节点：问卷系统的各种功能工具，不作为问卷题目，而是为问卷提供辅助的功能；

点击某个节点，就可以在画布区新增一个该类节点。如果按住鼠标将节点拖动到画布的指定位置后释放鼠标即可在指定的位置添加节点。

> 节点的具体功能参见[节点种类](../nodes/concept.md)

模块区域里是用户保存的各类问卷内容模块。问卷内容模块是一组已编辑好的节点的集合，有时候，因为某些题目的组合经常在不同问卷中都会被使用，我们可以把这一堆题目节点存储为一个问卷内容模块，之后，在同一账号或组织里都能看到保存的问卷内容模块。使用时，拖拽内容模块到画布区，就能在当前问卷中添加该内容模块。

> 可自行增加问卷内容模块，参见[节点组与模块](../groups/concept.md)。

选中该模块后下方会显示该内容模块的信息面板，标明该模块创建者、创建时间、包含的节点数量、变量数量、图片或视频数量等等。点击信息面板上方的删除按钮，可以删除该模块。

> tab按钮下方的网格按钮用于切换排列方式。


## 媒体库

点击滑出媒体库面板，其中包含`图片库`和`视频库`两个功能区。

媒体库用来管理当前问卷中用到的媒体资源。

<img src='./images/assets-kit-cn.jpg'>

新建的问卷默认没有图片和视频，点击下方的`上传`按钮上传媒体文件，如果文件内容较大，上传按钮上会显示上传进度。上传完成后，媒体资源会显示在列表中。
媒体资源可以在`节点`和`变量`中引用，已经在问卷中被使用的媒体资源右上角会有一个三角形标记。如果三角形是半透明的，则说明该媒体资源虽然被引用了，但是使用它的节点或变量并没有被问卷实际使用。
选中媒体资源，下方滑出该媒体资源的详细信息面板，同时按钮也变成了`替换`按钮，此时点击`替换`按钮并重新选择一个媒体文件上传，将会替换当前的媒体文件。
> 替换媒体资源会自动更新问卷里所有使用该媒体资源的地方。

鼠标覆盖详细信息栏面板右上角的三角形，就可以看到该媒体资源被哪些对象引用了，点击对象名称，将会定位到该对象。

> 关于媒体的使用方法参见[图片的使用](../media/image.md)和[视频的使用](../media/video.md)。关于媒体在变量中的使用请参照[媒体变量](../variable/media-type.md)。

点击详细信息栏上的定位图标，可以定位当前媒体文件在列表中的位置，这个操作在媒体文件较多，而且当前媒体文件不在滚动条可视区域内时非常有用。点击定位图标旁边的删除图标，则会删除该媒体资源，如果该媒体资源被引用了，则删除之前会弹出确认框。

对于视频资源，会默认使用视频的首帧作为缩略图，也可以自己重新选一张图片作为缩略图。
> 视频刚上传完成时，可能正在解码而无法观看，完成解码后，详细信息栏里可以预览观看该视频。

## 主题

点击后滑出主题库面板，用于问卷样式控制。

<img src='./images/theme-kit-cn.jpg'>

> 关于问卷样式的具体控制技巧，参见[主题与样式控制](../theme/concept.md)。


## 自定义变量

点击后滑出变量库面板，变量库用于创建和管理问卷使用到的显式变量。

<img src='./images/variable-kit-cn.jpg'>

点击`创建变量`，然后选择变量类型，在滑出的变量设置面板中添加变量名和变量值，设置完毕后就能添加一个变量.

点击变量列表中的某个变量，右侧变量设置面板中就会展现该变量的内容，右上角的三个按钮分别能定位变量、复制变量和删除变量，

变量可以在节点中使用，也可以被其他变量中当成运算项再次被使用，被使用过的变量列表项的右上角会有一个三角形标记，如果三角形是半透明的，则说明该变量虽然被引用了，但是使用它的节点或变量并没有被问卷实际使用。选中变量后，右侧滑出的变量设置栏中会显示被哪些对象使用了，点击对象名称，将会定位到该对象。

> 变量是设计复杂问卷的利器，但要使用好它则必须掌握变量的详细规则和概念，详情参见[变量栏目](../variable/concept.md)里面的完整说明。


## 计时器
点击后滑出时间设置面板，用于控制问卷及每道题的答题时间。

> 时间设置会对问卷的数据收集进程带来一些限制，关于时间设置的具体用途，请参见[时间设置](../timing/concept.md)

## 节点导航

点击后滑出节点导航栏面板，节点导航面板列出所有问卷节点，包括已使用和未使用节点在内。支持一键删除未使用节点。
拖拽每个题目右边的列表图标可以改变题目的次序，这个次序将会成为问卷数据结果展现时题目列的默认顺序。

<img src='./images/navigator-kit-cn.jpg'>

可对题目节点打星标。


## 内置接口

点击后滑出内置接口面板，用于管理和编写内置接口代码，详情参见[内置接口栏目](../embed-api/concept.md)。

## 其他

+ 打印问卷：打开问卷打印预览页面，详情参见[问卷打印预览](../preview/print.md)。
+ 文件操作：导入或导出问卷，详情参见[问卷导入导出](../advance-topic/import-export.md)。
+ 帮助：常用系统帮助链接。
