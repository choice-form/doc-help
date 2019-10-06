```index
2
```
```tag

```
```summary

```
# 接口请求验证
对于个性化的自定义验证需求，可使用`接口请求验证`来完成验证。`接口请求验证`的接口开发要求具备基础编程能力。

`接口请求验证`会请求一个配置好的验证接口并传入参数，通过检查接口返回的运算结果来决定验证是否通过。如果没有通过，接口返回的内容中还可以携带未通过验证的原因说明，被访者答题过程中可以实时看到被拒绝的原因。`接口请求验证`的优点是功能强大。

## 接口请求验证的使用场景
`接口请求验证`在以下地方都可以使用，熟练使用后能极大扩展问卷性能。
+ [接口请求变量](../16varible/06requestVarible.md)
+ [节点自定义验证](../14customValidation/01customValidation.md)
+ [开始节点验证](../10nodes/otherNodes/01start.md)
+ [结束节点的结束请求](../10nodes/questionnaireNodes/17end.md)

## 请求方式：
下图是一个接口请求的设置，点击头部下拉列表选择请求方式，请求方式包含：GET、POST、FAKE、EMBED。
<img src='./images/request.png'>

+ GET: 以HTTP的`GET`方式请求远程接口,参数会当成queryString拼接到url后面。
+ POST: 以HTTP的`POST`方式请求远程接口，参数会放到body中。
+ FAKE: 自定义的请求方式。
+ EMBED: 自定义的请求方式。

### GET
  设定`GET`请求方式并填写请求地址。随后，设置添加请求的参数名和参数值。

  答题过程中，当问卷运行使用接口请求的地方时，就会携带参数往指定地址发送一次请求，并期待接口返回以下格式的数据：

```typescript
    {
        result: {string|number|boolean}   // 计算结果，如果是验证性接口，返回false代表验证失败，返回true代表验证成功，非验证性的接口返回数值或字符转作为计算结果
        message?: string // 针对验证型的接口，如果result属性是false，没有通过验证，这时应该通过message属性携带一个验证失败的消息，
    }
```

  返回结果的`message`属性还可添加带有特殊意义的格式，不同格式会对答题页造成不同的影响：
  + `https://`开头的URL：收到返回结果后会跳到该地址，离开问卷。
  + `vital:`开头的消息文本：收到返回结果会弹出消息文本并终止答题。
 + 其他消息文本：以下拉警告浮窗的方式滑出该消息文本。

### POST
设置与`GET`相同，只是请求方式的区别。

### FAKE方式请求

`FAKE`请求是调用服务器上部署好的`javascript`脚本，该javascript脚本需要按指定的规范编写。

下面用案例说明如何通过请求实现以下需求：

+ 用`FAKE`方式调用接口`https://xxx.test.com/plugin/sum_gt0`，并且该接口要求2个参数`number1`和`number2`，接口作用是：判断2个数相加是否大于0；
+ 同时，还要调用`https://xxx.test.com/plugin/gt`, 该接口也要求2个参数`number1`和`number2`，接口作用是：判断number1数是否大于number2。

则需按下面的步骤操作：

1. 首先按如下规范编写一个脚本
```javascript
    (function () {
        // 前面三行这样写,这是定死的规则
        var plugin = window.CFPlugin = window.CFPlugin || {};
        var server = plugin.fakedServers = plugin.fakedServers || {};
        var space = plugin.currentSpace;

        /**
        * 在server中按下面的规则添加一个方法,则该方法会负责该命名空间下的sum_gt0接口的请求
        * 即对 https://xxx.test.com/plugin/sum_gt0 发起的请求其实会调用该方法,被该方法
        * 接收并处理
        */
        server[space + '/sum_gt0'] = function (data) {
            // 这里用到了data中的两个属性number1和number2,这是参数,
            // 返回格式参考上面规范
            return {
                result: Number(data.number1) + (data.number2) > 0,
                message: 'message',
            };
        };
        // 并在这个方法后面以这个方式标注参数规范
        server[space + '/test'].params = ['number1', 'number2']

        /**
        * 在server中按下面的规则添加一个方法,则该方法会负责该命名空间下的gt接口的请求
        * 即对 https://xxx.test.com/plugin/gt 发起的请求其实会调用该方法,被该方法
        * 接收并处理
        */
        server[space + '/gt'] = function (data) {
            // 这里用到了data中的两个属性number1和number2,这是参数,
            // 返回格式参考上面规范
            return {
                result: Number(data.number1) > (data.number2),
                message: 'message',
            };
        };
        // 并在这个方法后面以这个方式标注参数规范
        server[space + '/test'].params = ['number1', 'number2']

        // 下面的是补充说明
        // 所以: 对 https://xxx.test.com/plugin/test_2 的请求将会被下面这个方法处理掉
        server[space + '/test_2'] = function (data) {
            // input code here
            // 具体的规则都写到这个方法里面
            return {...}
        }
        // 如果要伪造 https://example.cf.io/fake/test 接口
        // 则需要一本fake.js的脚本部署到 https://example.cf.io 中,并且按上面的格式编写,有一个'test'方法即可
    })();
```

2. 将该脚本部署到服务器上，保证通过`https://xxx.test.com/plugin.js`地址能访问到刚才的那本脚本。

3. 将请求方式设置为`FAKE`，地址填写`https://xxx.test.com/plugin/sum_gt0`，并添加2个参数`number1`和`number2`，并各自指定一个值。对于另个一接口则地址填写`https://xxx.test.com/plugin/gt`，参数也按相同规则指定。
> 地址其实就是脚本所在的地址去除掉`.js`后缀，再接上对应的方法名。

4. 因为脚本会部署到用户自己的服务器上，并不在本系统的可信任白名单上。这时，可以联系我们的客服，客服会把脚本所在地址加入系统白名单，系统会拒绝加载不在白名单地址的脚本。
> 如果检测到脚本中包含不安全的代码，或问卷接到被访者投诉，客服会随时将其移出白名单而不实现通知。账号可能会被禁用。

5. 如果正确完成以上步骤，则问卷运行到使用该请求的地方时，会执行脚本指定方法，得到最终计算结果。 
> 一般来说非常复杂的运算或者个性化场景才建议使用接口，例如传入CRM里的用户基本信息。

### EMBED

`EMBED`方式允许在编辑器中直接编写`javascript`代码，达到和`FAKE`方式相同的效果，并且更简单。选择`EMBED`方式时，会显示一个下拉列表，在下拉列表中选择之前添加过的`内置接口`。

一般来说，代码量较少时可以使用`EMBED`方式。代码量很多的时候，使用`FAKE`方式维护起来更方便。当问卷上线后，`EMBED`方式必须先停止问卷才能修改，使用`FAKE`方式则没有这个限制。

> 如果检测到问卷在`EMBED`方式中使用了不安全的脚本，或问卷接到被访者投诉，客服会随时将其移出白名单而不实现通知。账号可能会被禁用。

