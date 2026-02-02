import { Link, useLocation } from "react-router-dom";
import { Radio, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Главная", path: "/" },
  { label: "История треков", path: "/history" },
];

export const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center glow-primary transition-all duration-300 group-hover:scale-110">
                <Radio className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring opacity-50" />
            </div>
            <span className="font-display text-2xl text-gradient">Твоя волна</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 ">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-body text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Live Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/40">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-semibold text-destructive uppercase tracking-wider">В эфире</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-border animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-4 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
