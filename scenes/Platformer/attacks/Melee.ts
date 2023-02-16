import { Physics } from 'phaser'

import BaseScene from '../BaseScene'
import EffectManager from '../entities/EffectManager'
import Enemy from '../entities/Enemy'
import Player from '../entities/Player'
import { getTimeStamp } from '../utils'

export default class Melee extends Physics.Arcade.Sprite {
  cooldown: number
  damage: number
  initiator!: Player
  manager: EffectManager
  timeFromLastAttack: number
  weaponAnim: string
  weaponName: string
  constructor(scene: BaseScene, x: number, y: number, key: string) {
    super(scene, x, y, key)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.cooldown = 1000
    this.damage = 20
    this.manager = new EffectManager(scene)
    this.timeFromLastAttack = getTimeStamp() - this.cooldown
    this.weaponName = key
    this.weaponAnim = `${key}-swing`

    this.handleActivateWeapon(false)
    this.setDepth(5)
    this.setOrigin(0.5, 1)

    this.on(
      'animationcomplete',
      ({ key }: Phaser.Animations.Animation) => {
        if (key === this.weaponAnim) {
          this.handleActivateWeapon(false)
          this.body.reset(0, 0)
          this.body.checkCollision.none = false
        }
      },
      this
    )
  }
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)
    if (!this.active) return

    if (this.initiator.lastDirection === Physics.Arcade.FACING_RIGHT) {
      this.setFlipX(false)
      this.body.reset(this.initiator.x + 30, this.initiator.y - 5)
    } else {
      this.setFlipX(true)
      this.body.reset(this.initiator.x - 30, this.initiator.y - 5)
    }
  }
  canAttack() {
    return !(
      this.timeFromLastAttack &&
      this.timeFromLastAttack + this.cooldown > getTimeStamp()
    )
  }
  handleActivateWeapon(activate: boolean) {
    this.setActive(activate)
    this.setVisible(activate)
  }
  handleAttack(initiator: Player) {
    this.initiator = initiator
    this.anims.play(this.weaponAnim, true)
    this.handleActivateWeapon(true)
    this.timeFromLastAttack = getTimeStamp()
    this.scene.sound
      .add('swipe', {
        volume: 0.25,
      })
      .play()
  }
  handleHit(enemy: Enemy) {
    const impactPos = { x: this.x, y: this.getRightCenter().y }
    this.manager.playEffectOn(
      'hit',
      enemy.body as Physics.Arcade.Body,
      impactPos
    )
    this.scene.sound
      .add('impact', {
        volume: 0.25,
      })
      .play()

    this.body.checkCollision.none = true
  }
}
