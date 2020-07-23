class AsyncResolvers {
  constructor(onFailedOne, onResolvedAll) {
    this.onResolvedAll = onResolvedAll;
    this.onFailedOne = onFailedOne;
    this.resolvers = {};
    this.resolversCount = 0;
    this.passed = [];
    this.failed = [];
    this.firing = false;
  }

  /**
   * Add resolver
   *
   * @param {Object} rule
   * @return {integer}
   */
  add(rule = {}) {
    const index = this.resolversCount;
    this.resolvers[index] = rule;
    this.resolversCount++;
    return index;
  }

  /**
   * Resolve given index
   *
   * @param  {integer} index
   * @return {void}
   */
  resolve(index) {
    const rule = this.resolvers[index];
    if (rule.passes === true) {
      this.passed.push(rule);
    } else if (rule.passes === false) {
      this.failed.push(rule);
      this.onFailedOne(rule);
    }
    this.fire();
  }

  /**
   * Determine if all have been resolved
   *
   * @return {boolean}
   */
  isAllResolved() {
    return this.passed.length + this.failed.length === this.resolversCount;
  }

  /**
   * Attempt to fire final all resolved callback if completed
   *
   * @return {void}
   */
  fire() {
    if (!this.firing) {
      return;
    }
    if (this.isAllResolved()) {
      this.onResolvedAll(this.failed.length === 0);
    }
  }

  /**
   * Enable firing
   *
   * @return {void}
   */
  enableFiring() {
    this.firing = true;
  }
}

export default AsyncResolvers;
