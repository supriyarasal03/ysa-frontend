import ContactForm from '../../forms/ContactForm'

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          <div>
            <p className="text-sm font-semibold tracking-widest text-blue-800 uppercase mb-3">Get In Touch</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Have a question <span className="text-blue-800">FOR US?</span>
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Send us a message and we’ll get back to you shortly. Whether it’s about training programs, trials, or partnerships — we’re here to help.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white shadow-md">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us at</p>
                  <p className="font-semibold text-slate-900">contact@yashashreesports.in</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white shadow-md">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call us at</p>
                  <p className="font-semibold text-slate-900">+91 98765 43210 / +91 91234 56789</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white shadow-md">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit us at</p>
                  <p className="font-semibold text-slate-900">Yashashree Sports Complex, Baner Road, Pune – 411045</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}

export default ContactSection