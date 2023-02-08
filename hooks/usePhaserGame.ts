import Phaser from 'phaser'
import { useEffect, useRef } from 'react'

function usePhaserGame(config: Phaser.Types.Core.GameConfig) {
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  useEffect(
    () => {
      if (phaserGameRef.current || !navigator) {
        return
      }
      phaserGameRef.current = new Phaser.Game(config)
      return () => {
        phaserGameRef?.current?.destroy(true)
        phaserGameRef.current = null
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] /* only run once on purpose */
  )
  return phaserGameRef.current
}

export default usePhaserGame
