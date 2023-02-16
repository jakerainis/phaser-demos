import { GameObjects } from 'phaser'

import BaseScene from '../BaseScene'

class Hud extends Phaser.GameObjects.Container {
  constructor(scene: BaseScene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)

    const { boundRight, boundTop } = (this.scene as BaseScene).config.settings
    this.setPosition(boundRight - 120, boundTop + 16)
    this.setScrollFactor(0)
    this.setupList()
  }
  createScoreBoard() {
    const scoreText = this.scene.add.text(0, 0, `Score: ${0}`)
    const scoreImage = this.scene.add
      .image(scoreText.width + 10, 0, 'diamond')
      .setOrigin(0)

    const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage])
    scoreBoard.setName('scoreBoard')
    return scoreBoard
  }
  handleUpdateScoreBoard(score: number) {
    const scoreBoard = this.getByName('scoreBoard')
    const items = (scoreBoard as unknown as GameObjects.Container).list
    const scoreText = items[0] as GameObjects.Text
    const scoreImage = items[1] as GameObjects.Image
    scoreText.setText(`Score: ${score}`)
    scoreImage.setPosition(scoreText.width + 10, 0)
  }
  setupList() {
    const scoreBoard = this.createScoreBoard()
    this.add([scoreBoard])

    // If needed...
    // let lineHeight = 0
    // this.list.forEach((item) => {
    //   const obj = item as GameObjects.Text
    //   obj.setPosition(obj.x, obj.y + lineHeight)
    //   lineHeight += 20
    // })
  }
}

export default Hud
