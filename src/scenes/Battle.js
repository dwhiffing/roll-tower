import DeckService from '../services/Deck'
import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'
import { POSSIBLE_TARGETS } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Battle' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.enemyData = opts.enemies || []
    this.battleType = opts.type || 'normal'
  }

  create() {
    this.player = new Player(this, 50, 100)
    this.deckService = new DeckService(this)

    this.enemies = this.enemyData
      .map((enemy, i) => {
        if (!enemy) return null
        const x = this.width - (30 + 60 * (i % 3))
        const y = 50 + Math.floor(i / 3) * 50
        return new Enemy(this, x, y, enemy.type)
      })
      .filter((e) => !!e)

    this.createHud()
    this.time.delayedCall(100, this.playerTurn)

    this.scene.get('BattleHud').events.off('click-die')
    this.scene.get('BattleHud').events.on('click-die', this.onClickDie)

    this.scene.get('BattleHud').events.off('double-click-die')
    this.scene
      .get('BattleHud')
      .events.on('double-click-die', this.onDoubleClickDie)
  }

  onClickDie = (die) => {
    if (this.turnIndex !== 0 || this.disableInput) return
    if (
      this.selectedDie &&
      this.selectedDie.sides[this.selectedDie.sideIndex] === 'reroll'
    ) {
      this.onReroll(this.selectedDie, die)
      return
    }

    this.selectedDie?.deselect()
    this.selectedDie = die
    die.select()

    this.unhighlightAll()
    const face = die.sides[die.sideIndex]
    const targets = POSSIBLE_TARGETS[face]
    if (targets.includes('player')) {
      this.player.highlight()
    }
    if (targets.includes('enemy')) {
      this.getLiving().forEach((e) => e.highlight())
    }
    if (targets.includes('die')) {
      this.hud.activePileSprites.forEach((e) => {
        if (e !== this.selectedDie) e.highlight()
      })
    }
  }

  onDoubleClickDie = (die) => {
    if (this.turnIndex !== 0 || this.disableInput) return
    const _die = this.selectedDie || die
    const face = _die.sides[_die.sideIndex]
    this.handleFace(face)
  }

  onClickActor = (actor) => {
    if (this.turnIndex !== 0 || this.disableInput || !this.selectedDie) return
    const face = this.selectedDie.sides[this.selectedDie.sideIndex]
    this.handleFace(face, actor)
  }

  handleFace = (face, actor) => {
    const isCrit = face.match(/_crit/)
    if (face.match(/sword|magic|arrow|book|skull|fire/)) {
      if (!actor && this.getLiving().length < 2) {
        actor = this.getLiving()[0]
      }
      if (face.match(/magic/)) {
        this.onAttack(actor, isCrit ? 2 : 1, { stun: true })
      } else if (face.match(/skull/)) {
        this.onAttack(actor, isCrit ? 2 : 1, { weak: true })
      } else if (face.match(/book/)) {
        this.onAttack(actor, isCrit ? 2 : 1, { corrosive: true })
      } else if (face.match(/fire/)) {
        this.onAttack(actor, isCrit ? 2 : 1, { fire: true })
      } else if (face.match(/arrow/)) {
        this.getLiving().forEach((actor) => {
          this.onAttack(actor, isCrit ? 2 : 1)
        })
      } else if (actor && actor.type === 'enemy')
        this.onAttack(actor, isCrit ? 2 : 1)
    } else if (
      face.match(/shield/) &&
      (!actor || actor.spriteKey === 'player')
    ) {
      this.onAddArmor(isCrit ? 2 : 1)
    } else if (face === 'draw' && (!actor || actor.spriteKey === 'player')) {
      this.onDraw()
    }
  }

  onDraw = () => {
    this.onUseDie()
    this.time.delayedCall(250, () => {
      this.deckService.draw(1)
      this.restoreInput()
    })
  }

  onReroll = (source, target) => {
    this.onUseDie(source !== target)
    this.time.delayedCall(250, () => {
      this.deckService.reroll(target.index)
      this.restoreInput()
    })
  }

  onAttack = (actor, damageMulti = 1, props = {}) => {
    if (props.stun) {
      actor.setIntention({ type: 'random' })
    }
    if (props.weak) {
      actor.stats.weak = actor.stats.weak || 0
      actor.stats.weak += 1
    }
    if (props.fire) {
      actor.stats.flame += 3
    }
    let _damage = this.player.getDamage() * damageMulti
    if (props.corrosive) {
      _damage = actor.armor
    }
    this.onUseDie()
    this.player.attack(1)
    this.time.delayedCall(500, () => {
      const enemy = this.enemies.find((e) => e === actor)
      enemy?.damage(_damage)
      this.restoreInput()
    })
  }

  onAddArmor = (amountMulti = 1) => {
    this.onUseDie()
    this.player.addArmor(this.player.stats.dex * amountMulti)
    this.time.delayedCall(500, this.restoreInput)
  }

  onUseDie = (shouldDestroy = true) => {
    this.disableInput = true
    if (this.selectedDie && shouldDestroy) {
      this.deckService.discard(this.selectedDie.index)
      this.selectedDie?.sprite?.destroy()
    }
    this.selectedDie = null
    this.unhighlightAll()
  }

  restoreInput = () => {
    this.disableInput = false
    this.checkWinCondition()
    if (
      this.registry.values.activePile.length === 0 &&
      this.getLiving().length > 0
    ) {
      this.enemyTurn()
    }
  }

  playerTurn = () => {
    this.turnIndex = 0
    if (this.player.health > 0 && this.getLiving().length > 0) {
      this.deckService.draw(this.player.stats.drawCount)
      this.getLiving().forEach((e, i) => e.getIntention())
      this.hud.endTurnButton.setAlpha(1)
    }
    this.restoreInput()
  }

  enemyTurn = () => {
    this.selectedDie = null
    this.deckService.discardAll()
    this.turnIndex = 1
    this.hud.endTurnButton.setAlpha(0)

    this.getLiving().forEach((e, i) =>
      this.time.delayedCall((i + 1) * 500, e.takeTurn),
    )
    const numLiving = this.getLiving().length
    this.time.delayedCall((numLiving + 1) * 500, this.playerTurn.bind(this))
  }

  getLiving = () => this.enemies.filter((e) => e.health > 0)

  won = () => {
    this.events.emit('battle-ended')
    if (this.battleType === 'boss') {
      this.scene.start('Win', { condition: true })
    } else {
      this.scene.launch('Dice', { mode: 'add' })
    }
  }

  lose = () => {
    this.events.emit('battle-ended')
    this.scene.start('Win', { condition: false })
  }

  update() {}

  checkWinCondition = () => {
    if (this.enemies.every((e) => e.health <= 0)) {
      this.time.delayedCall(2000, this.won)
    }
  }

  createHud = () => {
    this.scene.launch('BattleHud')

    this.scene.get('BattleHud').events.off('end-turn')
    this.scene.get('BattleHud').events.on('end-turn', this.enemyTurn)

    this.events.off('click-actor')
    this.events.on('click-actor', this.onClickActor)

    this.hud = this.scene.get('BattleHud')
  }

  unhighlightAll = () => {
    this.player.unhighlight()
    this.hud.activePileSprites.forEach((e) => e.unhighlight())
    this.getLiving().forEach((e) => e.unhighlight())
  }
}
