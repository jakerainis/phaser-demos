import { Physics } from 'phaser'

import BaseScene from '../BaseScene'

export default class SpriteEffect extends Physics.Arcade.Sprite {
  effectName: string
  impactPos: { x: number; y: number }
  target?: Physics.Arcade.Body
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    key: string,
    impactPos: { x: number; y: number }
  ) {
    super(scene, x, y, key)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.effectName = key
    this.impactPos = impactPos

    this.on(
      'animationcomplete',
      ({ key }: Phaser.Animations.Animation) => {
        if (key === 'hit') this.destroy()
      },
      this
    )
  }
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)
    this.handlePlaceEffect()
  }

  handlePlaceEffect() {
    if (!this.target || !this.body) return
    // const center = this.target.center.x
    this.body.reset(this.impactPos.x, this.impactPos.y)
  }
  playEffectOn(target: Physics.Arcade.Body) {
    this.target = target
    this.play(this.effectName, true)
    // this.handlePlaceEffect()
  }
}
