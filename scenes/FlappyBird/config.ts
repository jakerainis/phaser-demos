import Phaser from 'phaser'

const config = {
  height: 600,
  width: 800,
  backgroundColor: '#000000',
  parent: 'game-content',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-content',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  type: Phaser.AUTO,
}

export const difficulties = {
  easy: {
    horzDistance: Phaser.Math.Between(300, 600),
    vertDistance: Phaser.Math.Between(150, 250),
    pipeVelocity: -200,
  },
  medium: {
    horzDistance: Phaser.Math.Between(300, 500),
    vertDistance: Phaser.Math.Between(125, 175),
    pipeVelocity: -225,
  },
  hard: {
    horzDistance: Phaser.Math.Between(200, 300),
    vertDistance: Phaser.Math.Between(125, 200),
    pipeVelocity: -250,
  },
  oof: {
    horzDistance: Phaser.Math.Between(150, 250),
    vertDistance: Phaser.Math.Between(75, 125),
    pipeVelocity: -275,
  },
}

export default config
