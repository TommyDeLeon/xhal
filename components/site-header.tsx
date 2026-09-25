import Link from "next/link";
import { Monogram } from "./monogram";

export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className="wrap site-header">
      <Link className="site-header__home" href="/" aria-label="Tommy De Leon, home">
        <Monogram />
        <span className={home ? "visually-hidden" : undefined}>Tommy De Leon</span>
      </Link>
      <nav className="site-nav" aria-label="Main">
        <ul>
          <li><Link href="/#work">Work</Link></li>
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
