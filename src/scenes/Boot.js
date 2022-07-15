export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()
    const { width, height } = this.sys.game.config

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(0, height / 2, width * value, 60)
    })
    this.load.atlas(
      'sprites',
      'assets/images/sheet.png',
      'assets/images/sheet.json',
    )

    this.load.on('complete', () => {
      progress.destroy()
      // this.scene.start('Menu')
      this.scene.start('Game')
    })
  }
}
