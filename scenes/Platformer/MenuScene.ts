import { GameObjects } from 'phaser'

import BaseScene from './BaseScene'

export default class MenuScene extends BaseScene {
  menu: { scene: string | null; label: string }[]
  constructor() {
    super('MenuScene')
    this.menu = [
      { scene: 'GameScene', label: 'Play' },
      { scene: 'LevelsScene', label: 'Levels' },
      { scene: 'CreditsScene', label: 'Credits' },
      { scene: null, label: 'Exit' },
    ]
  }
  create() {
    super.create()
    this.createBackground()
    this.createMenu()

    if (this.sound.get('menu-music')) return
    this.sound
      .add('menu-music', {
        loop: true,
        volume: 0.25,
      })
      .play()
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
