import { create } from 'zustand'

interface ScoreStore {
  score: number
  updateScore: (score: number) => void
  highScore: number
  updateHighScore: (score: number) => void
}

const useScoreStore = create<ScoreStore>((set) => ({
  score: 0,
  highScore: 0,
  updateScore: (score: number) =>
    set((_state) => {
      return { score }
    }),
  updateHighScore: (highScore: number) =>
    set((_state) => {
      return { highScore }
    }),
}))

export default useScoreStore
