import { GameObjects, Scene, Types } from 'phaser'

import config from './config'

interface ExtendedConfig extends Types.Core.GameConfig {
  settings: {
    boundBottom: number
    boundCenter: number
    boundLeft: number
    boundRight: number
    boundTop: number
    mapWidth: number
    zoomFactor: number
  }
}

export default class BaseScene extends Scene {
  config: ExtendedConfig
  isDebug: boolean
  key: string
  sceneCenter: [number, number]
  sceneH: number
  sceneW: number

  constructor(key: string) {
    super(key)

    this.isDebug = config.physics?.arcade?.debug || false
    this.key = key
    this.sceneH = config.height as number
    this.sceneW = config.width as number
    this.sceneCenter = [this.sceneW / 2, this.sceneH / 2]

    // Extended config for convenient access
    const Z = 1.5 // zoom factor
    this.config = {
      ...config,
      settings: {
        boundBottom: this.sceneH / Z + (this.sceneH - this.sceneH / Z) / 2,
        boundCenter:
          (this.sceneW / Z +
            (this.sceneW - this.sceneW / Z) / 2 -
            (this.sceneW - this.sceneW / Z) / 2) /
          2,
        boundLeft: (this.sceneW - this.sceneW / Z) / 2,
        boundRight: this.sceneW / Z + (this.sceneW - this.sceneW / Z) / 2,
        boundTop: (this.sceneH - this.sceneH / Z) / 2,
        mapWidth: 1600,
        zoomFactor: Z,
      },
    }
  }
  create() {
    if (this.key === 'GameScene') {
      this.sound.stopByKey('menu-music')
      if (this.sound.get('game-music')) return
      this.sound
        .add('game-music', {
          loop: true,
          volume: 0.25,
        })
        .play()
    } else {
      this.sound.stopByKey('game-music')
      if (this.sound.get('menu-music')) return
      this.sound
        .add('menu-music', {
          loop: true,
          volume: 0.25,
        })
        .play()
    }

    //
  }
  update(_time: number, _delta: number): void {
    //
  }

  /* UTILS */
  createCollider(
    object1: GameObjects.GameObject,
    object2: GameObjects.GameObject,
    callback?: (
      object1: GameObjects.GameObject,
      object2: GameObjects.GameObject
    ) => void
  ) {
    this.physics.add.collider(object1, object2, callback, undefined, this)
  }
  createOverlap(
    object1: GameObjects.GameObject,
    object2: GameObjects.GameObject,
    callback?: (
      object1: GameObjects.GameObject,
      object2: GameObjects.GameObject
    ) => void
  ) {
    this.physics.add.overlap(object1, object2, callback, undefined, this)
  }
}
