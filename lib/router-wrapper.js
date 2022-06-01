const Koabody = require('koa-body')
const Path = require('path')

function wrapper(router) {
    router.koaBody = function (options) {
        // 默认配置koabody
        const dolphinDefaultBody = {
            multipart: true,
            encoding: 'utf-8',
            formidable: {
                uploadDir: Path.join(process.cwd()),  // 上传目录, 默认放置于启动程序的根目录
                keepExtensions: true, // 保持文件的后缀
                maxFieldsSize: 10485760 // 默认文件大小10mb
            }
        }
        return Koabody(Object.assign(dolphinDefaultBody, options));
    }
}

module.exports = wrapper