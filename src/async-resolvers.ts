import { Rule } from './rule'

type OnFailedOne = (rule: Rule, message?: string) => any
type OnResolvedAll = (allPassed: boolean) => any

export default class AsyncResolvers {
  private readonly onResolvedAll: any
  private readonly onFailedOne: any
  private readonly resolvers: Record<string, any> = {}
  private resolversCount: number
  private passed: any[]
  private failed: any[]
  private firing: boolean

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

  resolve(index: number) {
    const rule = this.resolvers[index]
    if (rule.passes) {
      this.passed.push(rule)
    } else if (!rule.passes) {
      this.failed.push(rule)
      this.onFailedOne(rule)
    }
    this.fire()
  }

  isAllResolved() {
    return this.passed.length + this.failed.length === this.resolversCount
  }

  fire() {
    if (!this.firing) return
    if (this.isAllResolved()) {
      this.onResolvedAll(this.failed.length === 0)
    }
  }

  enableFiring(firing = true) {
    this.firing = firing
  }
}
