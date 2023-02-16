import { Animations } from 'phaser'

const birdmanAnims = (anims: Animations.AnimationState) => {
  anims.create({
    key: 'birdman-idle',
    frames: anims.generateFrameNumbers('birdman', {
      start: 0,
      end: 12,
    }),
    frameRate: 8,
    repeat: -1,
  })
  anims.create({
    key: 'birdman-hit',
    frames: anims.generateFrameNumbers('birdman', {
      start: 25,
      end: 26,
    }),
    frameRate: 5,
    repeat: 0,
  })
}
export default birdmanAnims
