const ro = {
  accepted: ':attribute trebuie acceptat.',
  after: ':attribute trebuie să fie după :after.',
  after_or_equal: ':attribute trebuie să fie egal sau după :after_or_equal.',
  alpha: 'Câmpul :attribute rebuie să conțină numai caractere alfabetice.',
  alpha_dash: 'Câmpul:attribute poate conține numai caractere alfanumerice, precum și liniuțe și subliniere.',
  alpha_num: 'Câmpul :attribute trebuie să fie alfanumeric.',
  attributes: {},
  before: ':attribute trebuie să fie înainte :before.',
  before_or_equal: ':attribute trebuie să fie egal sau înainte :before_or_equal.',
  between: ':attribute trebuie să fie între :min și :max.',
  confirmed: 'Confirmarea :attribute nu se potrivește.',
  date: ':attribute nu este un format de dată valid.',
  def: 'Atributul :attribute are erori.',
  different: ':attribute și :different trebuie sa fie diferite.',
  digits: ':attribute trebuie să aibă  :digits cifre.',
  digits_between: 'Câmpul :attribute trebuie să aibă între :min și :max cifre.',
  email: 'Formatul :attribute nu este valid.',
  hex: 'Câmpul :attribute trebuie să aibă format hexazecimal.',
  in: 'Atributul selectat :attribute nu este valid.',
  integer: ':attribute trebuie să fie un număr întreg.',
  max: {
    numeric: ':attribute nu trebuie să fie mai mare de :max.',
    string: ':attribute poate să contină maxim :max caractere.',
  },
  min: {
    numeric: ':attribute trebuie să fie mai mare de :min.',
    string: ':attribute trebuie să contină cel puțin :min caractere.',
  },
  not_in: ':attribute selectat nu este valid.',
  numeric: ':attribute trebuie sa fie un număr.',
  present: ':attribute trebuie sa fie prezent(dar poate fi gol).',
  regex: 'Formatul :attribute nu este valid.',
  required: ' Câmpul :attribute este obligatoriu.',
  required_if: 'Câmpul :attribute este obligatoriu cănd :other este :value.',
  required_unless: 'Câmpul :attribute este obligatoriu cănd :other nu este :value.',
  required_with: 'Câmpul :attribute este obligatoriu cănd :field este completat.',
  required_with_all: 'Câmpul :attribute este obligatoriu cănd :fields sunt completate.',
  required_without: 'Câmpul :attribute este obligatoriu cănd :field nu este completat.',
  required_without_all: 'Câmpul :attribute este obligatoriu cănd :fields nu sunt completate.',
  same: 'Câmpurile :attribute și :same trebuie să fie egale.',
  size: {
    numeric: ':attribute trebuie să fie :size.',
    string: ':attribute trebuie să contina :size caractere.',
  },
  string: ':attribute trebuie să fie un contina doar caractere alfabetice.',
  url: 'Formatul :attribute nu este valid.',
}

export default ro
