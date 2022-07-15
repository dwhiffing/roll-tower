import { Armor } from '../services/Armor'
import { Bar } from '../services/Bar'

export default class Actor {
  constructor(scene, spriteKey, x, y) {
    this.scene = scene
    this.spriteKey = spriteKey
    this.sprite = scene.add.sprite(x, y, spriteKey)
    this.health = 1
    this.maxHealth = 1
    this.armor = 0
    this.hpBar = new Bar(scene, x - 16, y - 4, 42, 7, 0xff0000)
    this.armorBar = new Armor(scene, x - 32, y - 4)
    this.hpBar.set(this.health, this.maxHealth)
    this.sprite.on('animationcomplete', (e) => {
      if (e.key.match(/attack/)) {
        this.isMoving = false
        this.play('idle')
        this.attackCallback?.()
      }
      if (e.key.match(/armor/)) {
        this.isMoving = false
        this.play('idle')
      }
      if (e.key.match(/die/)) {
        this.sprite.setAlpha(0)
      }
    })
  }

  play(key) {
    return this.sprite.play(`${this.spriteKey}-${key}`)
  }

  attack(callback) {
    if (this.isMoving) return
    this.isMoving = true
    this.play('attack')
    this.attackCallback = callback
  }

  addArmor(callback, amount = 1) {
    if (this.isMoving) return
    this.isMoving = true
    this.play('armor')
    this.scene.time.delayedCall(500, () => {
      this.armor += amount
      this.armorBar.set(this.armor)
      callback()
    })
  }

  damage(amount = 1) {
    let _amount = amount
    const diff = this.armor - amount
    if (diff >= 0) {
      _amount = 0
      this.armor = diff
    } else {
      this.armor = 0
      if (diff > 0) {
        _amount = diff
      }
    }
    this.health -= _amount
    this.sprite.setTintFill(0xff0000)
    this.scene.time.delayedCall(300, () => this.sprite.clearTint())
    this.hpBar.set(this.health, this.maxHealth)
    this.armorBar.set(this.armor)
    if (this.health <= 0) {
      this.die()
    }
  }

  die() {
    this.hpBar.set(0, this.maxHealth)
    this.hpBar.die()
    this.play('die')
  }
}
