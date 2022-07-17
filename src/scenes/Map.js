import { NODES, STATS } from '../constants'

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

    const _y = this.height / 2 - 100
    this.promptBg = this.add
      .graphics()
      .fillStyle(0x222222, 1)
      .fillRect(10, _y, this.width - 20, 200)
      .setScrollFactor(0)
      .setAlpha(0)
    this.promptTitle = this.add
      .bitmapText(this.width / 2, _y + 40, 'gem', '')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setAlpha(0)
    this.promptOptionA = this.add
      .sprite(this.width / 2 - 50, _y + 120, 'sheet', `campfire.png`)
      .setInteractive()
      .on('pointerdown', this.onPromptA)
      .setScrollFactor(0)
      .setAlpha(0)
    this.promptOptionB = this.add
      .sprite(this.width / 2 + 50, _y + 120, 'sheet', `card_lift.png`)
      .setInteractive()
      .on('pointerdown', this.onPromptB)
      .setScrollFactor(0)
      .setAlpha(0)

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
    if (this.promptType) return
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
        if (node.event === 'increase-draw') {
          this.showPrompt('increase-draw')
        }
      } else if (node.type === 'camp') {
        this.showPrompt('camp')
      }
      this.registry.values.lastX = node.x
      this.registry.values.levelIndex++
    }
  }

  onPromptA = () => {
    const r = this.registry
    if (this.promptBg.alpha === 0) return
    if (this.promptType === 'camp') {
      // TODO: restore 20% of hp
      r.values.playerStats.hp = STATS.player.hp
    } else {
      // accept terms of prompt
      if (this.promptType === 'increase-draw') {
        if (Phaser.Math.RND.integerInRange(0, 1) === 0) {
          r.values.playerStats.drawCount += 1
        } else {
          this.hurtPlayer()
        }
      }
    }
    this.hidePrompt()
  }

  hurtPlayer = (amount = 5) => {
    r.values.playerStats.hp -= amount
    if (r.values.playerStats.hp < 1) {
      r.values.playerStats.hp = 1
    }
  }

  onPromptB = () => {
    if (this.promptBg.alpha === 0) return
    if (this.promptType === 'camp') {
      this.scene.pause()
      this.scene.launch('Dice', { mode: 'upgrade' })
    } else {
      // reject terms of prompt, TODO: get 5 hp as bonus?
    }
    this.hidePrompt()
  }

  hidePrompt = () => {
    this.promptBg.setAlpha(0)
    this.promptTitle.setAlpha(0)
    this.promptOptionA.setAlpha(0)
    this.promptOptionB.setAlpha(0)
    this.promptType = null
    this.scene.restart()
  }

  showPrompt = (type) => {
    this.promptBg.setAlpha(1)
    this.promptTitle.setAlpha(1)
    this.promptTitle.setText(PROMPT_TEXT[type])
    this.promptOptionA.setAlpha(1)
    this.promptOptionA.setFrame(`${PROMPT_ICON_A[type]}.png`)
    this.promptOptionB.setAlpha(1)
    this.promptOptionB.setFrame(`${PROMPT_ICON_B[type]}.png`)
    this.promptType = type
  }
}

const PROMPT_TEXT = {
  camp: 'Rest or Upgrade?',
  'increase-draw': 'Increase Draw\nor Lose Health',
}

const PROMPT_ICON_A = {
  camp: 'campfire',
  'increase-draw': 'checkmark',
}

const PROMPT_ICON_B = {
  camp: 'card_lift',
  'increase-draw': 'cross',
}
