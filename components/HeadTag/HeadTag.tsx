import Head from 'next/head'

interface HeadTagProps {
  description?: string
  title?: string
}

export default function HeadTag({ description }: HeadTagProps) {
  return (
    <Head>
      <title>Phaser</title>
      <meta
        name="description"
        content={description ? description : 'Phaser Demo'}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
