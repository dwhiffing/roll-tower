import { Bar } from '../services/Bar'

export default class Actor {
  constructor(scene, spriteKey, x, y) {
    this.scene = scene
    this.spriteKey = spriteKey
    this.sprite = scene.add.sprite(x, y, spriteKey)
    this.health = 1
    this.maxHealth = 1
    this.hpBar = new Bar(scene, x - 16, y - 4, 32, 5, 0xff0000)
    this.hpBar.set(this.health, this.maxHealth)
    this.sprite.on('animationcomplete', (e) => {
      if (e.key.match(/attack/)) {
        this.isAttacking = false
        this.play('idle')
        this.attackCallback?.()
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
    if (this.isAttacking) return
    this.isAttacking = true
    this.play('attack')
    this.attackCallback = callback
  }

  damage(amount = 1) {
    this.health -= amount
    this.sprite.setTintFill(0xff0000)
    this.scene.time.delayedCall(300, () => this.sprite.clearTint())
    this.hpBar.set(this.health, this.maxHealth)
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
