import { Physics, Scenes, Tilemaps, Types } from 'phaser'

import playerAnims from '../anims/PlayerAnims'
import Melee from '../attacks/Melee'
import Projectile from '../attacks/Projectile'
import Projectiles from '../attacks/ProjectilesGroup'
import BaseScene from '../BaseScene'
import HealthBar from '../hud/HealthBar'
import { isPlayingAnim } from '../utils'

import Enemy from './Enemy'
import Emitter from './EventEmitter'

export default class Player extends Physics.Arcade.Sprite {
  cursors!: Types.Input.Keyboard.CursorKeys
  hasBeenHit: boolean
  healthBar!: HealthBar
  health: number
  isSliding: boolean
  jumpCount: number
  lastDirection: number
  melee: Melee
  projectiles: Projectiles

  constructor(scene: BaseScene, x: number, y: number) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.hasBeenHit = false
    this.health = 100
    this.isSliding = false
    this.jumpCount = 0
    this.lastDirection = Physics.Arcade.FACING_RIGHT
    this.melee = new Melee(this.scene as BaseScene, 0, 0, 'sword-default')
    this.projectiles = new Projectiles(this.scene as BaseScene, 'iceball-1')
    this.init()
    this.createEvents()
    this.createAnimations()
    this.createHealthBar()
    this.handleAttacks()
    this.handleMovements()
  }
  createAnimations() {
    playerAnims(this.anims)
  }
  createHealthBar() {
    this.healthBar = new HealthBar(
      this.scene as BaseScene,
      ((this.scene as BaseScene).config.settings.boundLeft as number) + 16,
      ((this.scene as BaseScene).config.settings.boundTop as number) + 16,
      this.health
    )
  }
  createEvents() {
    this.scene.events.on(Scenes.Events.UPDATE, this.update, this)
  }
  init() {
    this.setCollideWorldBounds(true)
    this.setSize(20, 36)
    this.setOrigin(0.5, 1)
    this.setGravityY(600)
    this.setOffset(5, 0)
  }
  handleTakeHit(source: Enemy | Projectile | Tilemaps.Tile) {
    if (this.hasBeenHit) return
    this.hasBeenHit = true

    // @ts-expect-error: Checking against object disparities...
    if (source.handleHit) source.handleHit(source) // Allow source to handle results if necessary
    // @ts-expect-error: Checking against object disparities...
    const damage = source.damage || source.properties.damage || 0 // Handle player reactions
    // @ts-expect-error: Checking against object disparities...
    if (source.body) {
      this.body.touching.right
        ? this.setVelocityX(-200)
        : this.setVelocityX(200)
    } else {
      this.body.blocked.right ? this.setVelocityX(-200) : this.setVelocityX(200)
    }

    // Deduct health and check if dead
    this.health -= damage
    this.healthBar.decrease(damage)
    if (this.health <= 0) {
      Emitter.emit('PLAYER_LOSE')
      return
    }

    // Add to the end of the callstack, since source blocks y axis
    this.scene.time.delayedCall(0, () => this.setVelocityY(-200))
    // Play animation and resume controls
    const hitTween = this.scene.tweens.add({
      targets: this,
      duration: 50,
      repeat: -1,
      tint: 0xffffff,
    })

    // Not dead, clear tint
    this.scene.time.delayedCall(500, () => {
      this.hasBeenHit = false
      hitTween.stop()
      this.clearTint()
    })
  }
  listenPlayerMovement() {
    if (this.hasBeenHit || this.isSliding) {
      return
    }
    const { left, right, up } = this.cursors
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up)
    const onFloor = this.body.blocked.down

    if (left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT
      this.setVelocityX(-300)
      this.setFlipX(true)
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT
      this.setVelocityX(300)
      this.setFlipX(false)
    } else {
      this.setVelocityX(0)
    }
    if (isUpJustDown && (onFloor || this.jumpCount < 2)) {
      this.setVelocityY(-400)
      this.jumpCount++
    }
    if (onFloor) {
      this.jumpCount = 0
    }

    if (
      isPlayingAnim(this.anims, 'throw') ||
      isPlayingAnim(this.anims, 'slide')
    ) {
      return
    }
    onFloor
      ? this.body.velocity.x !== 0
        ? this.play('move', true)
        : this.play('idle', true)
      : this.play('jump', true)
  }
  handleAttacks() {
    // Fire
    this.scene.input.keyboard.on('keydown-SHIFT', () => {
      this.play('throw', true)
      this.projectiles.fireProjectile(this, 'iceball')
    })
    // Melee
    this.scene.input.keyboard.on('keydown-SPACE', () => {
      if (this.melee.canAttack()) {
        this.play('throw', true)
        this.melee.handleAttack(this)
      }
    })
  }

  handleMovements() {
    this.scene.input.keyboard.on('keydown-DOWN', () => {
      if (!this.body.blocked.down) return
      this.body.setSize(this.width, this.height / 2)
      this.setOffset(0, this.height / 2)
      this.setVelocityX(0)
      this.play('slide', true)
      this.isSliding = true
    })
    this.scene.input.keyboard.on('keyup-DOWN', () => {
      this.body.setSize(this.width, 38)
      this.setOffset(0, 0)
      this.isSliding = false
    })
  }
  // Note: not to be confused with Phaser's scene lifecycle `update`.
  // But this is a listener bound to the scene's update, so it behaves identically.
  update(_time: number, _delta: number) {
    if (!this.body) return
    if (this.getBounds().top > (this.scene as BaseScene).sceneH) {
      Emitter.emit('PLAYER_LOSE')
      return
    }
    this.listenPlayerMovement()
  }
}
