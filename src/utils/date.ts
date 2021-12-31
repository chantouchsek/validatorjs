export function leapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
export function checkFalsePositiveDates(dateString: string) {
  if (dateString.length === 10) {
    const normalizedDate = dateString.replace('.', '-').replace('/', '-')
    const parts = normalizedDate.split('-')
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const y = parseInt(parts[0])
        const m = parseInt(parts[1])
        const d = parseInt(parts[2])
        if (m === 2) {
          if (leapYear(y)) {
            if (d > 29) {
              return false
            }
          } else {
            if (d > 28) {
              return false
            }
          }
        }
        if (m === 4 || m === 6 || m === 9 || m === 11) {
          if (d > 30) {
            return false
          }
        }
      }
    }
    return true
  }
  return true
}

export function isValidDate(dateString: any) {
  let testDate
  if (typeof dateString === 'number') {
    testDate = new Date(dateString)
    return typeof testDate === 'object'
  }
  testDate = new Date(dateString)
  if (testDate.toString() === 'Invalid Date') {
    return false
  }
  return checkFalsePositiveDates(dateString)
}
