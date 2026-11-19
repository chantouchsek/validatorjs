export function ipv6(value: number | string) {
  if (typeof value !== 'string' || /[^0-9a-f:.]/i.test(value))
    return false

  if (value.includes('.')) {
    const lastColon = value.lastIndexOf(':')
    const octets = value.slice(lastColon + 1).split('.')
    if (octets.length !== 4 || !octets.every(octet => /^(?:0|[1-9]\d{0,2})$/.test(octet) && Number(octet) <= 255))
      return false

    // The final 32 bits occupy two hextets in an IPv4-embedded address.
    value = `${value.slice(0, lastColon + 1)}0:0`
  }

  const parts = value.split('::')
  if (parts.length > 2)
    return false

  // Only the two sides of compression may be empty; a remaining empty
  // hextet rejects single leading/trailing colons and triple colons.
  const hextets = parts.flatMap(part => part === '' ? [] : part.split(':'))
  if (!hextets.every(hextet => /^[0-9a-f]{1,4}$/i.test(hextet)))
    return false

  // Compression must replace at least one of the eight 16-bit groups.
  return parts.length === 2 ? hextets.length < 8 : hextets.length === 8
}
