import { Animations } from 'phaser'

const snakeyAnims = (anims: Animations.AnimationState) => {
  anims.create({
    key: 'snakey-idle',
    frames: anims.generateFrameNumbers('snakey', {
      start: 0,
      end: 8,
    }),
    frameRate: 8,
    repeat: -1,
  })
  anims.create({
    key: 'snakey-hit',
    frames: anims.generateFrameNumbers('snakey', {
      start: 21,
      end: 22,
    }),
    frameRate: 5,
    repeat: 0,
  })
}
export default snakeyAnims
