import { GameObjects } from 'phaser'

import BaseScene from './BaseScene'

export default class PauseScene extends BaseScene {
  menu: { scene: string | null; label: string }[]
  constructor() {
    super('PauseScene')
    this.menu = [
      { scene: 'GameScene', label: 'Resume' },
      { scene: 'MenuScene', label: 'Enough Already' },
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
    if (!scene) this.game.destroy(true)
    if (scene === 'GameScene') {
      this.scene.stop()
      this.scene.resume(scene)
    } else {
      this.scene.stop('GameScene')
      this.scene.start('MenuScene')
    }
  }
}
