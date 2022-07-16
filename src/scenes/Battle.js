import DeckService from '../services/Deck'
import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'

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
  }

  onClickActor = (actor) => {
    if (this.turnIndex !== 0 || this.disableInput || !this.selectedDie) return
    const clickedType = this.selectedDie.sides[this.selectedDie.sideIndex]
    if (clickedType === 'sword' && actor.type === 'enemy') {
      this.onAttack(actor)
    }
    if (clickedType === 'shield' && actor.spriteKey === 'player') {
      this.onAddArmor()
    }
    if (clickedType === 'draw' && actor.spriteKey === 'player') {
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
      this.time.delayedCall(1000, this.won)
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
}
