import { GameObjects } from 'phaser'

import BaseScene from './BaseScene'

export default class LevelsScene extends BaseScene {
  menu!: { scene: string | null; label: string }[]
  constructor() {
    super('LevelsScene')
  }
  create() {
    super.create()

    const unlockedLevels = this.registry.get('unlocked-levels') || 1
    this.menu = []
    for (let index = 1; index <= unlockedLevels; index++) {
      this.menu.push({ scene: 'GameScene', label: `Level ${index}` })
    }

    this.createBackground()
    this.createBackButton()
    this.createMenu()
  }
  createBackButton() {
    const backText = this.add.text(16, 16, `Back`, { fontSize: '18px' })
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
  createMenu() {
    this.menu.forEach(({ label, scene }, index) => {
      const menuObject = this.add
        .text(
          this.sceneCenter[0],
          this.sceneCenter[1] + index * 48 - 48,
          label,
          {
            fontSize: '36px',
          }
        )
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
