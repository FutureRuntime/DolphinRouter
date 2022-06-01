const Path = require('path')
const Fs = require('fs')

class ConfigManager {

    /**
     * 给出程序根路径的配置
     * @param {*} option 
     */
    constructor(option) {
        // 项目根目录
        this._baseDir = option && option.baseDir || process.cwd()

        // controller 默认目录
        this._ctlPath = Path.join(this._baseDir, './src/controllers')
        
        // apiextends 默认目录
        this._extPath = Path.join(this._baseDir, './src/apiextends')

        // package.json配置目录
        this._packJson = Path.join(this._baseDir, 'package.json')

        const packageInfo = require(this._packJson)

        if (packageInfo.dolphin 
            && packageInfo.dolphin.controller 
            && packageInfo.dolphin.controller.path) {
                this._ctlPath = Path.join(this._baseDir, packageInfo.dolphin.controller.path)
        }

        if (packageInfo.dolphin 
            && packageInfo.dolphin.extend 
            && packageInfo.dolphin.extend.path) {
                this._extPath = Path.join(this._baseDir, packageInfo.dolphin.extend.path)
        }
    }



    getCtlConf() {
        return this._ctlPath
    }

    _getApiExtendsConf() {

        // 默认加载官方parser
        const parserRules = this._getOfficialParsers()
        
        // 如果路径不存在直接跳过
        if (!Fs.existsSync(this._extPath)) {
            return parserRules
        }
        const parentDirs = Fs.readdirSync(this._extPath)
        parentDirs.forEach(singleParserDir => {
            const result = this._getAimFile(Path.join(this._extPath, singleParserDir))
            Object.assign(parserRules, { [result.desc.descName]: result.desc.path })
        })
        return parserRules
    }

    _getOfficialParsers() {
        return { apiparam: Path.join(__dirname, '../offical-parser/apiparam-parser.js') } || {}
    }

    _getAimFile(singleParserDir) {
        const specTwoFiles = Fs.readdirSync(singleParserDir)
        const result = {}
        specTwoFiles.forEach(fileName => {
            const fileNameInfo = fileName.split('.')
            if (fileNameInfo[1] === 'desc') {
                result.desc = {
                    descName: fileNameInfo[0],
                    path: Path.join(singleParserDir, fileName)
                }
            }
            if (fileNameInfo[1] === 'exec') {
                result.exec = {
                    execName: fileNameInfo[0],
                    path: Path.join(singleParserDir, fileName)
                }
            }
        })
        return result
    }

}

// 配置类直接导出，单例效果
module.exports = ConfigManager