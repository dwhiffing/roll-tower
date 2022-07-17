export const DEFAULT_DIE = {
  name: 'Basic',
  // sides: ['draw', 'draw', 'draw', 'reroll', 'reroll', 'reroll'],
  sides: ['shield', 'shield', 'shield_crit', 'sword', 'sword', 'sword_crit'],
}

export const POSSIBLE_TARGETS = {
  shield: ['player'],
  shield_crit: ['player'],
  sword_crit: ['enemy'],
  sword: ['enemy'],
  reroll: ['die'],
  draw: ['player'],
  heal: ['player'],
  book: ['enemy'],
  skull: ['enemy'],
  magic: ['enemy'],
  fire: ['enemy'],
  arrow: ['enemy'],
  random: ['enemy'],
  heal_crit: ['player'],
  book_crit: ['enemy'],
  skull_crit: ['enemy'],
  magic_crit: ['enemy'],
  fire_crit: ['enemy'],
  arrow_crit: ['enemy'],
  random_crit: ['enemy'],
}

export const DICE_POOL = [
  DEFAULT_DIE,
  {
    name: 'Support',
    sides: ['draw', 'draw', 'draw', 'reroll', 'reroll', 'reroll'],
  },
  {
    name: 'Attack',
    sides: ['sword', 'sword', 'sword', 'sword', 'sword_crit', 'sword_crit'],
  },
  {
    name: 'Block',
    sides: [
      'shield',
      'shield',
      'shield',
      'shield',
      'shield_crit',
      'shield_crit',
    ],
  },
  {
    name: 'Heal',
    sides: ['heal', 'heal', 'heal', 'shield', 'shield', 'reroll'],
  },
  {
    name: 'Fire',
    sides: ['fire', 'fire', 'fire_crit', 'sword', 'sword', 'sword'], // deals damage over time
  },
  {
    name: 'Hammer',
    // TODO: magic should be renamed to stun
    sides: ['magic', 'magic', 'magic', 'sword', 'sword', 'sword_crit'],
  },
  {
    name: 'Weaken',
    sides: ['skull', 'skull', 'skull', 'sword', 'sword', 'sword_crit'],
  },
  {
    name: 'Arrow',
    sides: ['arrow', 'arrow', 'arrow', 'sword', 'sword', 'sword_crit'],
  },
  {
    name: 'Magic',
    sides: ['book', 'book', 'book', 'sword', 'sword', 'sword_crit'],
  },
  // TODO: add more dice types
  // life steal from an enemy
  // clone die
  // do damage based on current armor
  // do damage based on number of dice in active pool
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
    event: 'upgrade-die',
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
  // {
  //   type: 'battle',
  //   key: 'sword',
  //   enemies: [null, null, null, { type: 'viking' }, { type: 'bat' }],
  //   x: 1,
  //   y: 2,
  // },
  {
    type: 'camp',
    key: 'campfire',
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
    type: 'camp',
    key: 'campfire',
    x: 1,
    y: 6,
  },

  {
    type: 'battle',
    key: 'skull',
    enemies: [null, null, null, null, { type: 'golem' }],
    x: 1,
    y: 7,
  },
]

export const STATS = {
  player: { hp: 10, str: 1, dex: 1, drawCount: 6 },
  bat: { hp: 3, str: 1, dex: 1 },
  viking: { hp: 8, str: 2, dex: 2 },
  warlock: { hp: 5, str: 2, dex: 2 },
  nomad: { hp: 15, str: 3, dex: 3 },
  golem: { hp: 50, str: 5, dex: 5 },
}

// need to implement buff_str, attack_defend and heal
export const MOVES = {
  bat: [
    { type: 'sword', name: 'attack' },
    { type: 'random', name: 'nothing' },
    { type: 'random', name: 'nothing' },
  ],
  viking: [
    { type: 'sword', name: 'attack' },
    { type: 'shield', name: 'defend' },
  ],
  warlock: [
    { type: 'sword', name: 'attack' },
    { type: 'flask_empty', name: 'heal' },
    { type: 'pawn_up', name: 'buff_str' },
  ],
  nomad: [
    { type: 'sword', name: 'attack' },
    { type: 'sword', name: 'attack' },
    { type: 'random', name: 'attack_defend' },
    { type: 'shield', name: 'defend' },
    { type: 'random', name: 'buff_str' },
  ],
  golem: [
    { type: 'sword', name: 'attack' },
    { type: 'sword', name: 'attack' },
    { type: 'random', name: 'attack_defend' },
    { type: 'shield', name: 'defend' },
  ],
}
