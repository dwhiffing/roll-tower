import { TRANSITION_DURATION } from '../constants'

export class Bar {
  constructor(scene, x, y, width, height, tint, scroll = true) {
    this.scene = scene
    this.width = width
    this.height = height

    const get = (x, y, key, width = 0, height) =>
      this.scene.add
        .sprite(x, y, 'sheet', key + '.png')
        .setDisplaySize(width, height)
        .setScrollFactor(scroll ? 1 : 0)
        .setOrigin(0, 0.5)

    const o = height > 2 ? 2 : 0
    this.shadowMid = get(x, y, 'dice_0', width - 6, height).setTint(0x000000)
    this.barMid = get(x + 1, y, 'dice_0', 0, height - o).setTint(tint)
    this.valueText = this.scene.add
      .bitmapText(x + width / 2 - 2, y + 2, 'pixel-dan', '1/1')
      .setOrigin(0.5, 0.5)
  }

  die() {
    this.barMid.setActive(false).setVisible(false)
    this.shadowMid.setActive(false).setVisible(false)
    this.scene.time.delayedCall(TRANSITION_DURATION / 2, () => {
      this.valueText.setAlpha(0)
    })
  }

  set(value, maxValue) {
    this.barMid.setActive(true).setVisible(true)
    this.shadowMid.setActive(true).setVisible(true)
    this.value = Math.max(value, 0)
    if (typeof maxValue === 'number') this.maxValue = maxValue
    this.update()
    this.valueText.text = `${value}/${maxValue}`
  }

  move(x, y) {
    this.barMid.setPosition(x - this.width / 2 + 1, y)
    this.shadowMid.setPosition(x - this.width / 2, y)
    this.valueText.setPosition(x - 2, y + 2)
  }

  update() {
    let factor = this.value / this.maxValue
    factor = isNaN(factor) ? 0 : factor
    const w = (this.width - 6) * factor - 2
    this.barMid.setDisplaySize(w, this.height - (this.height < 3 ? 0 : 2))
  }
}
