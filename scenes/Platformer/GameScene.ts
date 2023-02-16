import { GameObjects, Tilemaps } from 'phaser'

import hitAnims from './anims/HitAnims'
import objectAnims from './anims/ObjectAnims'
import Melee from './attacks/Melee'
import Projectile from './attacks/Projectile'
import Collectible from './entities/Collectible'
import Collectibles from './entities/CollectiblesGroup'
import Enemies from './entities/EnemiesGroup'
import Enemy from './entities/Enemy'
import Emitter from './entities/EventEmitter'
import Player from './entities/Player'
import Hud from './hud/Container'
import BaseScene from './BaseScene'
import { getPropertyValueByName } from './utils'

export default class GameScene extends BaseScene {
  backgroundImage!: GameObjects.TileSprite
  collectibles!: Collectibles
  enemies!: Enemies
  enemyZones!: Tilemaps.ObjectLayer
  environement!: Tilemaps.TilemapLayer
  hud!: Hud
  isPaused: boolean
  map!: Tilemaps.Tilemap
  middlegroundImage!: GameObjects.TileSprite
  platformColliders!: Tilemaps.TilemapLayer
  platforms!: Tilemaps.TilemapLayer
  player!: Player
  playerZones!: Tilemaps.ObjectLayer
  score: 0
  scoreText!: GameObjects.Text
  traps!: Tilemaps.TilemapLayer

