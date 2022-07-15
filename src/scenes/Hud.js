export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Hud' })
  }

  init({ onClickDie }) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.onClickDie = onClickDie
  }

  create() {
    this.bg = this.add.graphics()
    this.bg.fillStyle(0x222222, 1)
    const h = this.cameras.main.height
    this.bg.fillRect(0, h / 2, this.cameras.main.width, h / 2)
    this.addDie(0, 'dice_sword')
    this.addDie(1, 'dice_shield')
  }

  addDie(index, key) {
    const button = this.add.sprite(
      index * 100 + 50,
      this.height / 2 + 20,
      'sheet',
      key + '.png',
    )
    button
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', () => {
        this.onClickDie(key)
      })
  }

  update() {}
}
