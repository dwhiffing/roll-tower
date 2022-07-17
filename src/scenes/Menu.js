import { INITIAL_DECK, STATS } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.add.image(this.width / 2, 200, 'sheet', 'title.png').setScale(0.5)

    this.add
      .image(this.width / 2, this.height - 80, 'sheet', 'button.png')
      .setInteractive()
      .on('pointerdown', this.startGame)

    this.add
      .text(this.width / 2, this.height - 20, 'Created by Dan Whiffing', {
        fontSize: 14,
        align: 'center',
      })
      .setOrigin(0.5)

    // TODO: remove me
    this.startGame()
  }

  startGame() {
    this.registry.values.lastX = 1
    this.registry.values.deck = [...INITIAL_DECK].map((d, i) => ({
      ...d,
      index: i,
    }))
    this.registry.values.playerStats = {
      drawCount: 0,
      str: 0,
      dex: 0,
      hp: STATS.player.hp,
    }
    this.registry.values.activePile = []
    this.registry.values.discardPile = []
    this.scene.start('Map')
  }
}
