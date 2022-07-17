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

    // this should be done in a service
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
      this.selectedDie.sides[this.selectedDie.sideIndex] === 'reroll' &&
      die !== this.selectedDie
    ) {
      this.onReroll(die)
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
    if (face === 'sword') {
      if (!actor && this.getLiving().length < 2) {
        actor = this.getLiving()[0]
      }
      if (actor && actor.type === 'enemy') this.onAttack(actor)
    } else if (face === 'shield' && (!actor || actor.spriteKey === 'player')) {
      this.onAddArmor()
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

  onReroll = (die) => {
    this.onUseDie()
    this.time.delayedCall(250, () => {
      this.deckService.reroll(die.index)
      this.restoreInput()
    })
  }

  onAttack = (actor) => {
    this.onUseDie()
    this.player.attack(1)
    this.time.delayedCall(500, () => {
      const enemy = this.enemies.find((e) => e === actor)
      enemy?.damage(1)
      this.restoreInput()
    })
  }

  onAddArmor = () => {
    this.onUseDie()
    this.player.addArmor()
    this.time.delayedCall(500, this.restoreInput)
  }

  onUseDie = () => {
    this.disableInput = true
    this.deckService.discard(this.selectedDie.index)
    this.selectedDie?.sprite?.destroy()
    this.selectedDie = null
    this.unhighlightAll()
  }

  restoreInput = () => {
    this.disableInput = false
    this.checkWinCondition()
    if (this.registry.values.activePile.length === 0) {
      this.enemyTurn()
    }
  }

  playerTurn = () => {
    this.turnIndex = 0
    if (this.player.health > 0) {
      this.deckService.draw(3)
    }
    this.getLiving().forEach((e, i) => e.getIntention())
    this.hud.endTurnButton.setAlpha(1)
    this.restoreInput()
  }

  enemyTurn = () => {
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
    // TODO: should be based on passed battle key being boss
    if (this.registry.values.levelIndex === 3) {
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
