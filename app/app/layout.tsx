import { ReactNode } from "react";
import { PageContainer } from "../src/components/layout/PageContainer";
import { Header } from "../src/components/layout/(Header)/Header";
import { RightSidebar } from "../src/components/layout/(RightSideBar)/RightSidebar";

export default function AppLayout({children}: {children: ReactNode}) {
    return (
        <main>
            <Header/>
            <PageContainer>
            {children}
            </PageContainer>
        </main>
    )
}