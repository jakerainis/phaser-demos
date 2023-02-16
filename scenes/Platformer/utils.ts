import { Animations } from 'phaser'

import Birdman from './entities/Birdman'
import Snakey from './entities/Snakey'

export const ENEMY_TYPES = { Birdman, Snakey }

interface PropertiesObj {
  name: string
  value: string | number
}
export const getPropertyValueByName = (
  properties: PropertiesObj[],
  key: string
) => {
  if (!properties) return null
  const prop = properties.find(({ name }) => name === key)
  return prop?.value || null
}

export const getTimeStamp = () => {
  return new Date().getTime()
}

export const isPlayingAnim = (
  anims: Animations.AnimationState,
  key: string
) => {
  return anims.isPlaying && anims.currentAnim.key === key
}
