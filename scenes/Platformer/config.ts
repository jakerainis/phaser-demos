import Phaser from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
  height: 640,
  width: 1200,
  backgroundColor: '#000000',
  parent: 'game-content',
  // pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  // scale: {
  //   // autoCenter: Phaser.Scale.CENTER_BOTH,

  //   mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
  //   parent: 'game-content',
  // },

  type: Phaser.AUTO,
}

export default config
