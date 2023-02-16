import dynamic from 'next/dynamic'

import css from '@/styles/Home.module.css'

import Header from '@/components/Header/Header'
import HeadTag from '@/components/HeadTag/HeadTag'

const Game = dynamic(() => import('@/components/Games/FlappyBird'), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <HeadTag />
      <Header />
      <main className={css.main}>
        <Game />
      </main>
    </>
  )
}
