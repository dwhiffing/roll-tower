import { DEFAULT_DIE } from '../constants'

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
    this.bg = this.add.graphics()
    this.bg.fillStyle(0x222222, 1)
    const w = this.width
    const h = this.height
    this.bg.fillRect(10, 10, w - 40, h - 40)

    this.events.off('close')

    if (this.mode === 'add') {
      const onAdd = () => {
        this.registry.values.deck.push({ sides: DEFAULT_DIE })
        this.events.emit('close')
      }
      this.addDie(0, 'sword').on('pointerdown', onAdd)
      this.addDie(1, 'sword').on('pointerdown', onAdd)
      this.addDie(2, 'sword').on('pointerdown', onAdd)
      this.events.on('close', () => {
        this.scene.stop('Game')
        this.scene.stop('Dice')
        this.scene.start('Map')
      })
    } else if (this.mode === 'remove') {
      const onRemove = () => {
        this.registry.values.deck.pop()
        this.events.emit('close')
      }
      this.registry.values.deck.forEach((die, i) => {
        this.addDie(i, 'sword').on('pointerdown', onRemove)
      })
      const mapScene = this.scene.get('Map')
      this.events.on('close', () => {
        this.scene.stop('Dice')
        mapScene.scene.restart()
      })
    }
    this.add
      .sprite(w - 15, h - 20, 'sheet', 'flip_head.png')
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.events.emit('close')
      })
  }

  update() {}

  addDie(index, key) {
    return this.add
      .sprite(index * 50 + 60, 40, 'sheet', `dice_${key}.png`)
      .setScale(0.5)
      .setInteractive()
  }
}
