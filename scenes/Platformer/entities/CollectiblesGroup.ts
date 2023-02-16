import { Physics, Tilemaps } from 'phaser'

import BaseScene from '../BaseScene'
import { getPropertyValueByName } from '../utils'

import Collectible from './Collectible'

export default class Collectibles extends Physics.Arcade.Group {
  constructor(scene: BaseScene) {
    super(scene.physics.world, scene)

    this.createFromConfig({
      classType: Collectible,
    })

    this.setDepth(-10)
  }
  addFromLayer(objectLayer: Tilemaps.ObjectLayer) {
    objectLayer.objects.forEach((c) => {
      const score = getPropertyValueByName(c.properties, 'score') || 1
      const collectible: Collectible = this.get(
        c.x as number,
        c.y as number,
        'diamond'
      )
      collectible.score = score as number
      collectible.setCollectibleTint()
    })
  }
}
