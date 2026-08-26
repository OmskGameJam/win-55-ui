export interface TestScript {
  name: string
  sample: string
  lower: string[]
  upper: string[]
}

export const TEST_SCRIPTS: TestScript[] = [
  {
    name: 'English',
    sample: 'The quick brown fox jumps over the lazy dog',
    lower: [...'abcdefghijklmnopqrstuvwxyz'],
    upper: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  },
  {
    name: 'Cyrillic',
    sample: 'Съешь же ещё этих мягких французских булок, да выпей чаю',
    lower: [...'абвгдежзийклмнопрстуфхцчшщъыьэюя'],
    upper: [...'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'],
  },
  {
    name: 'Greek',
    sample: 'Ξεσκεπάζω την ψυχοφθόρα βδελυγμία',
    lower: [...'αβγδεζηθικλμνξοπρστυφχψω'],
    upper: [...'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'],
  },
]
