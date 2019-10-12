```index
3
```
```tag

```
```summary
```

# 完整预览

点击`问卷编辑器`顶部`问卷发布工具栏`上的`预览`按钮，打开`问卷预览窗口`，鼠标移入预览窗口后，窗口顶部会浮出`实时预览`和`完整预览`按钮，`实时预览`用来预览单个题目，`完整预览`用来预览整份问卷。点击按钮切换[`实时预览`](./full.md)或`完整预览`模式。

进入`完整预览`模式后，会触发`自动保存`，保存完毕后，预览窗口呈现问卷页面效果。`完整预览`页面会停在问卷封面，点击`开始`就可以模拟被访者答题了。答完一道题后点击`下一题`继续后面的问卷题目。随着`完整预览`模式中的题目更新，画布会自动选中该题并定位到画布中间，从视觉上立刻知道当前做到了问卷的哪个位置，所以特别适用于测试问卷流程和分支。

> 存在错误的问卷，打开`完整预览`时会提示错误提示，参见[错误检测与调试](../advance-topic/debug.md)。

`完整预览`的过程基本和正式答题的过程一样，除了以下几点：
+ 正式答题页面不会有顶部的预览测试条及预览工具按钮。
+ 完整预览中针对[验证节点](../nodes/verify.md)不会真进行验证，填入任何内容都可通过。
+ 完整预览中完成问卷后不会提交数据。
+ 完整预览中的结束页面会有一个`返回测试`的按钮，方便预览者回到之前的题目，正式答题页面不会出现这个按钮。
+ 完整预览中的抽奖和领奖都是模拟的，不会产生任何奖励。
+ 完整预览中会拒绝跳转到`结束跳转链接`。

如果预览过程中，发现问卷中某些设置不对而进行了更改，需要手动点击`问卷预览窗口`上方`刷新`按钮加载最新的问卷内容，从头开始预览。

点击预览页面头部`预览测试`提示条右侧的工具按钮，打里面包含`书签`和`时间`两个功能。

## 书签
在`书签`工具页面中输入书签名称，点击`添加书签`按钮，当前预览进度就会被保存起来。刷新页面后，打开`书签`工具页面，能看到之前保存过的所有书签，点击书签名称就能恢复到该书签保存的预览进度。点击该书签最右侧的`删除`按钮移除该书签。

如果你删除了节点的某些选项，而`书签`中正好保存了该选项的状态，恢复`书签`时，会停在这道题目上，这时可以手动重新作答该题，然后继续后续的题目，后续的题目会依然恢复成`书签`中保存的内容。

`书签`页面底部还有个题目列表，这是当前所有作答过的题目列表，点击题目右侧的跳转按钮可重新快速跳回到该题目。

## 时间
在`时间`工具页面的下方，会列出预览过程中在回答每道题目上消耗的时间和全部题目上消耗的总时间。
可以输入名称标记并上传时间数据，上传后在[计时设置](../timing/concept.md)面板中就能看到标记的时间数据，可用于统计估算出每道题合适的作答时间。

完整预览后，问卷就不存在显性的逻辑错误、配置错误了，这时点击`问卷编辑器`顶部`问卷发布工具栏`的`测试`按钮，会展现测试二维码和测试链接，把该地址和二维码分享给其他人，就能让更多人参与测试了，如果需要更多测试数据估算答题时间的话，记得让他们上传自己的答题时间。

> 答题时间控制，一般只有针对某些对时间很敏感的问卷或题目。
