export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Win' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.add
      .text(this.width / 2, this.height / 2, 'You Win!', {
        fontSize: 200,
        align: 'center',
      })
      .setOrigin(0.5)
  }
}
