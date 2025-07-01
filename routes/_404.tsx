import { PageProps } from '$fresh/server.ts'

export default function NotFoundPage({ url }: PageProps) {
  return (
    <div class='px-4 py-8 mx-auto bg-[#86efac]'>
      <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
        <p>
          The page you were looking for does not exist: <span class='font-mono'>{url.pathname}</span>
        </p>
        <a href='/' class='underline'>Go back home</a>
      </div>
    </div>
  )
}
