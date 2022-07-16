import DeckService from '../services/Deck'
import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Battle' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.player = new Player(this, 60, 100)
    this.deckService = new DeckService(this)

    // TODO: should be able to pass in enemy configuration and spawn up to 5 enemies
    // this should be done in a service
    this.enemies = [new Enemy(this, this.width - 60, 100)]

    this.createHud()
    this.time.delayedCall(100, this.playerTurn)
  }

  onClickActor = (key) => {
    if (this.turnIndex !== 0 || this.disableInput || !this.selectedDie) return
    const clickedType = this.selectedDie.sides[this.selectedDie.index]
    if (clickedType === 'sword' && key === 'bat') {
      this.onAttack()
    }
    if (clickedType === 'shield' && key === 'player') {
      this.addArmor()
    }
  }

  onAttack = () => {
    this.onUseDie()
    this.player.attack(() => {
      // TODO: needs to target clicked actor
      this.enemies[0].damage(1)
      this.time.delayedCall(500, this.restoreInput)
    })
  }

  onAddArmor = () => {
    this.onUseDie()
    this.player.addArmor(this.restoreInput)
  }

  onUseDie = () => {
    this.disableInput = true
    this.selectedDie?.sprite?.destroy()
    this.deckService.discard(this.selectedDie.index)
    if (this.registry.values.activePile.length === 0) this.enemyTurn()
  }

  restoreInput = () => {
    this.disableInput = false
    this.checkWinCondition()
  }

  playerTurn = () => {
    this.turnIndex = 0
    this.restoreInput()
    if (this.player.health > 0) {
      this.deckService.draw()
    }
  }

  enemyTurn = () => {
    this.deckService.discardAll()
    this.turnIndex = 1

    // TODO: damage should come from enemy stats
    const living = this.enemies.filter((e) => e.health > 0)
    living.forEach((e, i) =>
      this.time.delayedCall((i + 1) * 1000, this.player.damage),
    )
    this.time.delayedCall(living.length + 1 * 1000, this.playerTurn.bind(this))
  }

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
      this.won()
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
