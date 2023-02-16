import { Math as PMath } from 'phaser'

import snakeyAnims from '../anims/SnakeyAnims'
import Projectile from '../attacks/Projectile'
import Projectiles from '../attacks/ProjectilesGroup'
import BaseScene from '../BaseScene'
import { isPlayingAnim } from '../utils'

import Enemy from './Enemy'

export default class Snakey extends Enemy {
  attackDelay: number
  projectiles: Projectiles
  timeFromLastAttack: number
  constructor(scene: BaseScene, x: number, y: number) {
    super(scene, x, y, 'snakey')

    this.attackDelay = this.getAttackDelay()
    this.projectiles = new Projectiles(scene as BaseScene, 'fireball-1')
    this.timeFromLastAttack = 0

    this.createAnimations()
  }
  createAnimations() {
    snakeyAnims(this.anims)
  }
  getAttackDelay() {
    return PMath.Between(1000, 4000)
  }
  handleTakeHit(source: Projectile) {
    super.handleTakeHit(source)
    this.play('snakey-hit')
  }
  init() {
    super.init()
    this.speed = 50
    this.maxPatrolDistance = 100
    this.setSize(12, 45)
    this.setOffset(10, 15)
  }
  // Note: not to be confused with Phaser's scene lifecycle `update`.
  // But this is a listener bound to the scene's update via Enemy superclass, so it behaves identically.
  update(time: number, delta: number) {
    super.update(time, delta)
    if (this.timeFromLastAttack + this.attackDelay <= time) {
      this.projectiles.fireProjectile(this, 'fireball')
      this.timeFromLastAttack = time
      this.attackDelay = this.getAttackDelay()
    }
    if (!this.active) {
      this.destroy()
      return
    }
    if (isPlayingAnim(this.anims, 'snakey-hit')) return
    this.play('snakey-idle', true)
  }
}
