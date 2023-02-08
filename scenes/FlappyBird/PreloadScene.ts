import BaseScene from './BaseScene'

export default class PreloadScene extends BaseScene {
  constructor() {
    super('PreloadScene')
  }
  preload() {
    this.load.image('sky', 'assets/sky.png')
    this.load.image('pipe', 'assets/pipe.png')
    this.load.image('pause', 'assets/pause.png')
    this.load.spritesheet('bird', 'assets/birdSprite.png', {
      frameHeight: 16,
      frameWidth: 16,
    })
  }
  create() {
    super.create()
    this.scene.start('MenuScene')
  }
  update() {
    //
  }
}
