import Actor from './Actor'

export default class Enemy extends Actor {
  constructor(scene, x, y) {
    super(scene, 'bat', x, y)

    const getFrames = (frames) =>
      scene.anims.generateFrameNumbers('bat', { frames })
    scene.anims.create({
      key: 'bat-idle',
      frameRate: 8,
      repeat: -1,
      frames: getFrames([0, 1, 2, 3, 4]),
    })
    scene.anims.create({
      key: 'bat-die',
      frameRate: 8,
      frames: getFrames([5, 6, 7, 8, 9]),
    })

    this.sprite.y += 10
    this.sprite.flipX = true
    this.sprite.play('bat-idle')
  }
}
