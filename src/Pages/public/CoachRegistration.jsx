import CoachRegistrationForm from '../../forms/CoachRegistrationForm'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const CoachRegistration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-800 hover:underline text-sm font-medium mb-4">
              <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Join as a <span className="text-blue-800">Coach</span>
            </h1>
            <p className="text-gray-600 mt-2">One platform for all your coaching opportunities</p>
          </div>
          <CoachRegistrationForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CoachRegistration