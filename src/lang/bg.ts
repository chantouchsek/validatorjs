const bg = {
  accepted: 'Трябва да приемете :attribute.',
  active_url: 'Полето :attribute не е валиден URL адрес.',
  after: 'Полето :attribute трябва да бъде дата след :date.',
  after_or_equal: 'Полето :attribute трябва да бъде дата след или равна на :date.',
  alpha: 'Полето :attribute трябва да съдържа само букви.',
  alpha_dash: 'Полето :attribute трябва да съдържа само букви, цифри, долна черта и тире.',
  alpha_num: 'Полето :attribute трябва да съдържа само букви и цифри.',
  array: 'Полето :attribute трябва да бъде масив.',
  attributes: {},
  before: 'Полето :attribute трябва да бъде дата преди :date.',
  before_or_equal: 'Полето :attribute трябва да бъде дата преди или равна на :date.',
  between: {
    array: 'Полето :attribute трябва да има между :min - :max елемента.',
    file: 'Полето :attribute трябва да бъде между :min и :max килобайта.',
    numeric: 'Полето :attribute трябва да бъде между :min и :max.',
    string: 'Полето :attribute трябва да бъде между :min и :max знака.',
  },
  boolean: 'Полето :attribute трябва да съдържа Да или Не',
  confirmed: 'Полето :attribute не е потвърдено.',
  date: 'Полето :attribute не е валидна дата.',
  date_format: 'Полето :attribute не е във формат :format.',
  different: 'Полетата :attribute и :other трябва да са различни.',
  digits: 'Полето :attribute трябва да има :digits цифри.',
  digits_between: 'Полето :attribute трябва да има между :min и :max цифри.',
  dimensions: 'Невалидни размери за снимка :attribute.',
  distinct: 'Данните в полето :attribute се дублират.',
  email: 'Полето :attribute е в невалиден формат.',
  exists: 'Избранато поле :attribute вече съществува.',
  file: 'Полето :attribute трябва да бъде файл.',
  filled: 'Полето :attribute е задължително.',
  gt: {
    array: 'The :attribute must have more than :value items.',
    file: 'The :attribute must be greater than :value kilobytes.',
    numeric: 'The :attribute must be greater than :value.',
    string: 'The :attribute must be greater than :value characters.',
  },
  gte: {
    array: 'The :attribute must have :value items or more.',
    file: 'The :attribute must be greater than or equal :value kilobytes.',
    numeric: 'The :attribute must be greater than or equal :value.',
    string: 'The :attribute must be greater than or equal :value characters.',
  },
  hex: 'The :attribute field should have hexadecimal format',
  image: 'Полето :attribute трябва да бъде изображение.',
  in: 'Избраното поле :attribute е невалидно.',
  in_array: 'Полето :attribute не съществува в :other.',
  integer: 'Полето :attribute трябва да бъде цяло число.',
  ip: 'Полето :attribute трябва да бъде IP адрес.',
  ipv4: 'Полето :attribute трябва да бъде IPv4 адрес.',
  ipv6: 'Полето :attribute трябва да бъде IPv6 адрес.',
  json: 'Полето :attribute трябва да бъде JSON низ.',
  lt: {
    array: 'The :attribute must have less than :value items.',
    file: 'The :attribute must be less than :value kilobytes.',
    numeric: 'The :attribute must be less than :value.',
    string: 'The :attribute must be less than :value characters.',
  },
  lte: {
    array: 'The :attribute must not have more than :value items.',
    file: 'The :attribute must be less than or equal :value kilobytes.',
    numeric: 'The :attribute must be less than or equal :value.',
    string: 'The :attribute must be less than or equal :value characters.',
  },
  max: {
    array: 'Полето :attribute трябва да има по-малко от :max елемента.',
    file: 'Полето :attribute трябва да бъде по-малко от :max килобайта.',
    numeric: 'Полето :attribute трябва да бъде по-малко от :max.',
    string: 'Полето :attribute трябва да бъде по-малко от :max знака.',
  },
  mimes: 'Полето :attribute трябва да бъде файл от тип: :values.',
  mimetypes: 'Полето :attribute трябва да бъде файл от тип: :values.',
  min: {
    array: 'Полето :attribute трябва има минимум :min елемента.',
    file: 'Полето :attribute трябва да бъде минимум :min килобайта.',
    numeric: 'Полето :attribute трябва да бъде минимум :min.',
    string: 'Полето :attribute трябва да бъде минимум :min знака.',
  },
  not_in: 'Избраното поле :attribute е невалидно.',
  not_regex: 'The :attribute format is invalid.',
  numeric: 'Полето :attribute трябва да бъде число.',
  present: 'Полето :attribute трябва да съествува.',
  regex: 'Полето :attribute е в невалиден формат.',
  required: 'Полето :attribute е задължително.',
  required_if: 'Полето :attribute се изисква, когато :other е :value.',
  required_unless: 'Полето :attribute се изисква, освен ако :other не е в :values.',
  required_with: 'Полето :attribute се изисква, когато :values има стойност.',
  required_with_all: 'Полето :attribute е задължително, когато :values имат стойност.',
  required_without: 'Полето :attribute се изисква, когато :values няма стойност.',
  required_without_all: 'Полето :attribute се изисква, когато никое от полетата :values няма стойност.',
  same: 'Полетата :attribute и :other трябва да съвпадат.',
  size: {
    array: 'Полето :attribute трябва да има :size елемента.',
    file: 'Полето :attribute трябва да бъде :size килобайта.',
    numeric: 'Полето :attribute трябва да бъде :size.',
    string: 'Полето :attribute трябва да бъде :size знака.',
  },
  string: 'Полето :attribute трябва да бъде знаков низ.',
  timezone: 'Полето :attribute трябва да съдържа валидна часова зона.',
  unique: 'Полето :attribute вече съществува.',
  uploaded: 'Неуспешно качване на :attribute.',
  url: 'Полето :attribute е в невалиден формат.',
}

export default bg
