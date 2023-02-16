import birdmanAnims from '../anims/BirdmanAnims'
import Projectile from '../attacks/Projectile'
import BaseScene from '../BaseScene'
import { isPlayingAnim } from '../utils'

import Enemy from './Enemy'

export default class Birdman extends Enemy {
  constructor(scene: BaseScene, x: number, y: number) {
    super(scene, x, y, 'birdman')

    this.createAnimations()

    // this.setSize(this.width - 30, this.height - 20)
    // this.setOffset(this.body.offset.x, 20)
  }
  createAnimations() {
    birdmanAnims(this.anims)
  }
  handleTakeHit(source: Projectile) {
    super.handleTakeHit(source)
    this.play('birdman-hit')
  }
  init() {
    super.init()
    this.setSize(20, 45)
    this.setOffset(7, 20)
  }

  // Note: not to be confused with Phaser's scene lifecycle `update`.
  // But this is a listener bound to the scene's update via Enemy superclass, so it behaves identically.
  update(time: number, delta: number) {
    super.update(time, delta)
    if (!this.body) return
    if (!this.active) {
      this.destroy()
      return
    }
    if (isPlayingAnim(this.anims, 'birdman-hit')) return
    this.play('birdman-idle', true)
  }
}
