import { ReactNode } from "react"
import { LeftSidebar } from "./(LeftSidebar)/LeftSidebar"
import { RightSidebar } from "./RightSidebar"
import { headers } from "next/headers"

interface PageContainerProps {
  children: ReactNode
}

export async function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="pt-20 pb-10 px-2 sm:px-6 lg:px-8 max-w-8xl mx-auto bg-[#f1f2f6]">
      <div className="flex gap-8">
        <LeftSidebar />

        <main className={`flex-1 w-full flex flex-col overflow-x-hidden gap-6`}>
          {children}
        </main>

        <RightSidebar />
      </div>
    </div>
  )
}
