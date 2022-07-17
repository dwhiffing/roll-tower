export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Win' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.condition = opts.condition
  }

  create() {
    this.add.image(this.width / 2, 140, 'sheet', 'title.png')

    this.add
      .image(this.width / 2, this.height - 80, 'sheet', 'button.png')
      .setInteractive()
      .on('pointerdown', () => {
        this.registry.values.levelIndex = undefined
        this.scene.start('Menu')
      })

    this.add
      .text(this.width / 2, this.height - 80, 'Play', {
        fontSize: 14,
        align: 'center',
      })
      .setOrigin(0.5)
    this.add
      .text(
        this.width / 2,
        this.height / 2 + 40,
        this.condition ? 'You Win!' : 'You Lose!',
        {
          fontSize: 40,
          align: 'center',
        },
      )
      .setOrigin(0.5)
  }
}
