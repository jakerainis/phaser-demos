import { Animations } from 'phaser'

const objectAnims = (anims: Animations.AnimationManager) => {
  // collectibles
  anims.create({
    key: 'diamond-shine',
    frames: [
      { key: 'diamond-1' },
      { key: 'diamond-2' },
      { key: 'diamond-3' },
      { key: 'diamond-4' },
      { key: 'diamond-5' },
      { key: 'diamond-6' },
    ],
    frameRate: 6,
    repeat: -1,
  })
}
export default objectAnims
