export default class Die {
  constructor(scene, x, y, die) {
    this.scene = scene
    this.sideIndex = die.sideIndex
    this.sides = die.sides
    this.index = die.index
    let lastTime = 0
    this.sprite = this.scene.add
      .sprite(x, y, 'die')
      .setOrigin(0, 0)
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        let clickDelay = this.scene.time.now - lastTime
        lastTime = this.scene.time.now
        let eventName = 'click-die'
        if (clickDelay < 350) {
          eventName = 'double-click-die'
        }
        this.scene.events.emit(eventName, this, this.sides[this.sideIndex])
      })
    this.sprite.setFrame(`dice_${this.sides[this.sideIndex]}.png`)
    this.sprite.setDepth(9)
    this.sprite.die = this
    this.selected = false
  }

  select = () => {
    this.selected = true
    this.sprite.setTint(0x0000ff)
  }

  deselect = () => {
    this.selected = false
    this.sprite.clearTint()
  }

  highlight = () => {
    this.sprite.setTint(0xffff00)
  }

  unhighlight = () => {
    this.sprite.clearTint()
    if (this.selected) this.select()
  }

  destroy = () => {
    this.sprite.destroy()
  }
}
