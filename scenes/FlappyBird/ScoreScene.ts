import BaseScene from './BaseScene'

import store from '@/stores/flappyBird'

export default class ScoreScene extends BaseScene {
  constructor() {
    super('ScoreScene')
  }
  create() {
    super.create()
    this.createBack()
    this.createScore()
  }

  createBack() {
    const backText = this.add.text(16, 16, `Back`, { fontSize: '18px' })
    backText.setInteractive()
    backText.on('pointerover', () => backText.setStyle({ fill: '#ff0' }))
    backText.on('pointerout', () => backText.setStyle({ fill: '#fff' }))
    backText.on('pointerup', () => {
      this.scene.start('MenuScene')
    })
  }
  createScore() {
    this.highScore = store.getState().highScore

    this.scoreText = this.add
      .text(
        this.sceneCenter[0],
        this.sceneCenter[1],
        `High Score: ${store.getState().highScore}`,
        {
          fontSize: '32px',
        }
      )
      .setOrigin(0.5)
  }
}
