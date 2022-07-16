import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'

// const DEFAULT_DIE = ['shield', 'shield', 'shield', 'shield', 'shield', 'shield']
const DEFAULT_DIE = ['sword', 'sword', 'sword', 'shield', 'shield', 'shield']
export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
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
    this.time.delayedCall(100, this.playerTurn.bind(this))
  }

  onClickDie(key) {
    // ignore if not player turn
    if (this.turnIndex !== 0 || this.registry.values.disableInput) return
    this.registry.values.disableInput = true
    // TODO: should select die, then allow target to be selected instead
    if (key === 'sword') {
      this.player.attack(() => {
        this.enemies[0].damage(1)
        this.enemyTurn()
      })
    }
    if (key === 'shield') {
      this.player.addArmor(() => {
        this.enemyTurn()
      })
    }
  }

  playerTurn() {
    this.registry.values.disableInput = false
    this.turnIndex = 0
    if (this.enemies.every((e) => e.health <= 0)) {
      this.won()
    }

    this.scene.get('Hud').events.emit('draw')
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
      this.scene.start('Map')
    }
  }

  lose() {
    this.scene.stop('Hud')
    this.scene.start('Win', { condition: false })
  }

  update() {}
}
