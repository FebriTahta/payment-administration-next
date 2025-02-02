import { Login } from "@/components/page/login"

const page = () => {
  return (
    <div className="flex font-[family-name:var(--font-geist-mono)] min-h-screen">
      <div className="mx-auto w-full content-center z-20">
        <Login/>
      </div>
    </div>
  )
}

export default page