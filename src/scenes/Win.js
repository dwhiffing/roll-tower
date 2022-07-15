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
    this.add
      .text(
        this.width / 2,
        this.height / 2,
        this.condition ? 'You Win!' : 'You Lose!',
        {
          fontSize: 40,
          align: 'center',
        },
      )
      .setOrigin(0.5)

    this.add
      .image(this.width / 2, this.height - 50, 'sheet', 'button.png')
      .setInteractive()
      .setScale(0.5)
      .on('pointerdown', () => this.scene.start('Game'))
  }
}
