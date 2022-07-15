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

    this.nodes = ['sword', 'sword', 'skull'].map((key, i) => {
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
        .on('pointerdown', () => {
          if (i + 1 === this.registry.values.levelIndex + 1) {
            this.scene.start('Game')
            this.registry.values.levelIndex++
          }
        })

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
  }

  update() {}
}
