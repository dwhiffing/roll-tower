import { DEFAULT_DIE } from '../constants'
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
    this.enemies = [new Enemy(this, this.width - 60, 100)]
    if (!this.registry.values.deck) {
      this.registry.values.deck = [
        { sides: DEFAULT_DIE },
        { sides: DEFAULT_DIE },
        { sides: DEFAULT_DIE },
        { sides: DEFAULT_DIE },
        { sides: DEFAULT_DIE },
      ]
    }
    this.registry.values.discard = []
    this.registry.values.dice = [...this.registry.values.deck]
    this.scene.launch('Hud')
    this.scene.get('Hud').events.on('click-die', this.onClickDie.bind(this))
    this.scene.get('Hud').events.on('end-turn', this.onEndTurn.bind(this))
    this.events.off('click-actor')
    this.events.on('click-actor', this.onClickActor.bind(this))
    this.time.delayedCall(100, this.playerTurn.bind(this))
  }

  onClickDie(die, key) {
    if (this.turnIndex !== 0 || this.registry.values.disableInput) return
    this.selectedDie?.deselect()
    this.selectedDie = die
    this.clickedKey = key
    die.select()
  }

  onClickActor(key) {
    if (
      this.turnIndex !== 0 ||
      this.registry.values.disableInput ||
      !this.selectedDie
    )
      return

    if (this.clickedKey === 'sword' && key === 'bat') {
      this.useDie()
      this.player.attack(() => {
        this.enemies[0].damage(1)
        this.time.delayedCall(500, () => {
          this.restoreInput()
          if (this.enemies.every((e) => e.health <= 0)) {
            this.won()
          }
        })
      })
    }
    if (this.clickedKey === 'shield' && key === 'player') {
      this.useDie()
      this.player.addArmor(this.restoreInput)
    }
  }

  useDie = () => {
    this.registry.values.disableInput = true
    this.selectedDie?.sprite?.destroy()
    this.registry.values.hand.splice(this.selectedDie.index, 1)

    if (this.registry.values.hand.length === 0) this.onEndTurn()
  }

  restoreInput = () => {
    this.registry.values.disableInput = false
  }

  playerTurn() {
    this.registry.values.disableInput = false
    this.turnIndex = 0
    if (this.enemies.every((e) => e.health <= 0)) {
      this.won()
    }

    this.scene.get('Hud').events.emit('draw')
  }

  onEndTurn() {
    this.enemyTurn()
  }

  enemyTurn() {
    this.scene.get('Hud').events.emit('discard')
    this.turnIndex = 1
    const living = this.enemies.filter((e) => e.health > 0)

    living.forEach((e, i) => {
      this.time.delayedCall((i + 1) * 1000, () => {
        this.player.damage()
      })
    })

    this.time.delayedCall(living.length + 1 * 1000, this.playerTurn.bind(this))
  }

  won() {
    this.scene.stop('Hud')
    if (this.registry.values.levelIndex === 3) {
      this.scene.start('Win', { condition: true })
    } else {
      this.scene.launch('Dice', { mode: 'add' })
    }
  }

  lose() {
    this.scene.stop('Hud')
    this.scene.start('Win', { condition: false })
  }

  update() {}
}
