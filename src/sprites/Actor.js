import { sample } from 'lodash'
import { MOVES, STATS } from '../constants'
import { Armor } from './Armor'
import { Bar } from './Bar'
import { Intent } from './Intent'
import { Status } from './Status'

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

    let _y = spriteKey === 'bat' ? y - 4 : y + 15
    this.hpBar = new Bar(scene, x - 16, _y, 42, 7, 0xff0000)
    this.armorBar = new Armor(scene, x - 32, _y)
    this.intent = new Intent(scene, x - 8, _y - 12)
    this.intent.set('')
    this.status = new Status(scene, x + 21, _y)
    this.status.set('')
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
      if (this.spriteKey !== 'player')
        this.scene.player.damage(this.getDamage())
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
    this.updateStatus()
    if (this.health <= 0) {
      this.die()
    }
  }

  updateStatus = () => {
    this.hpBar.set(this.health, this.maxHealth)
    this.armorBar.set(this.armor)

    if (this.stats.weak > 0) {
      this.status.set('skull.png')
    } else if (this.stats.buffedStr > 0) {
      this.status.set('pawn_up.png')
    } else if (this.stats.flame > 0) {
      this.status.set('fire.png')
    } else {
      this.status.set()
    }
  }

  getIntention = () => {
    const move = sample(
      MOVES[this.spriteKey].filter((move) => {
        if (move.name === 'heal') {
          // ie, dont heal if no one is hurt
          return !this.scene
            .getLiving()
            .every((a) => a.getMissingHealth() === 0)
        }
        return true
      }),
    )
    this.setIntention(move)
  }

  setIntention = (move) => {
    this.move = move
    this.intent.set(`${move.type}.png`)
  }

  getDamage = () => {
    let dmg =
      this.stats.str + (this.stats.buffedStr || 0) - (this.stats.weak || 0)
    if (dmg < 0) dmg = 0
    return dmg
  }

  getMissingHealth = () => {
    return this.maxHealth - this.health
  }

  heal = (amount) => {
    this.health += amount
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
    }
    this.sprite.setTintFill(0x00ffff)
    this.scene.time.delayedCall(300, () => {
      this.sprite.clearTint()
    })
    this.updateStatus()
  }

  getBuffedStr = () => {
    this.stats.buffedStr = this.buffedStr || 0
    this.stats.buffedStr += 1
    this.sprite.setTintFill(0xff00ff)
    this.scene.time.delayedCall(300, () => {
      this.sprite.clearTint()
    })
    this.updateStatus()
  }

  doHeal = (actor) => {
    if (this.isMoving) return
    this.isMoving = true
    // TODO: animation
    this.scene.time.delayedCall(500, () => {
      actor.heal(1)
      this.isMoving = false
    })
  }

  buffStr = (actor) => {
    if (this.isMoving) return
    this.isMoving = true
    // TODO: animation
    this.scene.time.delayedCall(500, () => {
      actor.getBuffedStr()
      this.isMoving = false
    })
  }

  takeTurn = () => {
    if (this.stats.flame > 0) {
      this.stats.flame--
      this.damage(1)
    }
    if (this.health <= 0 || this.scene.player.health <= 0) return
    if (this.move.name === 'attack') {
      this.attack()
    } else if (this.move.name === 'defend') {
      this.addArmor(this.stats.dex)
    } else if (this.move.name === 'heal') {
      const target = this.scene
        .getLiving()
        .sort((a, b) => b.getMissingHealth() - a.getMissingHealth())[0]
      this.doHeal(target)
    } else if (this.move.name === 'buff_str') {
      const target = sample(
        this.scene.getLiving().filter((d) => d.spriteKey !== 'warlock'),
      )
      this.buffStr(target)
    } else if (this.move.name === 'attack_defend') {
      this.attack()
      this.addArmor(this.stats.dex)
    }
  }

  die() {
    this.intent.set('')
    this.status.set('')
    this.hpBar.set(0, this.maxHealth)
    this.hpBar.die()
    this.armorBar.set(0)
    this.armorBar.die()
    this.play('die')
  }
}
