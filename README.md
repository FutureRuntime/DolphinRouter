# Dolphin-Router

> 基于koa的路由中间件

[![NPM version](https://img.shields.io/npm/v/@koa/router.svg?style=flat)](https://www.npmjs.com/package/dolphin-router)

+ api兼容 [koa-router](https://www.npmjs.com/package/koa-router), 接口详情见 [API Reference](https://github.com/koajs/router/blob/HEAD/API.md)
+ 支持基于注释的路由编写，便于实现 restful 风格

## 安装

正如你所见，dolphin-router已经发布在npmjs中心仓库，你可以直接进行安装使用

```bash
# 作为依赖安装
npm i dolphin-router --save
```

## 开发者

以团队方式进行发布
```sh
npm publish --access public
```

## 基于koa的web开发示例

### 新建koa项目

以下操作，需要提前安装node.js运行环境

```bash
# 如果windows，请使用相关shell执行如下命令，如 git bash

# 创建目录
mkdir koatest

# 初始化node项目，此处为了方便，所有选项直接回车
npm init

# 安装koa框架和dolphin-router
npm i koa dolphin-router --save

# ok 项目创建完毕
```

## dolphin-router 兼容 koa-router的示例

在上述文件夹 koatest 的根目录添加 index.js 文件

```bash
touch index.js
```

在文件中添加如下代码

```node.js
// 引入koa
const Koa = require('koa')

// 当你在引入完成dprouter之后，koa-router会被实例化
// dprouter不需要再次 new 创建
const dprouter = require('dolphin-router')

// 创建koa应用
const app = new Koa()

// 添加路由规则
dprouter.get('/', async (ctx) => {
    ctx.body = 'Hello Dolphin Router!'
})

// 注册路由中间件
app.use(dprouter.routes()).use(dprouter.allowedMethods())

// 启动监听
app.listen(3000, () => {
    console.log('请访问 http://localhost:3000/ 进行测试...')
})
```

## 基于注释的路由写法

以上示例仅仅将 dolphin-router 当作koa-router使用，本中间件倡导的是注释，跟着以下步骤，写一个小demo

1. 在根目录下创建出路径 `src/controllers`, 需要注意的是，路径是默认路径，dolphin-router直接回去解析此路径(后续将提供配置的方式)
2. 创建文件 DemoController.js，此处文件名没有要求，扩展名是.js即可。需要注意的是，一个Controller里面只写一个 class，具体代码如下

```node.js

// 根目录下的index.js代码如下

const Koa = require('koa')
const dprouter = require('dolphin-router')

const app = new Koa()

// 仅仅做注册即可
app.use(dprouter.routes())
app.use(dprouter.allowedMethods())

app.listen(3000, () => {
    console.log('启动成功')
})
```

DemoController.js的代码如下所示

```node.js
module.exports = class DemoController {
    /**
     * @api {get} / hello
     */
    async hello(ctx) {
        // 简单返回
        ctx.body = 'Hello Dolphin Router!'
    }

    /**
     * @api {post} / haha
     */
    async haha(ctx) {
        ctx.body = ctx.request.body
    }
}
```

如果你指定项目controller的路径，只需要在package.json中添加几行配置, dolphin，controller以及path三个名称不可变。path的值是相对于项目根目录，你controller所在的相对路径

```json
"dolphin": {
    "controller": {
      "path": "./src/controller"
    }
}
```

`put`方法和`delete`方法和上述类似。

ok，那我们如何获取query参数、body参数以及文件呢？So easy！方法如下

+ 针对query
  `ctx.query` 或者 `ctx.request.query` 即可获取到
+ 针对body
  如果我们使用koa-router，我们可能需要引入解析body的中间件，比如 [koa-body](https://www.npmjs.com/package/koa-body)。这是一个优秀的body parser，因此dolphin对此进行了集成，并给了默认的配置。使用时如下：

  ```node.js
  // 在原有的代码基础上增加下面一句
  app.use(dprouter.koaBody())
  // 结束
  app.use(dprouter.routes())
  ...
  ```

  现在你已经可以解析body了，你可以从ctx.request.body获取到你接收到的数据，可以从ctx.request.files获取到你上传的文件。针对文件，默认会保存到**程序的运行目录**下。如果有针对koa-body其他的配置，你可以参考 [koa-body](https://www.npmjs.com/package/koa-body) 的说明，在app.use(dprouter.koaBody({yourself option...}))进行配置。

以下是一个示例

```node.js
module.exports = class DemoController {
    /**
     * 实例的demo无改动
     * @api {post} / haha
     */
    async haha(ctx) {
        // 获取文件地址
        console.log(ctx.request.query)
        console.log(ctx.request.body)
        console.log(ctx.request.files)
        ctx.body = ctx.request.body
    }
}
```
