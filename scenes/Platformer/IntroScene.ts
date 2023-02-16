import BaseScene from './BaseScene'

export default class IntroScene extends BaseScene {
  constructor() {
    super('IntroScene')
  }
  create() {
    super.create()

    const text = this.add
      .text(
        this.sceneCenter[0],
        this.sceneCenter[1],
        'DEPT® Arcade Presents:',
        {
          fontSize: '36px',
        }
      )
      .setOrigin(0.5, 1)

    this.time.delayedCall(2000, () => {
      text.setText(`Jake's Game`)
      this.time.delayedCall(3000, () => {
        this.scene.start('MenuScene')
      })
    })
  }
}
