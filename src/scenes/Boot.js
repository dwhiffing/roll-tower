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

    this.load.atlas('die', 'assets/images/die.png', 'assets/images/die.json')
    this.load.atlas(
      'sheet',
      'assets/images/sheet.png',
      'assets/images/sheet.json',
    )
    this.load.spritesheet('player', 'assets/images/player.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('bat', 'assets/images/bat.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('nomad', 'assets/images/nomad.png', {
      frameWidth: 64,
      frameHeight: 64,
    })

    this.load.bitmapFont(
      'pixel-dan',
      'assets/pixel-dan.png',
      'assets/pixel-dan.xml',
    )

    this.load.bitmapFont('gem', 'assets/gem.png', 'assets/gem.xml')

    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('Menu')
    })
  }
}
