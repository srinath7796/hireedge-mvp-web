import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/skills", label: "Skills" },
  { href: "/interview", label: "Interview" },
  { href: "/linkedin", label: "LinkedIn" },
  { href: "/profile", label: "Talent Profile" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/visa", label: "Visa" },
  { href: "/gap", label: "Gap" },
];

export default function Layout({ title, subtitle, children, actions }) {
  return (
    <div>
      <header className="header-shell">
        <div className="header-inner">
          <div className="brand">HireEdge</div>
          <nav className="nav-links" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="page-shell">
        <div className="page-hero">
          {title && <h1 className="page-title">{title}</h1>}
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
          {actions && <div className="inline-actions">{actions}</div>}
        </div>
        {children}
      </main>

      <footer className="footer-shell">
        <div className="footer-inner">
          <div className="footer-text">Built for the HireEdge Career Engine</div>
          <div className="footer-text">Fast, ATS-friendly outputs for endorsements</div>
        </div>
      </footer>
    </div>
  );
}
