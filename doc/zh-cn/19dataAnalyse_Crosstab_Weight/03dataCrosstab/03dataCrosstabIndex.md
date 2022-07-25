---
  index: 4
  tags: [交叉统计指标类型]
  summary: 交叉统计指标类型介绍。



---



# 交叉统计指标类型

+ 样本计数
样本数量。
+ 按列占比（全部样本）
样本数量/总样本计数的百分比。
+ 按列占比（有效样本）
样本数量/有效样本计数的百分比
+ 显著性检验（全部样本）
根据按列占比（全部样本）来计算各列之间是否有显著性差异。具体算法是Z-Test。
+ 显著性检验（有效样本）
根据按列占比（有效样本）来计算各列之间是否有显著性差异。具体算法是Z-Test。
+ 显著性检验（平均值）
根据平均值来计算各列之间是否有显著性差异。具体算法是Z-Test。
+ 平均值
一组样本提供的分值的均值，算法是总分值/样本数量。
+ 中位数
一组样本提供的分值的中位数。等同于50%百分位。
百分位的算法是，把一组数值从小到大排列，处于n%位置的数值就是n%百分位。
+ 标准差
标准差是方差的算数平方根。标准差的计算方式可分为总体标准差和样本标准差，交叉表使用的是样本标准差
+ 标准误差
标准差/样本数量的平方根
+ 方差
每个样本值与全体样本值的平均数之差的平方值的平均数。
+ 总样本计数
对某列的维度有贡献的样本的总数。
+ 有效样本计数
同时对某列和某行的交叉维度有贡献的样本的总数。在巧思问卷中，如果行题目可选回答的情况下，有效样本计数可能比总样本计数要小。
+ 百分比全面统计测试
根据有效样本计算卡方测试，具体会算出四个值：卡方，自由度，P值，显著相关性
+ T2B计数
对打分题（提供数值的维度）而言，T2B用来计算最高的两个分值的样本数量的总和。
+ T2B百分比（全部样本）
T2B计数/总样本计数的百分比
+ T2B百分比（有效样本）
T2B计数/有效样本计数的百分比
+ T3B计数
对打分题（提供数值的维度）而言，T3B用来计算最高的三个分值的样本数量的总和。
+ T3B百分比（全部样本）
T3B计数/总样本计数的百分比
+ T3B百分比（有效样本）
T3B计数/有效样本计数的百分比
+ B2B计数
对打分题（提供数值的维度）而言，B2B用来计算最低的两个分值的样本数量的总和。
+ B2B百分比（全部样本）
B2B计数/总样本计数的百分比
+ B2B百分比（有效样本）
B2B计数/有效样本计数的百分比
+ B3B计数
对打分题（提供数值的维度）而言，B3B用来计算最低的三个分值的样本数量的总和。
+ B3B百分比（全部样本）
B3B计数/总样本计数的百分比
+ B3B百分比（有效样本）
B3B计数/有效样本计数的百分比
+ NPS计数
限定打分题分值范围是0-10分的情况下，最高分的2个分值(9-10)的样本数量减去最低分的7个分值(0-6)的样本数量
+ NPS百分比（全部样本）
NPS计数/总样本计数
+ NPS百分比（有效样本）
NPS计数/有效样本计数