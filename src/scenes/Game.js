export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.scene.launch('Hud')
  }

  won() {
    this.scene.stop('Hud')
    this.scene.start('Win')
  }

  update() {}
}
