import { Rule } from '../rule'

export interface Replacement {
  between: (template: string, rule: Rule) => string
  digits_between: (template: string, rule: Rule) => string
  required_if: (template: string, rule: Rule) => string
  required_unless: (template: string, rule: Rule) => string
  required_with: (template: string, rule: Rule) => string
  required_with_all: (template: string, rule: Rule) => string
  required_without: (template: string, rule: Rule) => string
  required_without_all: (template: string, rule: Rule) => string
  after: (template: string, rule: Rule) => string
  before: (template: string, rule: Rule) => string
  after_or_equal: (template: string, rule: Rule) => string
  before_or_equal: (template: string, rule: Rule) => string
  same: (template: string, rule: Rule) => string
}
