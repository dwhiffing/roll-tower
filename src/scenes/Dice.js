import { DEFAULT_DIE } from '../constants'
import DeckService from '../services/Deck'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Dice' })
  }

  init({ mode }) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.mode = mode || 'add'
  }

  create() {
    this.events.off('close')

    this.bg = this.add
      .graphics()
      .fillStyle(0x222222, 1)
      .fillRect(10, 10, this.width - 40, this.height - 40)

    this.deckService = new DeckService(this)

    this.events.on('close', () => {
      this.scene.stop('Battle')
      this.scene.stop('Dice')
      this.scene.get('Map').scene.restart()
    })

    if (this.mode === 'add') {
      this.createAddButtons()
    } else if (this.mode === 'remove') {
      this.createRemoveButtons()
    }
    this.createSkipButton()
  }

  update() {}

  onAddDie = (die) => {
    this.deckService.addDie(die)
    this.events.emit('close')
  }

  onRemoveDie = (i) => {
    this.deckService.removeDie(i)
    this.events.emit('close')
  }

  createAddButtons = () => {
    const die = { sides: DEFAULT_DIE }
    const newDice = [die, die, die]
    newDice.forEach((die, i) => {
      this.addButton(die, i).on('pointerdown', () => this.onAddDie(die))
    })
  }

  createRemoveButtons = () => {
    this.registry.values.deck.forEach((die, i) => {
      this.addButton(die, i).on('pointerdown', () => this.onRemoveDie(i))
    })
  }

  createSkipButton = () => {
    this.add
      .sprite(this.width - 15, this.height - 20, 'sheet', 'flip_head.png')
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => this.events.emit('close'))
  }

  addButton = (die, index) => {
    const x = (index % 3) * 50 + 60
    const y = (Math.floor(index / 3) + 1) * 40
    return this.add
      .sprite(x, y, 'sheet', `dice_${die.sides[0]}.png`)
      .setScale(0.5)
      .setInteractive()
  }
}
