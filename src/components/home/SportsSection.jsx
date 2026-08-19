import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import cricketImg from "../../assets/sports/cricket-img.jpg";

const sports = [
  {
    name: "Cricket",
    icon: "fa-baseball-ball",
    image: cricketImg,
    tag: "Cricket",
    location: "Yashashree Sports Complex, Pune",
  },
  {
    name: "Table Tennis",
    icon: "fa-table-tennis",
    image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&q=80",
    tag: "Table Tennis",
    location: "Yashashree Sports Complex, Pune",
  },
  {
    name: "Football",
    icon: "fa-futbol",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    tag: "Football",
    location: "Yashashree Sports Complex, Pune",
  },
  {
    name: "Badminton",
    icon: "fa-shuttlecock",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
    tag: "Badminton",
    location: "Yashashree Sports Complex, Pune",
  },
  {
    name: "Basketball",
    icon: "fa-basketball-ball",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    tag: "Basketball",
    location: "Yashashree Sports Complex, Pune",
  },
  {
    name: "Athletics",
    icon: "fa-running",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
    tag: "Athletics",
    location: "Yashashree Sports Complex, Pune",
  },
];

const SportsSection = () => {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 340;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="sports" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Sports <span className="text-blue-800">We Offer</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Professional coaching programs designed for every age and skill level
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-all hidden md:flex"
          >
            <i className="fas fa-chevron-left text-blue-800"></i>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-all hidden md:flex"
          >
            <i className="fas fa-chevron-right text-blue-800"></i>
          </button>

          {/* Cards Track */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-6 px-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {sports.map((sport) => (
              <div
                key={sport.name}
                className="group min-w-[300px] sm:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 
                           hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 flex-shrink-0 cursor-pointer"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                      <i className={`fas ${sport.icon} text-blue-800 text-sm`}></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition">
                      {sport.name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 flex items-start gap-1.5">
                    <i className="fas fa-map-marker-alt text-orange-500 mt-0.5"></i>
                    <span>{sport.location}</span>
                  </p>

                  <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full mb-4">
                    {sport.tag}
                  </span>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 text-sm font-semibold text-blue-800 border-2 border-blue-800 rounded-full hover:bg-blue-800 hover:text-white transition-all">
                      Book Free Trial
                    </button>
                    <button className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-500 rounded-full hover:shadow-lg transition-all">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== VIEW ALL SPORTS BUTTON (Correct Place) ========== */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/sports")}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            View All Sports
            <i className="fas fa-arrow-right text-sm"></i>
          </button>
        </div>

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default SportsSection;