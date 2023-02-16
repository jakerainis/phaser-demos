import { Physics, Scenes, Tilemaps } from 'phaser'

import Melee from '../attacks/Melee'
import Projectile from '../attacks/Projectile'
import Projectiles from '../attacks/ProjectilesGroup'
import BaseScene from '../BaseScene'

import Raycaster from './Raycaster'

export default class Enemy extends Physics.Arcade.Sprite {
  currentPatrolDistance: number
  damage: number
  health: number
  lastDirection: number
  maxPatrolDistance: number
  platformColliders!: Tilemaps.TilemapLayer
  projectiles: Projectiles | null
  raycaster: Raycaster
  speed: number
  timeSinceLastTurn: number

  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    key: 'birdman' | 'snakey',
    speed = 100,
    maxPatrolDistance = 500
  ) {
    super(scene, x, y, key)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.currentPatrolDistance = 0
    this.damage = 10
    this.health = 40
    this.lastDirection = Physics.Arcade.FACING_RIGHT
    this.maxPatrolDistance = maxPatrolDistance
    this.projectiles = null
    this.raycaster = new Raycaster(scene, scene.isDebug)

    this.speed = speed
    this.timeSinceLastTurn = 0

    this.init()
    this.createEvents()
  }

  createEvents() {
    this.scene.events.on(Scenes.Events.UPDATE, this.update, this)
  }
  handleRemove() {
    this.scene.events.removeListener(Scenes.Events.UPDATE, this.update, this)
    this.raycaster.destroy()
    this.setActive(false)
    this.setVisible(false)
    this.destroy()
  }
  handleHit(_source: Physics.Arcade.Sprite) {
    // Don't need to do anything here yet?
  }
  handlePatrol(time: number) {
    if (!this.body?.blocked.down) return

    // Update raycast
    const currentRaycast = this.raycaster.createRaycasts(
      this.platformColliders,
      this.body as Physics.Arcade.Body,
      {}
    )
    this.raycaster.updateRayGraphics()

    // Reverse if collisions or exceed of patrol distance
    this.currentPatrolDistance += Math.abs(this.body.deltaX())
    if (
      (!currentRaycast.hasHits ||
        this.currentPatrolDistance >= this.maxPatrolDistance) &&
      this.timeSinceLastTurn + 100 < time
    ) {
      this.currentPatrolDistance = 0
      this.timeSinceLastTurn = time
      this.setVelocityX((this.speed = -this.speed))
      this.setFlipX(!this.flipX)
      this.lastDirection = this.flipX
        ? Physics.Arcade.FACING_LEFT
        : Physics.Arcade.FACING_RIGHT
    }
  }
  handleTakeHit(source: Projectile | Melee) {
    this.health -= source.damage
    source.handleHit(this)
    if (this.health <= 0) {
      this.body.checkCollision.none = true
      this.setCollideWorldBounds(false)
      this.setTint(0xff0000)
      this.setVelocity(source.flipX ? -100 : 100, -200)
    }
  }
  init() {
    this.setCollideWorldBounds(true)
    this.setOrigin(0.5, 1)
    this.setGravityY(600)
    this.setImmovable(true)
    this.setVelocityX(100)
    // this.setSize(this.width - 15, this.height - 20)
    // this.setOffset(5, 20)
  }
  setPlatformColliders(platformColliders: Tilemaps.TilemapLayer) {
    this.platformColliders = platformColliders
  }
  // Note: not to be confused with Phaser's scene lifecycle `update`.
  // But this is a listener bound to the scene's update, so it behaves identically.
  update(time: number, _delta: number) {
    if (!this.body) return
    this.handlePatrol(time)
    if (this.getBounds().bottom > (this.scene as BaseScene).sceneH) {
      this.handleRemove()
    }
  }
}
