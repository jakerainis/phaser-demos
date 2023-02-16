import { Physics } from 'phaser'

import BaseScene from '../BaseScene'

import SpriteEffect from './SpriteEffect'

export default class EffectManager {
  scene: BaseScene
  constructor(scene: BaseScene) {
    this.scene = scene
  }

  playEffectOn(
    effectName: string,
    target: Physics.Arcade.Body,
    impactPos: { x: number; y: number }
  ) {
    const effect = new SpriteEffect(this.scene, 0, 0, effectName, impactPos)
    effect.playEffectOn(target)
  }
}
