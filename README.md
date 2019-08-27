# 使用说明

关于写文档的规则请参照[文档编写](./doc-writing.md)


## 错误检测
该仓库根目录终端运行:
```
npm run check-link
```
将会检测markdown文件中对其他markdown的链接以及对图片的链接，如果某些链接的目标文件已经丢失，则会在终端中以红色字体打印出来

同时会扫描所有的图片文件(目前仅扫描png,gif,jpg,jped后缀)，如果发现某个图片未在任何文档中被引用，将会在终端中已黄色字体打印出来。

## 发布文档内容
文档仓库主要包含三个分支：master,staging,prod，其中master用来平时编写文档用，做了某些提交就可推到服务器中。

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