export const formatter = (attribute: string) => {
  return attribute.replace(/[_\[]/g, ' ').replace(/]/g, '')
}
