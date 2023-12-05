import type { Rule } from './rule'
import type { SimpleObject } from './types'

type OnFailedOne = (rule: Rule, message?: string) => any
type OnResolvedAll = (allPassed: boolean) => any

export default class AsyncResolvers {
  private failed: any[]
  private firing: boolean
  private readonly onFailedOne: OnFailedOne
  private readonly onResolvedAll: OnResolvedAll
  private passed: any[]
  private readonly resolvers: SimpleObject = {}
  private resolversCount: number

  constructor(onFailedOne: OnFailedOne, onResolvedAll: OnResolvedAll) {
    this.onResolvedAll = onResolvedAll
    this.onFailedOne = onFailedOne
    this.resolvers = {}
    this.resolversCount = 0
    this.passed = []
    this.failed = []
    this.firing = false
  }

  add(rule: any) {
    const index = this.resolversCount
    this.resolvers[index] = rule
    this.resolversCount++
    return index
  }

  enableFiring(firing = true) {
    this.firing = firing
  }

  fire() {
    if (!this.firing)
      return
    if (this.isAllResolved())
      this.onResolvedAll(this.failed.length === 0)
  }

  isAllResolved() {
    return this.passed.length + this.failed.length === this.resolversCount
  }

  resolve(index: number) {
    const rule = this.resolvers[index]
    if (rule.passes) {
      this.passed.push(rule)
    }
    else if (!rule.passes) {
      this.failed.push(rule)
      this.onFailedOne(rule)
    }
    this.fire()
  }
}
