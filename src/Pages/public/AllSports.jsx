import { Link } from "react-router-dom";
import cricketImg from "../../assets/sports/cricket-img.jpg";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

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

const AllSports = () => {
  return (
    <>
      <Navbar />

      <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              All <span className="text-blue-800">Sports</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore all the sports programs we offer at Yashashree Sports Academy
            </p>
          </div>

          {/* Sports Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport) => (
              <div
                key={sport.name}
                className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <i className={`fas ${sport.icon} text-blue-800`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{sport.name}</h3>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                    <i className="fas fa-map-marker-alt text-orange-500"></i>
                    {sport.location}
                  </p>

                  <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full mb-5">
                    {sport.tag}
                  </span>

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

          {/* Back Button */}
          <div className="text-center mt-14">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-800 font-medium hover:underline"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllSports;