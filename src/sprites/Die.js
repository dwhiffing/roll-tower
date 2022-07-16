export default class Die {
  constructor(scene, x, y, die) {
    this.scene = scene
    this.sprite = this.scene.add
      .sprite(x, y, 'die')
      .setOrigin(0, 0)
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.scene.registry.values.disableInput) return
        this.scene.events.emit('click-die', this, this.sides[this.sideIndex])
      })

    this.sides = die.sides
    this.index = die.index
    this.sideIndex = Phaser.Math.RND.integerInRange(0, 5)
    this.sprite.setFrame(`dice_${this.sides[this.sideIndex]}.png`)
    this.sprite.setDepth(999)
    this.selected = false
  }

  select = () => {
    this.selected = true
    this.sprite.setTint(0xffff00)
  }

  deselect = () => {
    this.selected = false
    this.sprite.clearTint()
  }

  destroy = () => {
    this.sprite.destroy()
  }
}
