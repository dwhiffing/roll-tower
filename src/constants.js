export const DEFAULT_DIE = {
  name: 'Basic',
  sides: ['shield', 'shield', 'shield', 'sword', 'sword', 'sword'],
}

export const DICE_POOL = [
  DEFAULT_DIE,
  {
    name: 'Random',
    sides: ['shield', 'sword', 'random', 'random', 'random', 'skull'],
  },
  {
    name: 'Death',
    sides: ['skull', 'skull', 'skull', 'skull', 'skull', 'skull'],
  },
]
export const INITIAL_DECK = [
  DEFAULT_DIE,
  DEFAULT_DIE,
  DEFAULT_DIE,
  DEFAULT_DIE,
  DEFAULT_DIE,
]

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
