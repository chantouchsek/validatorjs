import type { Rule } from './rules'

const replacements = {
  between(template: string, rule: Rule): string {
    const parameters = rule.getParameters()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this._replacePlaceholders(rule, template, {
      min: parameters[0],
      max: parameters[1],
    })
  },
}
const formatter = (attribute: string) => {
  return attribute.replace(/[_\[]/g, ' ').replace(/]/g, '')
}

export { replacements, formatter }
