export const accepted = (value: string | number | boolean) => {
  return (
    value === 'on' ||
    value === 'yes' ||
    value === 1 ||
    value === '1' ||
    value === true
  )
}
