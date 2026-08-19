const FloatingCall = () => {
  return (
    <a 
      href="tel:+919876543210" 
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
    >
      <i className="fas fa-phone-alt text-xl"></i>
    </a>
  )
}

export default FloatingCall