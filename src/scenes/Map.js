import { NODES } from '../constants'

const NODE_OFFSET = 120
export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Map' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    if (!this.registry.values.levelIndex) this.registry.values.levelIndex = 0

    this.nodes = NODES.map((node, i) => {
      const x = this.width / 2 + 70 * (node.x - 1)
      const y = this.height - (node.y * NODE_OFFSET + 200)
      const sprite = this.add
        .sprite(x, y, 'sheet', node.key + '.png')
        .setTint(0xaaaaaa)
        .setOrigin(0.5)
        .setScale(0.7)
        .setInteractive()
        .on('pointerdown', () => this.clickNode(node, i))
      return { ...node, sprite, index: i }
    })

    this.input.on('pointermove', (p) => {
      if (this.startY) {
        this.cameras.main.scrollY = this.startScroll + (this.startY - p.y)
      }
    })

    this.input.on('pointerdown', (p) => {
      this.startY = p.y
      this.startScroll = this.cameras.main.scrollY
    })

    this.input.on('pointerup', (p) => {
      this.startY = null
      this.startScroll = null
    })
    const x = this.width / 2 + (this.registry.values.lastX - 1) * 70
    const y = 400 - this.registry.values.levelIndex * NODE_OFFSET
    this.player = this.add.sprite(x, y, 'sheet', 'pawn.png').setOrigin(0.5)
    this.cameras.main.centerOnY(this.player.y)

    // // launch remove die screen
    // this.registry.values.levelIndex = 1
    // this.clickNode(this.nodes[1], 1)

    // autostart first battle
    // this.clickNode(this.nodes[0], 0)

    // // launch add die screen
    // this.scene.launch('Dice', { mode: 'add' })
  }

  update() {}

  clickNode = (node, i) => {
    if (node.y === this.registry.values.levelIndex) {
      if (node.type === 'battle') {
        this.scene.start('Battle', {
          enemies: node.enemies,
          type: node.key === 'skull' ? 'boss' : 'normal',
        })
      } else if (node.type === 'event') {
        if (node.event === 'remove-die') {
          this.scene.pause()
          this.scene.launch('Dice', { mode: 'remove' })
        }
        if (node.event === 'upgrade-die') {
          this.scene.pause()
          this.scene.launch('Dice', { mode: 'upgrade' })
        }
      } else if (node.type === 'camp') {
        this.showRestPrompt()
      }
      this.registry.values.lastX = node.x
      this.registry.values.levelIndex++
    }
  }

  showRestPrompt = () => {
    this.bg = this.add
      .graphics()
      .fillStyle(0x222222, 1)
      .fillRect(10, 10, this.width - 20, 200)
    this.add
      .bitmapText(this.width / 2, 40, 'gem', 'Rest or Upgrade?')
      .setOrigin(0.5)
    this.add
      .sprite(this.width / 2 - 50, 120, 'sheet', `campfire.png`)
      .setInteractive()
      .on('pointerdown', () => {
        // TODO: restore 20% of hp
        this.player.health = 10
        this.scene.restart()
      })
    this.add
      .sprite(this.width / 2 + 50, 120, 'sheet', `card_lift.png`)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.pause()
        this.scene.launch('Dice', { mode: 'upgrade' })
      })
  }
}
