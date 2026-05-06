import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16 md:pt-20">{children ?? <Outlet />}</main>
      <footer className="container mt-20 py-10 border-t border-border text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} Aniwave. A frontend demo. No content is hosted here.</p>
        <p className="opacity-70">Mock data • Connect a HiAnime-style API via <code className="text-foreground">src/services/api.ts</code></p>
      </footer>
    </div>
  );
}
