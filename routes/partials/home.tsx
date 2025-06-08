import { defineRoute } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'

export default defineRoute(() => {
  return (
    <>
      <Head>
        <title>abyssion</title>
        <meta name='description' content='Official website for abyssion' />
      </Head>
    </>
  )
})
