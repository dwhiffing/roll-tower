import { sampleSize } from 'lodash'
import { DICE_POOL } from '../constants'
import DeckService from '../services/Deck'
import Faces from '../sprites/Faces'

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
      .fillRect(10, 10, this.width - 20, this.height - 20)

    this.faces = new Faces(this)

    this.valueText = this.add
      .bitmapText(
        this.width / 2,
        40,
        'gem',
        this.mode === 'add'
          ? 'Add a new die'
          : this.mode === 'remove'
          ? 'Remove a die'
          : 'Upgrade a die',
      )
      .setOrigin(0.5)

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
    } else if (this.mode === 'upgrade') {
      this.createUpgradeButtons()
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

  onUpgradeDie = (face) => {
    this.deckService.upgradeDie(this.selectedDie, face)
    this.events.emit('close')
  }

  createAddButtons = () => {
    const newDice = sampleSize(DICE_POOL, 3)
    newDice.forEach((die, i) => {
      const x = 60
      const y = i * 80 + 120
      const text = this.add
        .bitmapText(x + 30, y, 'gem', die.name)
        .setOrigin(0, 0.5)
        .setInteractive()
        .on('pointerdown', () => this.onAddDie(die))
      const sprite = this.add
        .sprite(x, y, 'die', `dice_${die.sides[0]}.png`)
        .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => this.onAddDie(die))
      text.die = die
      sprite.die = die
    })
  }

  createRemoveButtons = () => {
    this.registry.values.deck.forEach((die, i) => {
      const perRow = 5
      const x = (i % perRow) * 45 + 45
      const y = (Math.floor(i / perRow) + 1) * 45 + 50
      this.add
        .sprite(x, y, 'die', `dice_${die.sides[0]}.png`)
        .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => this.onRemoveDie(i))
    })
  }

  createUpgradeButtons = () => {
    // need to be able to select a specific face on a die
    this.registry.values.deck.forEach((die, i) => {
      const perRow = 5
      const x = (i % perRow) * 45 + 45
      const y = (Math.floor(i / perRow) + 1) * 45 + 50
      this.add
        .sprite(x, y, 'die', `dice_${die.sides[0]}.png`)
        .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.selectedDie = die
          this.selectedDie.index = i
          this.faces.set(this.registry.values.deck[i])
        })
    })

    this.faces = new Faces(
      this,
      this.width / 2 - 40,
      200,
      false,
      this.onUpgradeDie,
    )
  }

  createSkipButton = () => {
    this.add
      .sprite(this.width - 50, this.height - 50, 'sheet', 'flip_head.png')
      .setInteractive()
      .on('pointerdown', () => this.events.emit('close'))
  }
}
