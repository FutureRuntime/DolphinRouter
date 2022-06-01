class PathNotExsitError extends Error {
    constructor(message) {
        super(message)
        this.name = 'PathNotExsit'
    }
}

module.exports = {
    PathNotExsitError
}