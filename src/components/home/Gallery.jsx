const galleryImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
  'https://images.unsplash.com/photo-1531415076811-ff7c8d2c3c0e?w=600&q=80',
  'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80',
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80'
]

const Gallery = () => {
  return (
    <section id="gallery" className="py-20 md:py-28 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Yashashree <span className="text-blue-800">Gallery</span> — Experience the Emotion!!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore the best moments from our training sessions and tournaments
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((img, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-md group">
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery