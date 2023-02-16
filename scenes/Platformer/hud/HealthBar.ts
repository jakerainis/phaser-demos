import { GameObjects } from 'phaser'

import BaseScene from '../BaseScene'

export default class HealthBar {
  bar: GameObjects.Graphics
  health: number
  scene: BaseScene
  size: { height: number; width: number }
  x: number
  y: number
  constructor(scene: BaseScene, x: number, y: number, health: number) {
    this.scene = scene
    this.bar = new GameObjects.Graphics(scene)
    this.size = { height: 12, width: 50 }
    this.health = health
    this.x = x
    this.y = y

    this.draw()
    scene.add.existing(this.bar)
  }
  draw() {
    const healthWidth = (this.size.width / 100) * this.health
    const margin = 2

    // Outer "stroke"
    this.bar.clear()
    this.bar.fillStyle(0xffffff)
    this.bar.fillRect(
      this.x,
      this.y,
      this.size.width + margin,
      this.size.height + margin
    )
    // Inner "fill"
    this.bar.fillStyle(0x000)
    this.bar.fillRect(
      this.x + margin,
      this.y + margin,
      this.size.width - margin,
      this.size.height - margin
    )
    // Actual value
    if (healthWidth > 0) {
      if (this.health < 25) {
        this.bar.fillStyle(0xff0000)
      } else if (this.health < 50) {
        this.bar.fillStyle(0xffa500)
      } else {
        this.bar.fillStyle(0x00ff00)
      }
      this.bar.fillRect(
        this.x + margin,
        this.y + margin,
        healthWidth - margin,
        this.size.height - margin
      )
    }
    this.bar.setScrollFactor(0, 0)
    return this.bar
  }
  decrease(amount: number) {
    const newHealth = this.health - amount
    this.health = newHealth >= 0 ? newHealth : 0
    return this.draw()
  }
}
