export default class Die {
  constructor(scene, x, y, die, onClick) {
    this.scene = scene
    this.sprite = this.scene.add
      .sprite(x, y, 'die')
      .setOrigin(0, 0)
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.scene.registry.values.disableInput) return
        this.sprite.destroy()
        onClick(this.sides[this.sideIndex])
      })

    this.sides = die.sides
    this.sideIndex = Phaser.Math.RND.integerInRange(0, 5)
    this.sprite.setFrame(`dice_${this.sides[this.sideIndex]}.png`)
  }
}
