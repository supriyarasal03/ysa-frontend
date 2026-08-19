import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-800 to-cyan-500 flex items-center justify-center">
                <i className="fas fa-running text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Yashashree</h3>
                <p className="text-xs text-gray-400">Sports Academy</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building young athletes through structured coaching, discipline and a winning mindset in Pune. best one created by Supriya Rasal
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><a href="/#about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/#sports" className="hover:text-white transition">Sports We Offer</a></li>
              <li><a href="/#gallery" className="hover:text-white transition">Gallery</a></li>
              <li><a href="/#contact" className="hover:text-white transition">Contact Us</a></li>
              <li><Link to="/coach-registration" className="hover:text-white transition">Join as Coach</Link></li>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Sports</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Cricket', 'Table Tennis', 'Football', 'Badminton', 'Basketball', 'Athletics'].map(sport => (
                <li key={sport}><a href="/#sports" className="hover:text-white transition">{sport}</a></li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-lg mb-5">Location</h4>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <i className="fas fa-map-marker-alt text-orange-500 mt-1"></i>
              <p>
                Yashashree Sports Complex,<br />
                Baner Road, Near Baner Gaon,<br />
                Pune, Maharashtra – 411045
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              {['instagram', 'facebook-f', 'youtube', 'whatsapp'].map(icon => (
                <a key={icon} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-800 transition">
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 Yashashree Sports Academy. All rights reserved.</p>
          <p>Designed with ❤️ for young champions</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer