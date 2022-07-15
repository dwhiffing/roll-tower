export default class HudService {
  constructor(scene) {
    this.scene = scene
    this.width = scene.width
    this.height = scene.height
    this.bg = this.scene.add.graphics()
    this.bg.fillStyle(0x222222, 1)
    this.bg.fillRect(
      0,
      this.scene.cameras.main.height - 300,
      this.scene.cameras.main.width,
      300,
    )
  }

  update() {}
}
