export const leapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
export function checkFalsePositiveDates(dateString: string) {
  if (dateString.length !== 10) return true
  const normalizedDate = dateString.replace('.', '-').replace('/', '-')
  const parts = normalizedDate.split('-')
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const y = parseInt(parts[0])
      const m = parseInt(parts[1])
      const d = parseInt(parts[2])
      if (m === 2) {
        if (leapYear(y) && d > 29) {
          return false
        } else if (d > 28) {
          return false
        }
      }
      if (m === 4 || m === 6 || m === 9 || m === 11) {
        if (d > 30) return false
      }
    }
  }
  return true
}

export function isValidDate(dateString: string | number) {
  let testDate
  if (typeof dateString === 'number') {
    testDate = new Date(dateString)
    return typeof testDate === 'object'
  }
  testDate = new Date(dateString)
  if (testDate.toString() === 'Invalid Date') return false
  return checkFalsePositiveDates(dateString)
}
