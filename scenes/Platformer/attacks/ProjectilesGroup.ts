import { Physics } from 'phaser'

import BaseScene from '../BaseScene'
import Enemy from '../entities/Enemy'
import Player from '../entities/Player'
import { getTimeStamp } from '../utils'

import Projectile from './Projectile'

export default class Projectiles extends Physics.Arcade.Group {
  timeFromLastProjectile: number

  constructor(scene: BaseScene, key: string) {
    super(scene.physics.world, scene)
    this.timeFromLastProjectile = 0
    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: key,
      classType: Projectile,
    })
  }
  fireProjectile(initiator: Enemy | Player, animKey: string) {
    const projectile = this.getFirstDead(false) as Projectile
    if (!projectile) return

    // Check fire rate for cooldown
    if (
      this.timeFromLastProjectile &&
      this.timeFromLastProjectile + projectile.cooldown > getTimeStamp()
    ) {
      return
    }

    // Orient shot
    const center = initiator.getCenter()
    if (initiator.lastDirection === Physics.Arcade.FACING_RIGHT) {
      projectile.speed = Math.abs(projectile.speed)
      projectile.setFlipX(false)
    } else {
      projectile.speed = -Math.abs(projectile.speed)
      projectile.setFlipX(true)
    }

    // Fire & reset cooldown
    projectile.handleFire(center.x, center.y, animKey)
    this.timeFromLastProjectile = getTimeStamp()
  }
}
