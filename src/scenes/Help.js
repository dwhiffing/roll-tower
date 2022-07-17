export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Help' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    // TODO: finish help
    this.add.text(10, 10, 'This text will explain how to\nplay the game', {
      fontSize: 12,
    })
    this.add
      .image(this.width / 2, this.height - 80, 'sheet', 'button.png')
      .setInteractive()
      .on('pointerdown', this.startGame)

    this.add
      .text(this.width / 2, this.height - 80, 'Back', {
        fontSize: 14,
        align: 'center',
      })
      .setOrigin(0.5)
  }

  startGame = () => {
    this.scene.start('Menu')
  }
}
