export interface ValidatorOptions {
  locale?: string
  confirmedReverse?: boolean
  customMessages?: Record<string, any>
  customAttributes?: Record<string, any>
}
export type VoidFunction = boolean | ((arg?: any) => any)
