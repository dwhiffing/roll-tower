export const DEFAULT_DIE = {
  name: 'Basic',
  // sides: ['draw', 'draw', 'draw', 'reroll', 'reroll', 'reroll'],
  sides: ['shield', 'shield', 'shield', 'sword', 'sword', 'sword'],
}

export const POSSIBLE_TARGETS = {
  shield: ['player'],
  sword: ['enemy'],
  reroll: ['die'],
  draw: ['player'],
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
    x: 1,
    y: 0,
  },
  {
    type: 'event',
    key: 'rhombus_question',
    event: 'remove-die',
    x: 0,
    y: 1,
  },
  {
    type: 'battle',
    key: 'sword',
    enemies: [
      null,
      null,
      null,
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
    ],
    x: 2,
    y: 1,
  },
  {
    type: 'battle',
    key: 'sword',
    enemies: [null, null, null, { type: 'viking' }, { type: 'bat' }],
    x: 1,
    y: 2,
  },
  {
    type: 'event',
    key: 'rhombus_question',
    event: 'remove-die',
    x: 0,
    y: 3,
  },
  {
    type: 'battle',
    key: 'sword',
    enemies: [null, null, null, { type: 'viking' }, { type: 'warlock' }],
    x: 2,
    y: 3,
  },
  {
    type: 'battle',
    key: 'sword',
    enemies: [
      null,
      { type: 'viking' },
      null,
      { type: 'bat' },
      { type: 'bat' },
      { type: 'bat' },
      null,
      { type: 'viking' },
      null,
    ],
    x: 1,
    y: 4,
  },
  {
    type: 'battle',
    key: 'sword',
    enemies: [null, null, null, null, { type: 'nomad' }],
    x: 0,
    y: 5,
  },
  {
    type: 'event',
    key: 'rhombus_question',
    event: 'remove-die',
    x: 2,
    y: 5,
  },

  {
    type: 'battle',
    key: 'skull',
    enemies: [null, null, null, null, { type: 'golem' }],
    x: 1,
    y: 6,
  },
]
