import usePhaserGame from '@/hooks/usePhaserGame'
import config from '@/scenes/Platformer/config'
import CreditsScene from '@/scenes/Platformer/CreditsScene'
import GameScene from '@/scenes/Platformer/GameScene'
import IntroScene from '@/scenes/Platformer/IntroScene'
import LevelsScene from '@/scenes/Platformer/LevelsScene'
import MenuScene from '@/scenes/Platformer/MenuScene'
// import PauseScene from '@/scenes/Platformer/PauseScene'
import PreloadScene from '@/scenes/Platformer/PreloadScene'

export default function Game() {
  usePhaserGame({
    ...config,
    scene: [
      PreloadScene,
      IntroScene,
      MenuScene,
      LevelsScene,
      GameScene,
      CreditsScene,
    ],
  })

  return <div id="game-content" />
}
