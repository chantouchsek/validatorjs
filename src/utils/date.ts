function _leapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
function _checkFalsePositiveDates(date: string) {
  if (date.length === 10) {
    const normalizedDate = date.replace('.', '-').replace('/', '-')
    const parts = normalizedDate.split('-')
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const y = Number.parseInt(parts[0])
        const m = Number.parseInt(parts[1])
        const d = Number.parseInt(parts[2])
        if (m === 2) {
          if (_leapYear(y)) {
            if (d > 29) return false
          }
          else {
            if (d > 28) return false
          }
        }
        if (m === 4 || m === 6 || m === 9 || m === 11) {
          if (d > 30) return false
        }
      }
    }
    return true
  }
  return true
}
export function isValidDate(dateString: string | number) {
  let testDate
  if (typeof dateString === 'string' && dateString.trim() === '') return false
  if (typeof dateString === 'number') {
    testDate = new Date(dateString)
    return Number.isFinite(testDate.getTime())
  }
  testDate = new Date(dateString)
  if (testDate.toString() === 'Invalid Date') return false
  return _checkFalsePositiveDates(dateString)
}
