## 总览
这个仓库包含两块功能

第一块是文档的原始数据，这些数据在`doc`目录下按一定的[编写规则](./doc-writing.md)编写，使用`markdown`编写。


第二块是文档的编译工具，放在`task`目录下，这下面的工具按一定的规则把`doc`目录下的markdown文件编译成`json`文件放到`dist`目录下，并将这些文件部署到服务器上。

这些文件包含主要包含：
+ 一本主文件：main.json，这本文件中包含了总览信息，源数据包含结果而语言版本，每个语言版本的源数据入口地址等
+ 各个语言的数据源文件夹
   + 一些按文件夹分布好的资源文件
   + index.json 该语言的文档目录接口定义，已经每个目录下的主题所对应的资源地址
   + search.json 关键字搜索信息汇总文件，用于该帮助页面进行搜索用。

> 运行`yarn staging`可以在dist目录中编译出上述内容。

这些json文件将作为[https://help.choiceform.io](https://help.choiceform.io)或[https://help.choiceform.io](https://help.choiceform.com)这两个帮助页面的文档源数据，这两个页面分别对应正式环境和测试环境。

这两个帮助页面是由[os-help-client项目](https://github.com/choice-form/os-help-client)编写而成的，它是一个纯前端项目，它没有对应的后台，它的数据都来源于本项目构建出来的json文件。

## 错误检测
该仓库根目录终端运行:
```
npm run check-link
```
将会检测markdown文件中对其他markdown的链接以及对图片的链接，如果某些链接的目标文件已经丢失，则会在终端中以红色字体打印出来

同时会扫描所有的图片文件(目前仅扫描png,gif,jpg,jpeg后缀)，如果发现某个图片未在任何文档中被引用，将会在终端中已黄色字体打印出来。

## 发布文档内容
文档仓库主要包含三个分支：master,staging,prod，其中master用来平时编写文档用。

对于staging分支和prod分支，则是用于发布的分支，平时不要往这两个分支推代码，如果经过一段时间的编写，完档已经完成一个阶段，可以发布了，就可以在本地将master分支的内容合并到staging中，然后在将staging分支推送到服务器，这时候服务器中的webhook会被触发，从而触发我们的构建程序，就会将staging分支上的内容构建成真实文档资源，稍后构建完成，打开或刷新`https://help.choiceform.io`就能看到最新的的文档内容。

prod分支同样的规则，
staging分支对应的是测试环境 => `https://help.choiceform.io`
prod分支对应的是正式环境 => `https://help.choiceform.com`

## 快速添加语言

终端运行：
```
npm run gen-lang zh-cn jp-jp
```
就会仿照zh-cn语言的目录为jp-jp语言生成一个一模一样的目录结果，其中索引信息都带过去了，文档内容只有一个标题。
如果目标语言jp-jp已经有了自己的目录，则只会zh-cn中有的但是jp-jp中没有的一部分添加过去，jp-jp中原有的文档结构和内容不受影响。