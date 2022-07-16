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
    if (this.turnIndex !== 0 || this.disableInput || !this.hud.selectedDie)
      return
    const clickedKey = this.hud.selectedDie.sides[this.hud.selectedDie.index]
    if (clickedKey === 'sword' && key === 'bat') {
      this.hud.consumeSelectedDie()
      this.player.attack(() => {
        // TODO: needs to target clicked actor
        this.enemies[0].damage(1)
        this.time.delayedCall(500, this.restoreInput)
      })
    }
    if (clickedKey === 'shield' && key === 'player') {
      this.hud.consumeSelectedDie()
      this.player.addArmor(this.restoreInput)
    }
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
    this.deckService.discard()
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
    this.scene.launch('Hud')

    this.scene.get('Hud').events.off('end-turn')
    this.scene.get('Hud').events.on('end-turn', this.enemyTurn)

    this.events.off('click-actor')
    this.events.on('click-actor', this.onClickActor)

    this.hud = this.scene.get('Hud')
  }
}
