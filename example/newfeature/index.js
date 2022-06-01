const Koa = require('koa')
const dprouter = require('dolphin-router')
 
const app = new Koa()
 
// 仅仅做注册即可
app.use(dprouter.koaBody())
app.use(dprouter.routes())
app.use(dprouter.allowedMethods())
 
app.listen(3000, () => {
    console.log('请访问 http://localhost:3000/ 进行测试...')
})