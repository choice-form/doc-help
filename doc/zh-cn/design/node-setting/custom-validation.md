# 自定义验证

题目的验证机制用于设定问卷回复规则，避免胡乱输入的无效答案。

## 自定义验证
自定义验证在节点属性编辑栏的第二个Tab中，打开后可以看到其中包含`接口请求验证`和`内置逻辑验证`两个开关，以及一个`禁用错误信息`的开关。

### 接口请求验证
对于基本验证的无法完成的任务，可使用接口请求验证来完成验证。请求一个配置好的验证接口并传入参数，通过检查接口返回的结果来决定验证是否通过，如果没有通过验证，接口返回的内容中还可以携带未通过的原因，被访者答题过程中可以实时看到被拒绝的原因。

具体的工作方式参见[接口请求](../advance-topic/request.md)

> 接口请求验证的接口开发要求问卷设计者拥有编程能力。

### 内置逻辑验证
虽然接口验证很强大，但是要在外部开发一个接口，使用、配置都比较麻烦。内置逻辑验证可以实现一部分接口请求验证的功能，内置逻辑验证编辑器中内置了一些简单的逻辑运算功能，通过检查逻辑运算的结果可以确定验证是否通过，如果不通过还可以填写不通过的理由，让受访者看到。

关于内置逻辑运算的规则，参照[内置逻辑编辑器](../logic/logic-editor.md)

具体的内置逻辑运算工作方式参照[逻辑验证](../logic/validation.md)

> 内置逻辑验证比基本验证功能强大，但弱于接口请求验证，有点是开发较为简单。

### 禁用错误信息
设置完自定义验证后，被访者答题过程中，点击下一题时才会触发自定义验证检查。如果验证没有通过则会显示默认未通过的理由（由接口或逻辑验证设置中提供），随后要求被访者必须更改答案直到正确通过验证。

但是也可以悄悄隐藏这个错误消息，被访者回答错误时即不会显示错误提示，也不会阻止他们继续往下一题，这种情况下，这道题目会被标记为`自定义验证失败`的状态（参照[隐式变量](../variable/implicit.md)），该状态在后续问卷中可以根据进行其他操作.比如记录错误次数，超过限定值则判定为没有认真作答的废卷。

> 在初始验证中不可禁用错误消息

## 充当事件触发器

在结束节点中，有一个[请求设置](../nodes/end.md)的功能。在这里设置一个URL地址后，当被访者完成提交完数据进入结束页面时，就会调用指定的URL地址接口，起到发送通知，触发事件的效果。在这样用法下，接口其实不是用来验证，而是去干一些其他的事情，比如说发送邮件、发送短信、保存一些数据等，不过接口实现什么功能，最后都必须返回一个验证成功的数据结构作为结果。

> 在开始节点和题型节点中并没有单独提供这样的请求设置，但是可以通过自定义验证中的接口请求验证来实现这样的效果。

## 基本验证
与自定义验证类似，基本验证也可以完成验证功能，设置简单却能力有限。参见[基本验证](../logic/validation.md)