import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Scroll to section
  const scrollTo = (id) => {
    setMobileOpen(false);
    setActiveSection(id);

    if (isHome) {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      window.location.href = `/#${id}`;
    }
  };

  // Detect which section is currently in view
  useEffect(() => {
    if (!isHome) return;

    const sections = ["home", "about", "sports", "gallery", "contact"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Helper for active class
  const getLinkClass = (id) => {
    const isActive = activeSection === id;
    return isActive
      ? "px-4 py-1.5 text-sm font-semibold text-blue-800 bg-white rounded-full shadow-sm"
      : "px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-800";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-800 to-cyan-500 flex items-center justify-center shadow-lg">
              <i className="fas fa-running text-white text-xl"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-blue-800 leading-tight">Yashashree</h1>
              <p className="text-xs text-gray-500 -mt-0.5 tracking-wide">Sports Academy</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 rounded-full px-2 py-1.5">
            <button onClick={() => scrollTo("home")} className={getLinkClass("home")}>
              Home
            </button>

            <button onClick={() => scrollTo("about")} className={getLinkClass("about")}>
              About
            </button>

            <div className="relative group">
              <button
                onClick={() => scrollTo("sports")}
                className={`${getLinkClass("sports")} flex items-center gap-1`}
              >
                Sports We Offer <i className="fas fa-chevron-down text-xs"></i>
              </button>

              <div className="absolute top-full left-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {["Cricket", "Table Tennis", "Football", "Badminton", "Basketball", "Athletics"].map(
                  (sport) => (
                    <button
                      key={sport}
                      onClick={() => scrollTo("sports")}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {sport}
                    </button>
                  )
                )}
              </div>
            </div>

            <button onClick={() => scrollTo("gallery")} className={getLinkClass("gallery")}>
              Gallery
            </button>

            <button onClick={() => scrollTo("contact")} className={getLinkClass("contact")}>
              Contact Us
            </button>
          </nav>

          {/* Right Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-blue-800 border-2 border-blue-800 rounded-full hover:bg-blue-800 hover:text-white transition-all"
            >
              Login
            </Link>
            <button
              onClick={() => scrollTo("contact")}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Book Free Trial
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 lg:hidden">
          <div className="flex items-center justify-between p-5 border-b">
            <span className="font-bold text-blue-800 text-lg">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <nav className="flex flex-col p-5 gap-1">
            <button
              onClick={() => scrollTo("home")}
              className={`px-4 py-3 rounded-lg text-left font-medium ${
                activeSection === "home"
                  ? "bg-blue-50 text-blue-800"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("about")}
              className={`px-4 py-3 rounded-lg text-left font-medium ${
                activeSection === "about"
                  ? "bg-blue-50 text-blue-800"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollTo("sports")}
              className={`px-4 py-3 rounded-lg text-left font-medium ${
                activeSection === "sports"
                  ? "bg-blue-50 text-blue-800"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              Sports We Offer
            </button>
            <button
              onClick={() => scrollTo("gallery")}
              className={`px-4 py-3 rounded-lg text-left font-medium ${
                activeSection === "gallery"
                  ? "bg-blue-50 text-blue-800"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className={`px-4 py-3 rounded-lg text-left font-medium ${
                activeSection === "contact"
                  ? "bg-blue-50 text-blue-800"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              Contact Us
            </button>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center px-5 py-2.5 text-sm font-semibold text-blue-800 border-2 border-blue-800 rounded-full"
              >
                Login
              </Link>
              <button
                onClick={() => scrollTo("contact")}
                className="text-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
              >
                Book Free Trial
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;