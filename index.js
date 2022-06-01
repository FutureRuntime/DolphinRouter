const ApiDoc = require('apidoc')
const Path = require('path')
const Fs = require('fs')
const Router = require('koa-router')
const { getRule } = require('./lib/validate-rule')
const ConfigManager = require('./lib/config-manager')
const wrapperRouter = require('./lib/router-wrapper')

class DolphinRouter {
    /**
     * 初始化路径传递参数
     * @param {controller, apiextends} option 
     */
    constructor(option) {
        this._config = new ConfigManager()
    }

    getRouter() {
        // 如果controller路径不存在，不启用apidoc
        if (!Fs.existsSync(this._config.getCtlConf())) {
            const router = new Router()
            wrapperRouter(router)
            return router
        }
        const result = ApiDoc.createDoc({
            src: this._config.getCtlConf(),
            includeFilters: ['.js'],
            /** api解析规则加载 */
            parsers: this._config._getApiExtendsConf(),
            parse: true,
            silent: true
        })
        let apis = JSON.parse(result.data)
        let ret = {}
        for (let i = 0; i < apis.length; i++) {
            const api = apis[i]
            if (!ret[api.type]) ret[api.type] = {}
            ret[api.type][api.url] = {
                type: api.type,
                url: api.url,
                filename: api.filename,
                method: api.title
            }

            let parameter = {}
            let originParameter = {}
            if (api.bodyValidate) parameter.bodyValidate = api.bodyValidate
            if (api.header && api.header.fields && api.header.fields.length) {
                parameter.headers = {}
                originParameter.headers = {}
                api.header.fields.forEach(param => {
                    parameter.headers[param.field] = getRule(param)
                    originParameter.headers[param.field] = param
                })
            }
            if (api.parameter && api.parameter.fields && api.parameter.fields.query && api.parameter.fields.query.length) {
                parameter.query = {}
                originParameter.query = {}
                api.parameter.fields.query.forEach(param => {
                    parameter.query[param.field] = getRule(param)
                    originParameter.query[param.field] = param
                })
            }
            if (api.parameter && api.parameter.fields && api.parameter.fields.body && api.parameter.fields.body.length) {
                parameter.body = {}
                originParameter.body = {}
                api.parameter.fields.body.forEach(param => {
                    parameter.body[param.field] = getRule(param)
                    originParameter.body[param.field] = param
                })
            }
            if (api.parameter && api.parameter.fields && api.parameter.fields.path && api.parameter.fields.path.length) {
                parameter.path = {}
                originParameter.path = {}
                api.parameter.fields.path.forEach(param => {
                    parameter.path[param.field] = getRule(param)
                    originParameter.path[param.field] = param
                })
            }
            ret[api.type][api.url].parameter = parameter
            ret[api.type][api.url].originParameter = originParameter
        }
        let classMap = {}
        const router = new Router()

        let methods = Object.keys(ret)
        for (let i = 0; i < methods.length; i++) {
            let method = methods[i]
            let pathMap = ret[method]
            let pathArr = Object.keys(pathMap)
            for (let j = 0; j < pathArr.length; j++) {
                let path = pathArr[j]
                let r = pathMap[path]
                if (!classMap[r.filename]) classMap[r.filename] = Reflect.construct(require(r.filename), [])
                let classInstance = classMap[r.filename]
                router[method](path, classInstance[r.method].bind(classInstance))
            }
        }

        wrapperRouter(router)

        return router
    }
}

const dolphinRouter = new DolphinRouter()

module.exports = dolphinRouter.getRouter()