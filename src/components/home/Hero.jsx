import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // height of fixed navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80"
          alt="Sports background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-slate-900/70"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mx-auto mb-6 w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-2xl">
          <i className="fas fa-running text-white text-4xl md:text-5xl"></i>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4">
          Yashashree
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
            Sports Academy
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 font-medium mb-8 max-w-2xl mx-auto">
          Building Young Athletes Through Structured Coaching
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* View Sports Programs */}
          <button
            onClick={() => scrollTo("sports")}
            className="px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            View Sports Programs
          </button>

          {/* Book Free Trial */}
          <button
            onClick={() => scrollTo("contact")}
            className="px-8 py-3.5 text-base font-semibold text-white border-2 border-white/80 rounded-full hover:bg-white hover:text-blue-800 transition-all"
          >
            Book Free Trial
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <i className="fas fa-chevron-down text-white/80 text-2xl"></i>
      </div>
    </section>
  );
};

export default Hero;