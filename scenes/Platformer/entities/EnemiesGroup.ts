import { GameObjects } from 'phaser'

import BaseScene from '../BaseScene'
import { ENEMY_TYPES } from '../utils'

import Enemy from './Enemy'

export default class Enemies extends GameObjects.Group {
  constructor(scene: BaseScene) {
    super(scene)
  }
  getProjectiles() {
    const projectiles = new GameObjects.Group(this.scene)
    // Get all enemeies
    this.getChildren().forEach((child) => {
      // For each enemy, get it's projectiles group
      const enemy = child as unknown as Enemy
      if (enemy.projectiles) {
        projectiles.addMultiple(enemy.projectiles.getChildren())
      }
    })
    return projectiles
  }
  getTypes() {
    return ENEMY_TYPES
  }
}
