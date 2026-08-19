import { Link } from 'react-router-dom'

const JoinAsCoach = () => {
  const coachImages = [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&q=80',
    'https://images.unsplash.com/photo-1599058945522-28d584b6f14f?w=200&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=200&q=80',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200&q=80'
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-800 shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1517649763962-0c623066027b?w=1200&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10 p-8 md:p-12 lg:p-14">
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Join as a Coach</h2>
              <p className="text-white/90 text-lg mb-6">
                One platform for all your coaching opportunities. Share your expertise and shape the next generation of champions.
              </p>
              <Link
                to="/coach-registration"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-800 font-bold rounded-full hover:bg-orange-50 transition-all shadow-lg"
              >
                Apply as Coach <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm">
              {coachImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover shadow-lg border-2 border-white/30"
                  alt="Coach"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinAsCoach