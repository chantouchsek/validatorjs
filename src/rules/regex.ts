export const regex = (value: string, req: string | number | any) => {
  const mod = /[g|i|m]{1,3}$/
  let flag = req.match(mod)
  flag = flag ? flag[0] : ''
  req = req.replace(mod, '').slice(1, -1)
  req = new RegExp(req, flag)
  return req.test(value)
}
