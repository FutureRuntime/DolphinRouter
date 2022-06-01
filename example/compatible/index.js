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