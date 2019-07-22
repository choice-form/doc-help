# 接口请求


> 前提：该功能要求问卷设置者拥有编程能力，或者寻找程序员小伙伴帮忙。

针对一些复杂的逻辑运算和判断，内置逻辑运算功能无法满足需求，这时候可以请求外部的程序帮忙运算出结果。

接口请求在[接口请求变量](../variable/request-type.md)，[节点自定义验证](../node-setting/custom-validation.md)，[开始节点出示验证](../nodes/start.md)，[结束节点的结束请求](../nodes/end.md)等地方使用到了。

<img src='./images/request.png'>

上图是一个接口请求的设置案列，点击头部的下拉列表可以选择请求方式，请求方式包含GET/POST/FAKE三种，然后可以填写要请求的地址，最后是设置任意个请求的参数名和参数值。

当答题过程中运行到使用了请结构请求的地方，就携带参数往指定地址放松一次请求，并期待接口返回一下格式的数据：

```typescript
    {
        result: {string|number|boolean}   // 计算结果，如果是验证性接口，返回false代表验证失败，返回true代表验证成功，非验证性的接口返回数值或字符转作为计算结果
        message?: string // 针对验证型的结构，如过result属性是false，没有通过验证，这时应该通过message属性携带一个验证失败的理由，
    }
```

关于返回结果的message属性还可添加带有特殊意义的格式，不同的格式对答题页会造成不同的影响：
+ 如果是 `https://` 开头的URL，则受到返回结果后会跳到该地址。
+ 如果是 `vital:` 开头的消息,则会报出消息并终止答题。
+ 非以上两种格式的结果将会已下拉警告的方式滑出消息。

## 请求方式：
+ GET: 以HTTP的GET方式请求远程接口,参数会当成queryString拼接到url后面。
+ POST: 以HTTP的POST方式请求远程接口，参数会放到body中。
+ FAKE: 一种自定义的方式，下面会详细讲解。
+ EMBED: 一种自定的方式，下面会信息讲解。


### FAKE方式请求

GET和POST方式都是请求远程后台程序的接口，如果受访者人数众多，突然涌入可能导致接口压力较大，所以对于某些并非后台程序才能进行的辅助计算，提供了一种叫FAKE的解决方式。

FAKE请求并不要求后台接口，而是要求一本服务器上部署好的javascript脚本，这本脚本需要按指定的规范编写，调用某个FAKE接口其实是执行某个这种规范的脚本中的某个方法。

下面用案列说明：

如果你要用`FAKE`方式调用接口`https://xxx.test.com/plugin/sum_gt0`，并且该接口要求两个参数`number1`和`number2`，这个接口的作用是判断两个数相加是否大于0。同时还要调用`https://xxx.test.com/plugin/gt`, 该接口也要求两个参数`number1`和`number2`，这个接口的作用是判断前面一个数是否大于后面这个数。
> 上面的`https://xxx.test.com/plugin`是一个举例，真实场合你想部署到那个url都行。
> 上面两个例子运算太简单了，其实用编辑器的内置逻辑运算就能做到，这里仅仅是为了举例，一般来说非常复杂的运算才使用接口。

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
        // 并在这个方法后面以这个方式标注名参数规范
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
        // 并在这个方法后面以这个方式标注名参数规范
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

3. 编辑的请求设置编辑栏（参照上图）中，将请求方式设置为`FAKE`，地址填写`https://xxx.test.com/plugin/sum_gt0`，并添加两个参数number1和number2,并各自给他们指定一个值，对于另个一接口则地址填写`https://xxx.test.com/plugin/gt`，参数也相同指定即可。

> 地址其实就是脚本所在的地址去除掉.js后缀再接上对应的方法名。

4. 申请可信任白名单，因为脚本会部署到你自己的服务器上，而这个服务器地址默认是不在系统的可信任白名单上的，这时候你可以练习客服，客服了解情况后会把你的脚本所在地址加入白名单。

> 系统会拒绝加载不在白名单地址的脚本。

> 如果检测到你的服务器地址中的FAKE脚本中包含不安全的执行代码，则会将其移出白名单。

5. 如果以上几步都完成，则问卷运行到使用了该请求设置的地方，就会执行该脚本中的指定方法得到计算结果。
 

### EMBED方式请求

如果仅仅使用简单的逻辑计算，则FAKE部署方式过于繁琐，这时可以使用EMBED方式，EMBED方式，允许在编辑器中直接编写`javascript`代码。

在[内置接口](../embed-api/)可以添加内置接口。

当选择了EMBED方式时，不再会有url输入框，而是变成一个下拉列表，在下拉列表中可以选择使用之前添加过的`内置接口`。
