const it = {
  accepted: 'Il campo :attribute deve essere accettato.',
  alpha: 'Il campo :attribute deve contenere sono caratteri alfabetici.',
  alpha_dash: 'Il campo :attribute può contenere solo caratteri alfanumerici oltre a trattini e trattini bassi.',
  alpha_num: 'Il campo :attribute deve essere alfanumerico.',
  attributes: {},
  between: 'Il campo :attribute deve essere compreso tra :min e :max.',
  confirmed: 'Il campo conferma :attribute non è uguale.',
  def: 'Gli attributi del campo :attribute contengono degli errori.',
  different: 'Il campo :attribute e :different devo essere diversi.',
  digits: 'Il campo :attribute deve essere di :digits cifre.',
  digits_between: 'Il campo :attribute deve essere tra :min e :max cifre.',
  email: 'Il formato dell\'attributo :attribute non è valido.',
  hex: 'Il campo :attribute deve essere in formato esadecimale',
  in: 'Il valore del campo :attribute non è valido.',
  integer: 'Il campo :attribute deve essere un valore intero.',
  max: {
    numeric: 'Il campo :attribute deve essere minore o uguale di :max.',
    string: 'Il campo :attribute deve essere composto da massimo :max caratteri.',
  },
  min: {
    numeric: 'Il campo :attribute deve essere maggiore o uguale di :min.',
    string: 'Il campo :attribute deve essere composto da almeno :min caratteri.',
  },
  not_in: 'Il campo :attribute non è valido.',
  numeric: 'Il campo :attribute deve essere un numero.',
  present: 'Il campo :attribute deve essere presente (ma può essere vuoto).',
  regex: 'Il formato del campo :attribute non è valido.',
  required: 'Il campo :attribute è richiesto.',
  required_if: 'Il campo :attribute è richiesto quando il campo :other è uguale a :value.',
  same: 'I campi :attribute e :same devono essere uguali.',
  size: {
    array: 'Il campo :attribute deve contenere :size elementi.',
    file: 'Il campo :attribute deve essere grande :size kilobytes.',
    numeric: 'La dimensione del campo :attribute deve essere uguale a :size.',
    string: 'Il campo :attribute deve essere di :size caratteri.',
  },
  string: 'Il campo :attribute deve essere una stringa.',
  url: 'Il formato del campo :attribute non è valido.',
}

export default it
