import { ReactNode } from "react"
import { LeftSidebar } from "./(LeftSidebar)/LeftSidebar"
import { RightSidebar } from "./RightSidebar"
import { headers } from "next/headers"

interface PageContainerProps {
  children: ReactNode
}

export async function PageContainer({ children }: PageContainerProps) {

   const headersList = headers();
  const pathname = (await headersList).get("x-pathname");

  // console.log(pathname);


  // max-w-2xl

  return (
    <div className="pt-20 pb-10 px-2 sm:px-6 lg:px-8 max-w-8xl mx-auto  bg-[#f1f2f6]">
      <div className="flex gap-8">
        <LeftSidebar />

        <main className={`flex-1 w-full  flex flex-col gap-6`}>
          {children}
        </main>

        <RightSidebar />
      </div>
    </div>
  )
}
