export default class Faces {
  constructor(scene, x = 0, y = 0) {
    this.scene = scene

    this.bg = this.scene.add
      .graphics()
      .fillStyle(0x222222, 1)
      .fillRect(x, y, 70, 100)
      .setDepth(98)

    this.scene.input.on('pointermove', (p) => {
      this.move(p.x - 35, p.y - 100)
    })
    this.scene.input.on('pointerover', (a, b) => {
      this.set(b[0].die)
    })
    this.scene.input.on('pointerout', (a, b) => {
      this.set()
    })

    this.sprites = []
    new Array(6).fill('n').forEach((k, i) => {
      this.sprites.push(
        this.scene.add
          .sprite(
            x + (i % 2) * 30 + 10,
            y + Math.floor(i / 2) * 30 + 10,
            'die',
            `dice_sword.png`,
          )
          .setOrigin(0)
          .setScale(0.3)
          .setDepth(99),
      )
    })

    this.bg.setAlpha(0)
    this.sprites.forEach((s, i) => s.setAlpha(0))
  }

  set(die) {
    if (!die) {
      this.bg.setAlpha(0)
      this.sprites.forEach((s, i) => s.setAlpha(0))
      return
    }
    this.bg.setAlpha(1)
    die.sides.forEach((k, i) => {
      this.sprites[i].setAlpha(1)
      this.sprites[i].setFrame(`dice_${k}.png`)
    })
  }

  move(x, y) {
    this.bg.setPosition(x, y)
    this.sprites.forEach((s, i) =>
      s.setPosition(x + (i % 2) * 30 + 10, y + Math.floor(i / 2) * 30 + 10),
    )
  }

  destroy() {
    this.bg.destroy()
    this.sprites.forEach((s) => s.destroy())
  }
}