  constructor() {
    super('GameScene')
    this.isPaused = false
    this.score = 0
  }
  create() {
    super.create()
    // Order matters...

    // Setup world
    this.map = this.createMap()
    this.createBackground()
    const layers = this.createLayers()
    this.enemyZones = layers.enemyZones
    this.playerZones = layers.playerZones
    this.environement = layers.environement
    this.platformColliders = layers.platformColliders
    this.platforms = layers.platforms
    this.traps = layers.traps
    this.createAnimations()

    // Interactables & Physics
    this.player = this.createPlayer()
    this.enemies = this.createEnemies()
    this.collectibles = this.createCollectibles(layers.collectibles)
    this.createCamera(this.player)
    this.createEnemyColliders()
    this.createPlayerColliders()
    this.createCollectibleColliders()

    // Misc
    this.createGameEvents()
    this.createInstructions()
    this.createLevelEnd()
    this.hud = new Hud(this, 0, 0)
  }
  update(time: number, delta: number) {
    super.update(time, delta)
    this.backgroundImage.tilePositionX = this.cameras.main.scrollX / 2
    this.middlegroundImage.tilePositionX = this.cameras.main.scrollX
  }
  createAnimations() {
    hitAnims(this.anims)
    objectAnims(this.anims)
  }
  createBackground() {
    const bg = this.map.getObjectLayer('distance_bg').objects[0]
    this.backgroundImage = this.add
      .tileSprite(0, 0, this.sceneW, 180, 'sky-play')
      .setOrigin(0, 0)
      .setDepth(-11)
      .setScale(1.1)
      .setScrollFactor(0, 1)
    this.middlegroundImage = this.add
      .tileSprite(
        bg.x as number,
        bg.y as number,
        this.config.width as number,
        bg.height as number,
        'bg-spikes-dark'
      )
      .setOrigin(0, 1)
      .setDepth(-10)
      .setScrollFactor(0, 1)
  }
  createCamera(player: Player) {
    const w = this.sceneW
    const mapWidth = this.config.settings.mapWidth
    // const mapWidth = 1600
    const mapOffset = mapWidth > w ? mapWidth - w : 0
    const boundsConfig = this.sceneW + mapOffset
    this.cameras.main.setBounds(0, 0, boundsConfig, this.sceneH)
    this.cameras.main.startFollow(player)
    this.cameras.main.setZoom(this.config.settings.zoomFactor as number)
    this.physics.world.setBounds(0, 0, boundsConfig, this.sceneH + 100) //Fall out of view
  }
  createCollectibles(objectLayer: Tilemaps.ObjectLayer) {
    const collectibles = new Collectibles(this)
    collectibles.addFromLayer(objectLayer)
    collectibles.playAnimation('diamond-shine')
    return collectibles
  }
  createCollectibleColliders() {
    this.createOverlap(
      this.player,
      this.collectibles as unknown as GameObjects.GameObject,
      // @ts-expect-error: Implicit passing of GameObject
      this.handleCollect
    )
  }
  createEnemies() {
    // Create group
    const enemies = new Enemies(this)
    // Get types and zones
    const enemyTypes = enemies.getTypes()
    const zones = this.getEnemyZones()
    // Create enemy for each spawnpoint
    zones.forEach(({ x, y, properties }) => {
      // Create the right kind of enemy
      const value = getPropertyValueByName(properties, 'type')
      enemies.add(
        new enemyTypes[value as keyof typeof enemyTypes](
          this,
          x as number,
          y as number
        )
      )
    })
    return enemies
  }
  createEnemyColliders() {
    // Add world, player, and attack colliders for each enemy
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as unknown as Enemy
      this.createCollider(enemy, this.platformColliders)
      this.createOverlap(
        enemy,
        this.player.melee as unknown as GameObjects.GameObject,
        // @ts-expect-error: Implicit passing of GameObject
        this.handleAttack
      )
      this.createCollider(
        enemy,
        this.player.projectiles as unknown as GameObjects.GameObject,
        // @ts-expect-error: Implicit passing of GameObject
        this.handleAttack
      )
      this.createCollider(enemy, this.player, () =>
        this.handlePlayerCollision(enemy)
      )
      // Give enemy class context to platformColliders
      enemy.setPlatformColliders(this.platformColliders)
    })
  }
  createGameEvents() {
    Emitter.on('PLAYER_LOSE', () => {
      Emitter.shutdown()
      this.player.setTint(0xff0000)
      if (this.player.body) this.player.body.checkCollision.none = true
      this.time.delayedCall(1000, this.scene.start, [], this.scene)
    })
  }
  createInstructions() {
    const { boundRight, boundBottom } = this.config.settings
    const text = this.add
      .text(
        boundRight - 5,
        boundBottom - 5,
        'Move: [ARROWS]  Attack: [SPACE]  Fire: [SHIFT]',
        {
          fontSize: '12px',
        }
      )
      .setDepth(10)
      .setOrigin(1, 1)
      .setScrollFactor(0, 0)

    this.time.delayedCall(3000, () => text.destroy())
  }
  createLayers() {
    const tileset = this.map.addTilesetImage('main_lev_build_1', 'tiles-1')
    const tilesetBg = this.map.getTileset('bg_spikes_tileset')
    this.map.createLayer('distance', tilesetBg).setDepth(-12)

    // Trees, etc.
    const environement = this.map
      .createLayer('environment', tileset)
      .setDepth(-2)
    // Ghost platforms
    const platformColliders = this.map.createLayer(
      'platforms_colliders',
      tileset
    )
    platformColliders.setCollisionByProperty({ collides: true })
    // Aesthetic platforms
    const platforms = this.map.createLayer('platforms', tileset)
    // Character zones
    const enemyZones = this.map.getObjectLayer('enemy_zones')
    const playerZones = this.map.getObjectLayer('player_zones')
    // Collectibles
    const collectibles = this.map.getObjectLayer('collectibles')
    // Traps
    const traps = this.map.createLayer('traps', tileset)
    traps.setCollisionByExclusion([-1])

    return {
      collectibles,
      enemyZones,
      environement,
      platformColliders,
      platforms,
      playerZones,
      traps,
    }
  }
  createLevelEnd() {
    const { end } = this.getPlayerZones()
    const levelEnd = this.physics.add
      .sprite(end.x as number, end.y as number, 'end')
      .setAlpha(0)
      .setOrigin(0.5, 1)
      .setSize(5, 400)
      .setImmovable(true)

    const eolOverlap = this.physics.add.overlap(this.player, levelEnd, () => {
      eolOverlap.active = false
      if (this.registry.get('level') === 2) {
        return this.scene.start('CreditsScene')
      }
      this.registry.inc('level', 1)
      this.registry.inc('unlocked-levels', 1)
      this.scene.restart()
    })
  }
  createMap() {
    this.map = this.make.tilemap({
      key: `level-${this.registry.get('level') || 1}`,
    })
    this.map.addTilesetImage('bg_spikes_tileset', 'bg-spikes-tileset')
    return this.map
  }
  createPlayer() {
    const { start } = this.getPlayerZones()
    this.player = new Player(this, start.x as number, start.y as number)
    return this.player
  }
  createPlayerColliders() {
    this.createCollider(this.player, this.platformColliders)
    this.createCollider(
      this.player,
      this.enemies.getProjectiles() as unknown as GameObjects.GameObject,
      (_player, source) => {
        const projectile = source as unknown as Projectile
        this.handlePlayerCollision(projectile)
      }
    )
    this.createCollider(
      this.player,
      this.traps as unknown as GameObjects.GameObject,
      (_player, source) => {
        const trap = source as unknown as Tilemaps.Tile
        this.handlePlayerCollision(trap)
      }
    )
  }
  getEnemyZones() {
    return this.enemyZones.objects
  }
  getPlayerZones() {
    const [start, end] = this.playerZones.objects
    return { start, end }
  }
  handleAttack(entity: Enemy, source: Melee) {
    entity.handleTakeHit(source)
  }
  handleCollect(_entity: Player, collectible: Collectible) {
    this.score += collectible.score
    this.hud.handleUpdateScoreBoard(this.score)
    collectible.disableBody(true, true)
    this.sound
      .add('collect', {
        volume: 0.25,
      })
      .play()
  }
  handlePlayerCollision(source: Enemy | Projectile | Tilemaps.Tile) {
    this.player.handleTakeHit(source)
  }
}
