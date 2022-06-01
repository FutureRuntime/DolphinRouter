function getRule(param) {
    let rule = []
    if (!param.optional) rule.push('required')
    switch (param.type.toLowerCase()) {
        case 'number':
            rule.push('numeric')
            if (param.size) {
                if (param.size.indexOf('-') > -1) {
                    let temp = param.size.split('-')
                    temp[0] && rule.push(`min:${temp[0]}`)
                    temp[1] && rule.push(`max:${temp[1]}`)
                } else if (/^\d+$/.test(param.size)) {
                    rule.push(`max:${param.size}`)
                }
            }
            break
        case 'string':
            rule.push('string')
            if (param.size) {
                if (param.size.indexOf('..') > -1) {
                    let temp = param.size.split('..')
                    temp[0] && rule.push(`min:${temp[0]}`)
                    temp[1] && rule.push(`max:${temp[1]}`)
                } else if (/^\d+$/.test(param.size)) {
                    rule.push(`max:${param.size}`)
                }
            }
            break
        default: // object date array
            rule.push(param.type.toLowerCase())
            break
    }

    if (param.allowedValues && param.allowedValues.length) {
        rule.push(`in:${param.allowedValues.join(',')}`)
    }
    if (param.rule) {
        let ruleArr = param.rule.slice(1, param.rule.length - 1).split('|')
        let hasRequired = ruleArr.filter(r => {
            let ruleType = r.slice(0, r.indexOf(':'))
            return [
                'required', 'required_if', 'required_unless', 'required_with',
                'required_with_all', 'required_without', 'required_without_all'
            ].indexOf(ruleType) > -1
        }).length
        if (hasRequired && !param.optional) rule.shift() // 删除一开始就插入的requried
        rule.push(ruleArr)
    }
    return rule.flat().join('|')
}

module.exports = {
    getRule
}