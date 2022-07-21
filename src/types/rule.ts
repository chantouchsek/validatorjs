export type RuleType =
  | 'accepted'
  | 'alpha'
  | 'alpha_dash'
  | 'alpha_num'
  | 'array'
  | 'boolean'
  | 'date'
  | 'email'
  | 'hex'
  | 'integer'
  | 'ipv4'
  | 'ipv6'
  | 'numeric'
  | 'password'
  | 'present'
  | 'required'
  | 'regex'
  | 'sometimes'
  | 'string'
  | 'url'
  | 'after'
  | 'after_or_equal'
  | 'required_if'
  | 'required_unless'
  | 'required_with'
  | 'required_with_all'
  | 'required_without'
  | 'required_without_all'
  | 'size'
  | 'min'
  | 'max'
  | 'between'
  | 'same'
  | 'different'
  | 'in'
  | 'not_in'
  | 'confirmed'
  | 'digits'
  | 'digits_between'
  | 'before'
  | 'before_or_equal'
  | 'ip'
  | string