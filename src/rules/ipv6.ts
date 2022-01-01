export const ipv6 = (value: string | number) => {
  if (typeof value !== 'string') return false

  // regex to check that each hextet is valid
  const er = /^[0-9a-f]+$/
  // ipv6 hextets are delimited by colon
  const hextets = value.split(':')

  // check 1: ipv6 should contain only one consecutive colons
  const colons = value.match(/::/)
  const matcher = value.match(/::/g) || ''
  if (colons != null && matcher.length > 1) return false

  // check 2: ipv6 should not be ending or starting with colon
  // edge case: not with consecutive colons
  if (value[0] == ':' && (colons == null || colons.index != 0)) return false
  if (
    value[value.length - 1] == ':' &&
    (colons == null || colons.index != value.length - 2)
  )
    return false

  // check 3: ipv6 should contain no less than 3 sector
  // minimum ipv6 addres - ::1
  if (3 > hextets.length) return false

  // check 4: ipv6 should contain no more than 8 sectors
  // only 1 edge case: when first or last sector is ommited
  const isEdgeCase =
    hextets.length == 9 &&
    colons != null &&
    (colons.index == 0 || colons.index == value.length - 2)
  if (hextets.length > 8 && !isEdgeCase) return false

  // check 5: ipv6 should contain exactly one consecutive colons if it has less than 8 sectors
  if (hextets.length != 8 && colons == null) return false

  for (let i = 0; i < hextets.length; i++) {
    const element = hextets[i]

    if (element.length == 0) continue

    // check 6: all of hextets should contain numbers from 0 to f (in hexadecimal)
    if (!er.test(element)) return false

    // check 7: all of hextet values should be less then ffff (in hexadeimal)
    // checking using length of hextet. lowest invalid value's length is 5.
    // so all valid hextets are length of 4 or less
    if (element.length > 4) return false
  }
  return true
}
