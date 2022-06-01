module.exports = class DemoController {
    /**
     * @api {post} / hello
     */
    async hello(ctx) {
        ctx.body = {
            body: ctx.request.body,
            query: ctx.request.query,
            files: ctx.request.files,
            header: ctx.request.header
        }
    }
}