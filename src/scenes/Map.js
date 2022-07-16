import { BOSS_BATTLE, FIRST_BATTLE } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Map' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    if (!this.registry.values.levelIndex) this.registry.values.levelIndex = 0

    this.nodes = ['sword', 'rhombus_question', 'skull'].map((key, i) => {
      const sprite = this.add
        .sprite(
          this.width / 2,
          this.height - (i * 100 + 200),
          'sheet',
          key + '.png',
        )
        .setTint(0xaaaaaa)
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.clickNode(key, i))

      return { index: i, type: key, sprite }
    })
    this.player = this.add
      .sprite(
        this.width / 2,
        380 - this.registry.values.levelIndex * 100,
        'sheet',
        'pawn.png',
      )
      .setOrigin(0.5)

    this.clickNode('sword', 0)
  }

  update() {}

  clickNode = (key, i) => {
    if (i + 1 === this.registry.values.levelIndex + 1) {
      if (key === 'sword') {
        this.scene.start('Battle', FIRST_BATTLE)
      } else if (key === 'skull') {
        this.scene.start('Battle', BOSS_BATTLE)
      } else if (key === 'rhombus_question') {
        this.scene.pause()
        this.scene.launch('Dice', { mode: 'remove' })
      }
      this.registry.values.levelIndex++
    }
  }
}
