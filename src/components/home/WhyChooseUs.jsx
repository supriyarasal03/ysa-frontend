const WhyChooseUs = () => {
  const stats = [
    {
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80',
      number: '500+',
      label: 'Players Trained'
    },
    {
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
      number: '15+',
      label: 'Expert Coaches'
    },
    {
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=600&q=80',
      number: '1',
      label: 'Dedicated Centre'
    }
  ]

  return (
    <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Why <span className="text-blue-800">Choose</span> Yashashree?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Next-gen sports coaching in Pune — precision training & winning mindset under one roof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="relative group rounded-2xl overflow-hidden shadow-xl h-80">
              <img
                src={stat.image}
                alt={stat.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-5xl font-extrabold mb-1">{stat.number}</p>
                <p className="text-sm font-semibold tracking-widest uppercase opacity-90">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs