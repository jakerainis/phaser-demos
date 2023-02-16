import { Math as PMath, Physics } from 'phaser'

import BaseScene from '../BaseScene'

export default class Collectible extends Physics.Arcade.Sprite {
  scene: BaseScene
  score: number

  constructor(scene: BaseScene, x: number, y: number, key: string) {
    super(scene, x, y, key)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.scene = scene
    this.score = 1

    this.init()
  }
  init() {
    this.setDepth(-10)
    this.setOrigin(0, 1)
    this.scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: PMath.Between(1500, 2500),
      repeat: -1,
      easy: 'linear',
      yoyo: true,
    })
  }
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)
    // this.handlePlaceEffect()
  }
  setCollectibleTint() {
    if (this.score > 1) this.setTint(0xfff000)
    if (this.score > 5) this.setTint(0xc2c2c2)
    if (this.score >= 10) this.setTint(0xff00ff)
  }
}
