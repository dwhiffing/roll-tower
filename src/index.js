import Phaser from 'phaser'
import * as scenes from './scenes'

var config = {
  parent: 'phaser',
  type: Phaser.AUTO,
  width: 270,
  height: 480,
  backgroundColor: '#5599ad',
  scene: Object.values(scenes),
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

window.game = new Phaser.Game(config)
