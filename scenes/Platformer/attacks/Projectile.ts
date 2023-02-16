import { Physics } from 'phaser'

import BaseScene from '../BaseScene'
import EffectManager from '../entities/EffectManager'

export default class Projectile extends Physics.Arcade.Sprite {
  cooldown: number
  damage: number
  manager: EffectManager
  maxDistance: number
  speed: number
  traveledDistance: number
  constructor(scene: BaseScene, x: number, y: number, key: string) {
    super(scene, x, y, key)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.cooldown = 500
    this.damage = 10
    this.maxDistance = 300
    this.manager = new EffectManager(scene)
    this.traveledDistance = 0
    this.speed = 600
  }
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)
    this.traveledDistance += this.body.deltaAbsX()
    if (this.traveledDistance >= this.maxDistance) {
      this.body.reset(0, 0)
      this.handleActivateProjectile(false)
      this.traveledDistance = 0
    }
  }
  handleActivateProjectile(activate: boolean) {
    this.setActive(activate)
    this.setVisible(activate)
  }
  handleFire(x: number, y: number, animKey: string) {
    this.body.reset(x, y)
    this.body.setSize(this.width - 10, this.height - 20)
    this.setScale(0.75)
    this.setVelocityX(this.speed)
    this.handleActivateProjectile(true)
    this.play(animKey)
    this.scene.sound
      .add('shot', {
        volume: 0.25,
      })
      .play()
  }
  handleHit(source: Physics.Arcade.Sprite) {
    this.handleActivateProjectile(false)
    this.traveledDistance = 0
    const impactPos = { x: this.x, y: this.y }
    this.body.reset(0, 0)
    this.manager.playEffectOn(
      'hit',
      source.body as Physics.Arcade.Body,
      impactPos
    )
    this.scene.sound
      .add('impact', {
        volume: 0.25,
      })
      .play()
  }
}
