import { LangTypes } from './lang'

export interface ValidatorOptions {
  locale?: LangTypes
  confirmedReverse?: boolean
  customMessages?: Record<string, any>
  customAttributes?: Record<string, any>
}
export type VoidFunction = boolean | ((...arg: any) => any)
