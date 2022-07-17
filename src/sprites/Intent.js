export class Intent {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = this.scene.add
      .sprite(x, y, 'sheet', 'shield.png')
      .setScale(0.2)
      .setTint(0x0000ff)
      .setOrigin(0, 0.5)
  }

  die() {
    this.sprite.setActive(false).setVisible(false)
  }

  set(key) {
    this.sprite.setAlpha(key ? 1 : 0)
    this.sprite.setFrame(key)
  }
}
