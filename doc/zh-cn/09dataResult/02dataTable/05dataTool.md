---
  index: 5
  tags: [生成测试，测试数据, 测试, 测试问卷, 工具, 数据表格, 数据结果]
  summary: 在问卷正式上线前，自动生成批量测试数据。


---



# 工具

## 生成测试

在问卷正式上线前，可以通过测试问卷体验被访者的回复过程，并检查问卷跳转逻辑和相关设定的正确性，但测试问卷数据不会被记录，这时可以使用==生成测试==功能自动批量生成测试数据。

进入数据==表格==版块，当问卷还没有数据时，系统会提示用户生成测试或者开始收集回复，点击==生成测试==按钮。

<img src='../assets/02dataTable/05dataTool/noDataResult.png'>

在弹出窗口中设定数量，随后点击==开始测试==。

<img src='../assets/02dataTable/05dataTool/buildTestData.png'>

系统开始自动生成测试数据，生成成功或者失败的状态会实时在对话框中反馈，生成完毕后关闭对话框。

<img src='../assets/02dataTable/05dataTool/buildingTestData.png'>

随后可以看到系统已经生成相关测试数据，测试数据无法在系统中进行数据分析，但用户可以下载测试数据进行进一步检查。

<img src='../assets/02dataTable/05dataTool/testDataResult.png'>

> 有些带有外部接口或者接口变量的问卷无法自动生测试数据。

## 添加测试数据

在工具下拉列表中点击生成测试，输入数量后，在当前数据结果中添加更多测试数据。

<img src='../assets/02dataTable/05dataTool/testDataTool.png'>

测试数据在状态列中的标记为==测试数据==，而问卷正式发布后收集的数据状态为==正式提交==，可以通过过滤器单独过滤出测试数据，或者正式提交数据。

<img src='../assets/02dataTable/05dataTool/exportTestData.png'>

与正式提交的数据一样，测试数据也可以输出到文件进行进一步分析判断。