import { shuffle } from 'lodash'

export default class DeckService {
  constructor(scene) {
    this.scene = scene
    this.set('discardPile', [])
    this.set('drawPile', [...this.get().deck])
  }

  // change to getter
  get = () => this.scene.registry.values

  set = (key, value) => this.scene.registry.set(key, value)

  draw = (count = 2) => {
    const { drawPile, discardPile } = this.get()
    if (drawPile.length === 0) {
      this.set('drawPile', shuffle([...discardPile]))
      this.set('discardPile', [])
    }
    this.set('activePile', [])

    for (let i = 0; i < count; i++) {
      const { drawPile, activePile } = this.get()
      const die = drawPile[0]
      this.set('drawPile', drawPile.slice(1))
      if (die) {
        this.set('activePile', [...activePile, die])
      }
    }
  }

  discardAll = () => {
    const { activePile, discardPile } = this.get()
    this.set('discardPile', [...discardPile, ...activePile])
    this.set('activePile', [])
  }

  discard = (index) => {
    const { activePile } = this.get()

    this.set('activePile', [
      ...activePile.slice(0, index),
      ...activePile.slice(index + 1),
    ])
  }
}
