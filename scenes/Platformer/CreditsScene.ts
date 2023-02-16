import BaseScene from './BaseScene'

export default class CreditsScene extends BaseScene {
  constructor() {
    super('CreditsScene')
  }
  create() {
    super.create()
    this.createBackground()
    this.createBackButton()
    this.createText()
  }

  createBackButton() {
    const backText = this.add.text(16, 16, `Menu`, { fontSize: '18px' })
    backText.setInteractive()
    backText.on('pointerover', () => backText.setStyle({ fill: '#ff0' }))
    backText.on('pointerout', () => backText.setStyle({ fill: '#fff' }))
    backText.on('pointerup', () => {
      this.scene.start('MenuScene')
    })
  }
  createBackground() {
    this.add
      .tileSprite(0, 0, this.sceneW, 180, 'sky-play')
      .setOrigin(0, 0)
      .setDepth(-11)
      .setScale(4)
      .setScrollFactor(0, 1)
  }
  createText() {
    this.add
      .text(this.sceneCenter[0], this.sceneCenter[1], 'Thanks for playing!', {
        fontSize: '36px',
      })
      .setOrigin(0.5, 1)
  }
}
