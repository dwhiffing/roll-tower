export const DEFAULT_DIE = [
  'sword',
  'sword',
  'sword',
  'sword',
  'sword',
  'sword',
]
export const INITIAL_DECK = [
  { sides: DEFAULT_DIE },
  { sides: DEFAULT_DIE },
  { sides: DEFAULT_DIE },
  { sides: DEFAULT_DIE },
  { sides: DEFAULT_DIE },
]

// const DEFAULT_DIE = ['shield', 'shield', 'shield', 'shield', 'shield', 'shield']
// const DEFAULT_DIE = ['sword', 'sword', 'sword', 'shield', 'shield', 'shield']

export const NODES = [
  {
    type: 'battle',
    key: 'sword',
    enemies: [null, null, null, null, { key: 'bat' }],
  },
  {
    type: 'event',
    key: 'rhombus_question',
    event: 'remove-die',
  },
  {
    type: 'battle',
    key: 'skull',
    enemies: [
      { key: 'bat' },
      { key: 'bat' },
      { key: 'bat' },
      { key: 'bat' },
      { key: 'bat' },
      { key: 'bat' },
      { key: 'bat' },
      { key: 'bat' },
      { key: 'bat' },
    ],
  },
]
