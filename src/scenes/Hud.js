import { shuffle } from 'lodash'
import Die from '../sprites/Die'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Hud' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.bg = this.add.graphics()
    this.bg.fillStyle(0x222222, 1)
    const w = this.width
    const h = this.height
    this.bg.fillRect(0, h / 2, this.cameras.main.width, h / 2)

    this.discardText = this.add
      .bitmapText(10, h / 2 - 20, 'pixel-dan', '0')
      .setScale(2)
    this.add.sprite(40, h / 2 - 20, 'sheet', 'card_place.png').setScale(0.4)
    this.drawText = this.add
      .bitmapText(w - 50, h / 2 - 20, 'pixel-dan', '10')
      .setScale(2)
    this.add.sprite(w - 15, h / 2 - 20, 'sheet', 'card_lift.png').setScale(0.4)
    this.add
      .sprite(w - 15, h - 20, 'sheet', 'flip_head.png')
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => this.events.emit('end-turn'))
    this.events.off('draw')
    this.events.off('discard')
    this.events.on('draw', this.draw)
    this.events.on('discard', this.discard)
    this.diceSprites = []
  }

  draw = () => {
    if (this.registry.values.dice.length === 0) {
      this.registry.values.dice = shuffle([...this.registry.values.discard])
      this.registry.values.discard = []
    }
    const count = 2
    this.registry.values.hand = []
    for (let i = 0; i < count; i++) {
      const index = Phaser.Math.RND.integerInRange(
        0,
        this.registry.values.dice.length - 1,
      )
      const die = this.registry.values.dice.splice(index, 1)[0]
      if (die) this.registry.values.hand = [...this.registry.values.hand, die]
    }

    const y = this.height / 2 + 20
    this.registry.values.hand.forEach((die, i) => this.addDie(die, i, y))
    this.drawText.text = this.registry.values.dice.length
    this.discardText.text = this.registry.values.discard.length
  }

  addDie = (die, index, y) => {
    const x = index * 50 + 20
    this.diceSprites.push(new Die(this, x, y, { ...die, index }))
  }

  discard = () => {
    this.diceSprites.forEach((s) => {
      s.sprite.destroy()
    })
    this.diceSprites = []
    this.registry.values.discard = [
      ...this.registry.values.discard,
      ...this.registry.values.hand,
    ]
    this.registry.values.hand = []
    this.discardText.text = this.registry.values.discard.length
  }

  update() {}
}
