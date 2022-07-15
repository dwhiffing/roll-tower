import Enemy from '../sprites/Enemy'
import Player from '../sprites/Player'

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
    this.scene.launch('Hud', { onClickDie: this.onClickDie.bind(this) })
    this.turnIndex = 0
  }

  onClickDie(key) {
    // ignore if not player turn
    if (this.turnIndex !== 0) return

    // TODO: should select die, then allow target to be selected instead
    if (key === 'dice_sword') {
      this.player.attack(() => {
        this.enemies[0].damage(1)
        this.enemyTurn()
      })
    }
    if (key === 'dice_shield') {
      this.enemyTurn()
    }
  }

  playerTurn() {
    this.turnIndex = 0
    if (this.enemies.every((e) => e.health <= 0)) {
      this.won()
    }
  }
  enemyTurn() {
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
    this.scene.start('Win', { condition: true })
  }

  lose() {
    this.scene.stop('Hud')
    this.scene.start('Win', { condition: false })
  }

  update() {}
}
