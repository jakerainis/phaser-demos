import BaseScene from './BaseScene'

export default class PreloadScene extends BaseScene {
  constructor() {
    super('PreloadScene')
  }
  preload() {
    // Background
    this.load.image('bg-spikes-dark', 'platformer/bg_spikes_dark.png')
    this.load.image('bg-spikes-tileset', 'platformer/bg_spikes_tileset.png')
    this.load.image('sky-play', 'platformer/sky_play.png')

    // Map
    this.load.tilemapTiledJSON('level-1', 'platformer/level-1.json')
    this.load.tilemapTiledJSON('level-2', 'platformer/level-2.json')
    this.load.image('tiles-1', 'platformer/main_lev_build_1.png')
    this.load.image('tiles-2', 'platformer/main_lev_build_2.png')

    // Player
    this.load.spritesheet('player', 'platformer/player/move_sprite_1.png', {
      frameHeight: 38,
      frameWidth: 32,
      spacing: 32,
    })
    this.load.spritesheet(
      'player-throw',
      'platformer/player/throw_attack_sheet_1.png',
      {
        frameHeight: 38,
        frameWidth: 32,
        spacing: 32,
      }
    )
    this.load.spritesheet(
      'player-slide',
      'platformer/player/slide_sheet_1.png',
      {
        frameHeight: 38,
        frameWidth: 32,
        spacing: 32,
      }
    )

    // Weapons
    this.load.image(
      'fireball-1',
      'platformer/weapons/improved_fireball_001.png'
    )
    this.load.image(
      'fireball-2',
      'platformer/weapons/improved_fireball_002.png'
    )
    this.load.image(
      'fireball-3',
      'platformer/weapons/improved_fireball_003.png'
    )
    this.load.image('iceball-1', 'platformer/weapons/iceball_001.png')
    this.load.image('iceball-2', 'platformer/weapons/iceball_002.png')
    this.load.spritesheet(
      'sword-default',
      'platformer/weapons/sword_sheet_1.png',
      {
        frameHeight: 32,
        frameWidth: 52,
        spacing: 16,
      }
    )

    // Enemies
    this.load.spritesheet('birdman', 'platformer/enemy/enemy_sheet.png', {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32,
    })
    this.load.spritesheet('snakey', 'platformer/enemy/enemy_sheet_2.png', {
      frameWidth: 32,
      frameHeight: 64,
      spacing: 32,
    })

    // Effects
    this.load.spritesheet(
      'hit-effect',
      'platformer/weapons/hit_effect_sheet.png',
      {
        frameHeight: 32,
        frameWidth: 32,
      }
    )

    // Objects
    this.load.image('diamond', 'platformer/collectibles/diamond.png')
    this.load.image('diamond-1', 'platformer/collectibles/diamond_big_01.png')
    this.load.image('diamond-2', 'platformer/collectibles/diamond_big_02.png')
    this.load.image('diamond-3', 'platformer/collectibles/diamond_big_03.png')
    this.load.image('diamond-4', 'platformer/collectibles/diamond_big_04.png')
    this.load.image('diamond-5', 'platformer/collectibles/diamond_big_05.png')
    this.load.image('diamond-6', 'platformer/collectibles/diamond_big_06.png')

    this.load.once('complete', () => {
      this.registry.set('level', 1)
      this.registry.set('unlocked-levels', 1)
      this.scene.start('IntroScene')
    })

    // Audio
    this.load.audio('collect', 'platformer/music/coin_pickup.wav')
    this.load.audio('game-music', 'platformer/music/game_music.wav')
    this.load.audio('impact', 'platformer/music/impact.wav')
    this.load.audio('jump', 'platformer/music/jump.wav')
    this.load.audio('menu-music', 'platformer/music/menu_music.wav')
    this.load.audio('shot', 'platformer/music/shot.wav')
    this.load.audio('swipe', 'platformer/music/swipe.wav')
  }
  // create() {
  //   super.create()
  //   this.scene.start('GameScene')
  // }
}
