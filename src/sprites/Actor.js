import { sample } from 'lodash'
import { STATS } from '../constants'
import { Armor } from './Armor'
import { Bar } from './Bar'
import { Intent } from './Intent'

export default class Actor {
  constructor(scene, spriteKey, x, y) {
    this.scene = scene
    this.spriteKey = spriteKey
    this.sprite = scene.add.sprite(x, y, spriteKey)
    this.stats = { ...STATS[spriteKey] }
    this.stats.flame = 0
    if (!this.health) {
      this.health = this.stats.hp
      this.maxHealth = this.stats.hp
    }
    this.armor = 0
    this.hpBar = new Bar(scene, x - 16, y - 4, 42, 7, 0xff0000)
    this.armorBar = new Armor(scene, x - 32, y - 4)
    this.intent = new Intent(scene, x - 8, y - 18)
    this.intent.set('')
    this.hpBar.set(this.health, this.maxHealth)
    this.sprite.setInteractive()
    this.sprite.on('pointerdown', () => {
      this.scene.events.emit('click-actor', this)
    })
    this.sprite.on('animationcomplete', (e) => {
      if (e.key.match(/attack/)) {
        this.play('idle')
      }
      if (e.key.match(/armor/)) {
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

  unhighlight() {
    this.sprite.clearTint()
  }

  highlight() {
    this.sprite.setTintFill(0xffff00)
  }

  attack() {
    // TODO: need bat attack animation
    if (this.isMoving) return
    this.isMoving = true
    this.play('attack')
    this.scene.time.delayedCall(500, () => {
      this.isMoving = false
    })
  }

  addArmor(amount = 1) {
    if (this.isMoving) return
    this.isMoving = true
    this.play('armor')
    this.scene.time.delayedCall(500, () => {
      this.armor += amount
      this.isMoving = false
      this.armorBar.set(this.armor)
    })
  }

  damage = (amount = 1) => {
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

  getIntention = () => {
    const move = sample(this.moves)
    this.setIntention(move)
  }

  setIntention = (move) => {
    this.intention = move.type
    this.intent.set(`${move.type}.png`)
  }

  takeTurn = () => {
    if (this.stats.flame > 0) {
      this.stats.flame--
      this.damage(1)
    }
    if (this.health <= 0 || this.scene.player.health <= 0) return
    if (this.intention === 'sword') {
      this.scene.player.damage(this.stats.str)
      this.attack()
    } else if (this.intention === 'shield') {
      this.addArmor(this.stats.dex)
    }
  }

  die() {
    this.intent.set('')
    this.hpBar.set(0, this.maxHealth)
    this.hpBar.die()
    this.armorBar.set(0)
    this.armorBar.die()
    this.play('die')
  }
}
