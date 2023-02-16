import Link from 'next/link'

import css from '@/styles/Home.module.css'

import Header from '@/components/Header/Header'
import HeadTag from '@/components/HeadTag/HeadTag'

export default function Home() {
  return (
    <>
      <HeadTag />
      <Header />
      <h1 className="mt-12 text-2xl text-center text-white">GAMES</h1>
      <main className={css.main}>
        <ul>
          <li>
            <Link href="/platformer">Platformer (Requires Keyboard)</Link>
          </li>
          <li>
            <Link href="/flappy-bird">Flappy Bird</Link>
          </li>
        </ul>
      </main>
    </>
  )
}
