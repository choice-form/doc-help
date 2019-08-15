# 使用说明书

这里是文档数据构建规则说明书

## 文档准备

文档以markdown方式编写，放在./doc目录下，在该目录下按语言代号分别命名分出顶层目录，之后每个语言的目录内部的目录可自由控制。

一般来说各个语言的内部目录应该是一致的，这样同一本文档的的多个翻译就能以相同的目录层次规则在不同的语言目录下被找到。

当然也允许某个语言相对于另外一个语言有部分目录或文件缺失，这就代表着这些文档在这个语言中暂时还没有翻译。

所以编写文档的过程中一般是先对一个主语言的文档进行编写，编写完成后，在以相同的目录为其他语言添加翻译。

文档中可能内嵌图片或者视频，对于图片直接放大仓库中，用相对路径引用即可，对于视频，不要放到仓库中，否则仓库会变得非常大，一般应该把视频上传到cdn上，然后文档中以cdn绝对路径引用该视频。

> 构建工具在扫描文档目录时.template目录会被忽略，这里是放置通用模板地方或一些临时文件的地方，不应对他们生成真实的文档资源。

## 目录转换与搜索内容

在展示文档时需要展示一个目录，这个目录是基于编辑文档时文档的目录名和文件名之间的层级关系生成的，但是生成的过程中需要依据一些配置做一些转换。

思考以下功能：
1. 编辑文档时的目录和文件名是自由控制的，没有顺序要求，但是在显示这些目录时，顺序是需要被重新控制的，这就需要有一个对目录和文件顺序的配置。

2. 编写文档时，都是统一用的英文做目录和文件名，但是在显示时候在不同的语言中应该显示为不同的名称，即使是英文下显示的目录文件名称与编辑的目录文件名称也可能是不一样的，这就需要一个针对目录和文件有一个别名配置。

文档系统需要提供搜索功能，需要提取出目录结构和所有内容之间的关系用来作为搜索的依据，也需要一些配置规则

这个配置首先依赖文档编辑时的目录结构，

对于文件来说：
+ 排列顺序的控制在每本文件的开头用特殊标记index指定,如不指定就使用默认顺序
+ 文件在列表中展示的名称就用该文将开头的大标题名称,
+ 指定tag（多个项目之间空格分割）辅助搜索，如果不指定则抽取各级标题作为tag
+ 指定summary内容辅助搜索，如果不指定，则会抽取文档的第一段作为总结内容。

所以一本文档的开头就会要求有这些检索信息：

    ```index
    1
    ```
    ```tag
    文档 标签 标签2 标签三
    ```
    ```summary
    这里是中心思想。
    ```
对于目录来说：
+ 有没有文件承载数据，所以需要在目录之下建立一个.index文件，并在其内配置index项
+ 对目录不需要搜索，所以不需配置tag项和summary项
+ 文档文件可以抽取首个大标题作为展示名，但目录没有这个标题，所以需要在.index文件中配置一个alias项，指定展示名,如果没指定就使用目录名

所以一个目录下就要创建一个.index文件，其内容形如下：

    ```index
    1
    ```
    ```alias
    目录1
    ```

有以上配置为基础后，构建工具就能抽取文档目录的数据生成目标内容



## 生成内容

构建工具拿到配置和文档内容后，进行一些列处理后，会为每个语言生成一堆信息，其中包括：
+ 总文件：里面就了支持多少中语言，每个语言对应的目录配置文件的地址，这本文件的文件名不会附加hash值，是一本json文件，需要直接从服务器上读取，而不是从cdn读取，内容如下：
```typescript
{
  'cdn': 'https://media.choiceform.com/help',
  'langs': {
    'zh-cn': {
      indexUrl: 'zh-cn/index-2jh64g78.json', // 各个语言的目录配置文件地址
      searchUrl: 'zh-cn/search-ffg45re3.json' // 搜索依据文件地址
    }
    'en-us': {
      indexUrl: 'en-us/index-4456gf67.json', // 各个语言的目录配置文件地址
      searchUrl: 'en-us/search-1122ss33.json' // 搜索依据文件地址
    }
  }
}

```

+ 目录配置：是一个json对象，存在一本json文件中，用于展示文档左侧的目录层次结构，目录结构的顺序就是数组中已经排列好的顺序。
```typescript
  [ // 是一个数组,每一项代表一个目录或文件
    {
      name: 'getting-started', // 原始文件夹名或文件名，每个语言的都相同
      alias: '快速入门' // 用于展示的文件夹名或文件名，各种语言的不一样，已经翻译好了。
      children?： [{ // 子列表，可能是文件或目录，如果当前资源是文件，则不会有该属性，同一个列表中可能存在文件和目录共存的情况。
        name: 'concept', 
        alias: '基本概念',
        url： 'zh-cn/getting-started/concept-17yh6y67.json' // 对应文档内容所在的资源地址，会有hash值
      }]
    }
  ]
```
+ 一堆静态文档资源，每一本都是一个文档资源，就是配置json对象中的url属性所指向的目标，其内容也是一个json对象，存在一本文件中，其结构如下：
```typescript
{
  tags: ['文档' '标签' '标签2' '标签三'], // 当前文档的所有的标签
  content: ''   // 是一堆html代码，用于充当文档内容。
}
```

+ 一本搜索文件，是一个json对象，保存到一本json文件中，搜索的时候可以以此为依据，结构如下：
```typescript
[ // 是一个数组
  {
    tags: ['标签1','标签2'], // 该文档的标签列表
    summary: '中心思想总结' // 该文章的总结
    url: 'zh-cn/getting-started/concept-17yh6y67.json' // 真实文档资源所在地址。
  }
]
```

这些数据会部署到一个网站服务其中。

## 前端渲染
> 前端获取各个文件是除了总文件是直接从我们的服务器上读取的其他的都是从cdn上读取的。

+ 直接到服务器中拿到总文件，从里面可以知道当前支持了多少种语言，和每个语言的目录索引资源地址。

+ 从总文件中可以知道当前语言的目录文件的cdn地址， 从而可以拿到目录配置文件，然后展示在目录列表中，
+ 点击目录中的某项则去抓取改项对应静态资源文件并渲染器标签和文档内容。前端路由切换。
+ 搜索时，拿关键字到搜索文件的数据中去匹配，将匹配中的列表展示到搜索结果中，点击某个结果，就通过该结果项的url拿到静态资源文件并渲染器内容。前端路由切换。
+ 切换语言后，去抓取切换后语言的目录配置文件，并重新展示目录列表，同时抓起之前选中的文档路径下该语言的静态资源，并渲染文档。

+ 如果前端的路由结构与目录一致的话，静态文件中HTML内容的链接就用原始的相对路径即可。








