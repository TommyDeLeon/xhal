import { Monogram } from "./monogram";

export function SiteHeader({ home = false }: { home?: boolean }) {
  return <header className="wrap site-header"><a className="site-header__home" href="/" aria-label="Tommy De Leon, home"><Monogram/><span className={home ? "visually-hidden" : undefined}>Tommy De Leon</span></a><nav className="site-nav" aria-label="Main"><ul><li><a href="/#work">Work</a></li><li><a href="/#about">About</a></li><li><a href="/#contact">Contact</a></li></ul></nav></header>;
}
