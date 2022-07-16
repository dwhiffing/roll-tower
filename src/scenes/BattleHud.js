import Die from '../sprites/Die'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleHud' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.createBackground()
    this.createDrawCounter()
    this.createDiscardCounter()
    this.createEndTurnButton()

    this.activePileSprites = []
    this.registry.events.on('setdata', this.changeData)
    this.registry.events.on('changedata', this.changeData)
    this.scene.get('Battle').events.on('battle-ended', this.cleanup)

    this.events.off('click-die')
    this.events.on('click-die', this.onClickDie)
    this.battle = this.scene.get('Battle')
  }

  update() {}

  onClickDie = (die) => {
    if (this.battle.turnIndex !== 0 || this.battle.disableInput) return
    this.battle.selectedDie?.deselect()
    this.battle.selectedDie = die
    die.select()
  }

  createBackground = () => {
    const y = this.height / 2
    this.bg = this.add
      .graphics()
      .fillStyle(0x222222, 1)
      .fillRect(0, y, this.width, y)
  }

  createDrawCounter = () => {
    const { drawPile } = this.registry.values
    const w = this.width
    const y = this.height / 2 - 20
    this.drawText = this.add
      .bitmapText(w - 50, y, 'pixel-dan', `${drawPile.length}`)
      .setScale(2)
    this.add.sprite(w - 15, y, 'sheet', 'card_lift.png').setScale(0.4)
  }

  createDiscardCounter = () => {
    const { discardPile } = this.registry.values
    const y = this.height / 2 - 20
    this.discardText = this.add
      .bitmapText(10, y, 'pixel-dan', `${discardPile.length}`)
      .setScale(2)
    this.add.sprite(40, y, 'sheet', 'card_place.png').setScale(0.4)
  }

  createEndTurnButton = () => {
    const w = this.width
    const h = this.height
    this.endTurnButton = this.add
      .sprite(w - 15, h - 20, 'sheet', 'flip_head.png')
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => this.events.emit('end-turn'))
  }

  changeData = (parent, key, data) => {
    if (key === 'discardPile') {
      this.discardText.setText(`${data.length}`)
    } else if (key === 'drawPile') {
      this.drawText.setText(`${data.length}`)
    } else if (key === 'activePile') {
      this.updateActivePile()
    }
  }

  updateActivePile = () => {
    // TODO: should just create these sprites once and reuse/hide them throughout the battle
    this.activePileSprites.forEach((s) => s.sprite.destroy())
    this.activePileSprites = []
    const y = this.height / 2 + 20
    this.registry.values.activePile.forEach((die, i) => {
      const x = i * 50 + 20
      this.activePileSprites.push(new Die(this, x, y, die))
    })
  }

  cleanup = () => {
    this.battle.events.off('battle-ended', this.cleanup)
    this.events.off('setdata', this.changeData)
    this.registry.events.off('setdata', this.changeData)
    this.registry.events.off('changedata', this.changeData)
    this.scene.stop('BattleHud')
  }
}