export const DEFAULT_DIE = {
  name: 'Basic',
  // sides: ['draw', 'draw', 'draw', 'reroll', 'reroll', 'reroll'],
  sides: ['shield', 'shield', 'shield', 'sword', 'sword', 'sword'],
}

export const DICE_POOL = [
  DEFAULT_DIE,
  {
    name: 'Random',
    sides: ['draw', 'draw', 'draw', 'reroll', 'reroll', 'reroll'],
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
  DICE_POOL[1],
  DICE_POOL[1],
  DICE_POOL[1],
]

export const NODES = [
  {
    type: 'battle',
    key: 'sword',
    enemies: [null, null, null, null, { type: 'bat' }],
  },
  {
    type: 'battle',
    key: 'sword',
    enemies: [null, null, null, null, { type: 'nomad' }],
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
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
    ],
  },
]
