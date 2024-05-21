const uz = {
  accepted: 'Siz :attribute ni qabul qilishingiz kerak.',
  alpha: ':attribute maydoni faqat harflardan iborat bo`lishi mumkin.',
  alpha_dash: ':attribute maydoni faqat harflar, raqamlar, chiziqlar va pastki chiziqlardan iborat bo`lishi mumkin.',
  alpha_num: ':attribute maydoni faqat harflar va raqamlarni o`z ichiga olishi mumkin.',
  attributes: {},
  between: ':attribute maydoni :min va :max orasida bo`lishi kerak.',
  confirmed: ':attribute maydoni tasdiq bilan mos kelmaydi.',
  def: ':attribute maydonida xatolar mavjud.',
  different: ':attribute va :different maydonlar qiymatlari farqli bo`lishi kerak.',
  digits: ':attribute maydonning uzunligi :digits bo`lishi kerak',
  digits_between: ':attribute maydonining uzunligi :min dan :max belgilargacha bo`lishi kerak.',
  email: ':attribute maydoniga haqiqiy elektron pochta manzili kiritilishi kerak.',
  hex: ':attribute maydoni o`n oltilik formatda bo`lishi kerak',
  in: ':attribute uchun tanlangan qiymat noto`g`ri.',
  integer: ':attribute maydoni butun sonlardan bo`lishi kerak.',
  max: {
    numeric: ':attribute maydonining qiymati :max dan kam yoki unga teng bo`lishi kerak.',
    string: ':attribute maydonidagi belgilar soni :max dan oshmasligi kerak.',
  },
  min: {
    numeric: ':attribute maydonining qiymati :min dan katta yoki unga teng bo`lishi kerak.',
    string: ':attribute maydonidagi belgilar soni kamida :min bo`lishi kerak.',
  },
  not_in: ':attribute uchun tanlangan qiymat xato.',
  numeric: ':attribute maydoni raqamlardan iborat bo`lishi kerak.',
  present: ':attribute maydoni mavjud bo`lishi kerak (lekin bo`sh bo`lishi mumkin).',
  regex: ':attribute maydon formati noto`g`ri.',
  required: ':attribute maydoni to`ldirilishi talab qilinadi.',
  required_if:
    'Поле :attribute требуется когда значения поля :other равно :value. :attribute maydoni :other maydonining qiymati :value bo`lganida talab qilinadi.',
  same: ':atribute qiymati :same bilan mos kelishi kerak.',
  size: {
    array: ':attribute maydoni :size elementdan iborat bo`lishi kerak.',
    file: ':attribute maydoni :size kilobaytdan iborat bo`lishi kerak.',
    numeric: ':attribute maydonining qiymati :size o`lchamiga teng bo`lishi kerak.',
    string: ':attribute maydonidagi belgilar soni :size ta bo`lishi kerak.',
  },
  url: ':attribute maydonida to`g`ri URL manzili kiritilishi kerak.',
}

export default uz
