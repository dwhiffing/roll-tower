import Actor from './Actor'

export default class Player extends Actor {
  constructor(scene, x, y) {
    super(scene, 'player', x, y)

    const getFrames = (frames) =>
      scene.anims.generateFrameNumbers('player', { frames })
    scene.anims.create({
      key: 'player-idle',
      frameRate: 8,
      repeat: -1,
      frames: getFrames([0, 1, 2, 3, 4, 5, 6, 7]),
    })
    scene.anims.create({
      key: 'player-attack',
      frameRate: 8,
      frames: getFrames([24, 25, 26, 27, 28, 29, 30, 31, 32]),
    })
    scene.anims.create({
      key: 'player-die',
      frameRate: 8,
      frames: getFrames([64, 65, 66, 67, 68, 69, 70, 71]),
    })
    scene.anims.create({
      key: 'player-armor',
      frameRate: 8,
      frames: getFrames([48, 49, 50, 51, 52]),
    })
    // scene.anims.create({
    //   key: 'player-wave',
    //   frameRate: 8,
    //   frames: getFrames([8, 9, 10, 11, 12, 13, 14, 15]),
    // })
    // scene.anims.create({
    //   key: 'player-walk',
    //   frameRate: 8,
    //   repeat: -1,
    //   frames: getFrames([16, 17, 18, 19, 20, 21, 22]),
    // })
    // scene.anims.create({
    //   key: 'player-attack2',
    //   frameRate: 8,
    //   frames: getFrames([33, 34, 35, 36, 37, 38, 39, 40, 41, 42]),
    // })

    this.sprite.play('player-idle')

    this.sprite.on('animationcomplete', (e) => {
      if (e.key.match(/die/)) {
        this.scene.lose()
      }
    })
  }
}
