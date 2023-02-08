import { GameObjects } from 'phaser'

import BaseScene from './BaseScene'

export default class MenuScene extends BaseScene {
  menu: { scene: string | null; label: string }[]
  constructor() {
    super('MenuScene')
    this.menu = [
      { scene: 'GameScene', label: 'Play' },
      { scene: 'ScoreScene', label: 'Score' },
      { scene: null, label: 'Exit' },
    ]
  }
  create() {
    super.create()
    this.createMenu()
  }

  createMenu() {
    this.menu.forEach(({ label, scene }, index) => {
      const menuObject = this.add
        .text(this.sceneCenter[0], this.sceneCenter[1] + index * 48, label, {
          fontSize: '36px',
        })
        .setOrigin(0.5, 1)
      this.createMenuEvent(menuObject, scene)
    })
  }
  createMenuEvent(menuObject: GameObjects.Text, scene: string | null) {
    menuObject.setInteractive()
    menuObject.on('pointerover', () => menuObject.setStyle({ fill: '#ff0' }))
    menuObject.on('pointerout', () => menuObject.setStyle({ fill: '#fff' }))
    menuObject.on('pointerup', () => this.handlePlayScene(scene))
  }
  handlePlayScene(scene: string | null) {
    scene ? this.scene.start(scene) : this.game.destroy(true)
  }
}
