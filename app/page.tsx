import { Navbar } from "@/components/v1/Navbar";
import { Skiper39 } from "@/components/v1/skiper39";
import { About } from "@/components/v1/About";
import { Work } from "@/components/v1/Work";
import { Skills } from "@/components/v1/Skills";
import { Process } from "@/components/v1/Process";
import { Contact } from "@/components/v1/Contact";
import { GlobalEasterEggs } from "@/components/v1/GlobalEasterEggs";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden" suppressHydrationWarning>
      <GlobalEasterEggs />
      <Navbar />
      <Skiper39 />
      <About />
      <Work />
      <Skills />
      <Process />
      <Contact />
    </main>
  );
}
