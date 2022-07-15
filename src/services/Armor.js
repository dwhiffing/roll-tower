export class Armor {
  constructor(scene, x, y) {
    this.scene = scene

    this.sprite = this.scene.add
      .sprite(x, y, 'sheet', 'shield.png')
      .setScale(0.25)
      .setTint(0xaaaaaa)
      .setOrigin(0, 0.5)
    this.valueText = this.scene.add
      .bitmapText(x + 9, y + 2, 'pixel-dan', '0')
      .setOrigin(0.5)
  }

  die() {
    this.sprite.setActive(false).setVisible(false)
  }

  set(value) {
    this.sprite.setActive(true).setVisible(true)
    this.value = Math.max(value, 0)
    this.valueText.text = `${value}`
  }
}
