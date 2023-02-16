import { GameObjects, Geom, Physics, Scene, Tilemaps } from 'phaser'

export default class Raycaster {
  bodyPositionDiffX: number
  isDebug: boolean
  prevHasHits: boolean | null
  prevRay: Geom.Line
  rayGraphics!: GameObjects.Graphics
  scene: Scene

  constructor(scene: Scene, isDebug = false) {
    this.bodyPositionDiffX = 0
    this.isDebug = isDebug
    this.prevHasHits = null
    this.prevRay = new Geom.Line()
    this.scene = scene

    if (this.isDebug) {
      this.createRayGraphics()
    }
  }
  createRayGraphics() {
    this.rayGraphics = this.scene.add.graphics({
      lineStyle: { color: 0xaa00aa, width: 2 },
    })
  }
  createRaycasts(
    collisionLayer: Tilemaps.TilemapLayer,
    body: Physics.Arcade.Body,
    { precision = 0, rayLength = 45, steepness = 1 }
  ) {
    const { x, y, width, halfHeight } = body

    // Check if needs update
    this.bodyPositionDiffX += body.x - body.prev.x
    if (
      Math.abs(this.bodyPositionDiffX) <= precision &&
      this.prevHasHits !== null
    ) {
      return { hasHits: this.prevHasHits, ray: this.prevRay }
    }

    // Update...
    this.bodyPositionDiffX = 0
    const ray = new Geom.Line()
    // Handle direction of sprite
    switch (body.facing) {
      case Physics.Arcade.FACING_LEFT:
        ray.x1 = x + 20
        ray.y1 = y + halfHeight
        ray.x2 = ray.x1 - rayLength * steepness
        ray.y2 = ray.y1 + rayLength
        break
      default:
        ray.x1 = x + width - 20
        ray.y1 = y + halfHeight
        ray.x2 = ray.x1 + rayLength * steepness
        ray.y2 = ray.y1 + rayLength
        break
    }

    const hits = collisionLayer.getTilesWithinShape(ray)
    const hasHits = hits.some((tile) => tile.index !== -1)

    this.prevHasHits = hasHits
    this.prevRay = ray

    return { ray, hasHits }
  }
  destroy() {
    if (this.isDebug) {
      this.rayGraphics.clear().destroy()
    }
  }
  updateRayGraphics() {
    if (this.isDebug && this.rayGraphics) {
      this.rayGraphics.clear()
      this.rayGraphics.strokeLineShape(this.prevRay)
    }
  }
}
