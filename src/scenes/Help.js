export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Help' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.add.text(
      10,
      30,
      `You have arrived at the base of the
tower of the corrupted King!

You will start at the base and must
forge a path to the top.

Use your trusty dice to attack enemies
and defend yourself.  After each fight,
you can add a new die to your arsenal.

You will get opportunities to improve
your power as you ascend.

Make it to the 15th floor and destroy
the King's protector!

An x on the corner of a die means it's
twice as effective.

Double click a die to use it quickly!

Good luck!`,
      {
        fontSize: 12,
      },
    )
    this.add
      .image(this.width / 2, this.height - 80, 'sheet', 'button.png')
      .setInteractive()
      .on('pointerdown', this.startGame)

    this.add
      .text(this.width / 2, this.height - 80, 'Back', {
        fontSize: 14,
        align: 'center',
      })
      .setOrigin(0.5)
  }

  startGame = () => {
    this.scene.start('Menu')
  }
}
