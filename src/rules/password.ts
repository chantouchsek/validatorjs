export function password(value: string) {
  return /^(?=.*\d)(?=.*[!@#$%^&*])[a-z0-9!@#$%^&*]{6,16}$/i.test(value)
}
