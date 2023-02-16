import usePhaserGame from '@/hooks/usePhaserGame'
import config from '@/scenes/FlappyBird/config'
import GameScene from '@/scenes/FlappyBird/GameScene'
import MenuScene from '@/scenes/FlappyBird/MenuScene'
import PauseScene from '@/scenes/FlappyBird/PauseScene'
import PreloadScene from '@/scenes/FlappyBird/PreloadScene'
import ScoreScene from '@/scenes/FlappyBird/ScoreScene'

export default function Game() {
  usePhaserGame({
    ...config,
    scene: [PreloadScene, MenuScene, ScoreScene, GameScene, PauseScene],
  })

  return <div id="game-content" />
}
