import Actor from './Actor'

export default class Enemy extends Actor {
  constructor(scene, x, y, type = 'bat') {
    super(scene, type, x, y)
    this.type = 'enemy'

    const getFrames = (frames) =>
      scene.anims.generateFrameNumbers(type, { frames })
    scene.anims.create({
      key: `${type}-idle`,
      frameRate: 8,
      repeat: -1,
      frames: getFrames(IDLE_FRAMES[type]),
    })
    scene.anims.create({
      key: `${type}-die`,
      frameRate: 8,
      frames: getFrames(DIE_FRAMES[type]),
    })
    scene.anims.create({
      key: `${type}-attack`,
      frameRate: 12,
      frames: getFrames(ATTACK_FRAMES[type]),
    })
    this.sprite.flipX = true
    if (type === 'bat') {
      this.sprite.y += 10
    }
    if (type === 'nomad') {
      this.sprite.y += 10
    }
    this.sprite.play(`${type}-idle`)
  }
}

const IDLE_FRAMES = {
  bat: [0, 1, 2, 3, 4],
  nomad: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
}

const DIE_FRAMES = {
  bat: [0, 1, 2, 3, 4],
  nomad: [60, 61, 62, 63, 64, 65, 66, 67, 68],
}

const ATTACK_FRAMES = {
  bat: [0, 1, 2, 3, 4],
  nomad: [26, 27, 28, 29, 30, 31, 32],
}
