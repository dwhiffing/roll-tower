import HudService from '../services/HudService'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Hud' })
  }

  init({ restart }) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.restart = restart
  }

  create() {
    this.hudService = new HudService(this, this.restart)
  }

  update() {}
}
