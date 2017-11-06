class PosRep {
  constructor(next, nextTime, then, thenTime, third, mach, alt) {
    this.next = next
    this.nextTime = nextTime
    this.then = then
    this.thenTime = thenTime
    this.third = third
    this.mach = mach
    this.alt = alt
  }

  toString() {
    return `${this.next} at ${this.nextTime}z, ${this.alt}, M.${this.mach}. Estimating ${this.then} at ${this.thenTime}z. ${this.third} next.`
  }
}

module.exports = PosRep
