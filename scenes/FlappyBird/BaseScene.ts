import { GameObjects, Scene, Types } from 'phaser'

import config from './config'

import store from '@/stores/flappyBird'

export default class BaseScene extends Scene {
  config: Types.Core.GameConfig
  highScore: number
  highScoreText?: GameObjects.Text
  sceneCenter: [number, number]
  sceneH: number
  sceneW: number
  score: number
  scoreText?: GameObjects.Text

  constructor(key: string) {
    super(key)
    this.config = config
    this.sceneH = config.height as number
    this.sceneW = config.width as number
    this.sceneCenter = [this.sceneW / 2, this.sceneH / 2]

    this.highScore = 0
    this.score = store.getState().highScore
  }

  create() {
    this.createBG()
  }

  /* UTILS */
  createBG() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)
  }
}
