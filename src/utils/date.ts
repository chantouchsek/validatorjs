export function leapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function checkFalsePositiveDates(dateString = '') {
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
    if (typeof testDate === 'object') {
      return true
    }
  }
  testDate = new Date(dateString)
  if (typeof testDate === 'object') {
    if (testDate.toString() === 'Invalid Date') {
      return false
    }
    return checkFalsePositiveDates(dateString)
  }
  const regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/
  if (!regex_date.test(dateString)) {
    return false
  }
  const parts = dateString.split('-')
  const day = parseInt(parts[2], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[0], 10)
  if (year < 1000 || year > 3000 || month == 0 || month > 12) {
    return false
  }
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    monthLength[1] = 29
  }
  return day > 0 && day <= monthLength[month - 1]
}
