import Die from '../sprites/Die'

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
    this.registry.values.dice.forEach((die, i) => this.addDie(die, i))
  }

  addDie(die, index) {
    const x = index * 50 + 20
    const y = this.height / 2 + 20
    new Die(this, x, y, die, this.onClickDie)
  }

  update() {}
}
