import { shuffle } from 'lodash'

export default class DeckService {
  constructor(scene) {
    this.scene = scene
    this.set('discardPile', [])
    this.set('activePile', [])
    this.set('drawPile', shuffle([...this.get().deck]))
    this.index = 0
  }

  get = () => this.scene.registry.values

  set = (key, value) => this.scene.registry.set(key, value)

  draw = (count = 1) => {
    for (let i = 0; i < count; i++) {
      this.drawCard(this.index++)
    }
  }

  drawCard = (index) => {
    if (this.get().drawPile.length === 0) {
      this.set('drawPile', shuffle([...this.get().discardPile]))
      this.set('discardPile', [])
    }

    const die = this.get().drawPile[0]
    this.set('drawPile', this.get().drawPile.slice(1))
    if (die) {
      const newDie = {
        ...die,
        index,
        sideIndex: Phaser.Math.RND.integerInRange(0, 5),
      }
      this.set('activePile', [...this.get().activePile, newDie])
    }
  }

  discardAll = () => {
    const { activePile, discardPile } = this.get()
    this.set('discardPile', [...discardPile, ...activePile])
    this.set('activePile', [])
  }

  reroll = (index) => {
    const { activePile } = this.get()
    const die = activePile.find((d) => d.index === index)
    die.sideIndex = Phaser.Math.RND.integerInRange(0, 5)
    this.set(
      'activePile',
      activePile.map((d) => (d.index === index ? die : d)),
    )
  }

  discard = (index) => {
    const { activePile, discardPile } = this.get()
    const die = activePile.find((d) => d.index === index)
    this.set('discardPile', [...discardPile, die])
    this.set(
      'activePile',
      activePile.filter((d) => d.index !== index),
    )
  }

  addDie = (die) => {
    const deck = this.get().deck
    const _die = { ...die, index: Math.max(...deck.map((d) => +d.index)) + 1 }
    this.set('deck', [...deck, _die])
  }

  removeDie = (index) => {
    const deck = this.get().deck
    this.set('deck', [...deck.slice(0, index), ...deck.slice(index + 1)])
  }

  upgradeDie = (die, face) => {
    const faceKey = die?.sides[face]
    if (faceKey && !faceKey.match(/_crit/)) {
      const deck = this.get().deck
      this.set(
        'deck',
        deck.map((d) => {
          if (d.index === die.index) {
            return {
              ...d,
              sides: d.sides.map((k, i) => (i === face ? k + '_crit' : k)),
            }
          }
          return d
        }),
      )
    }
  }
}
