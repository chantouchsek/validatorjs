import { ipv4 } from './ipv4'

export function email(value: string) {
  const req = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,})$/i

  if (!req.test(value)) return false
  const literal = /@\[([\d.]+)\]$/.exec(value)
  return !literal || ipv4(literal[1])
}
