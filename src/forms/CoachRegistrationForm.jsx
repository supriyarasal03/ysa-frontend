import { useState } from 'react';
import { registerCoach } from "../services/coachRegistrationService";

const CoachRegistrationForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // field-level errors
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    sports: [],
    experience: '',
    certification: '',
    address: '',
    city: 'Pune',
    pincode: '',
    about: '',
    resume: null
  });

  const sportsList = [
    'Cricket', 'Table Tennis', 'Football', 'Badminton',
    'Basketball', 'Athletics', 'Tennis', 'Swimming'
  ];

  // Clear single field error when user types
  const clearFieldError = (name) => {
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    clearFieldError(name);
  };

  const handleSportToggle = (sport) => {
    const updated = formData.sports.includes(sport)
      ? formData.sports.filter(s => s !== sport)
      : [...formData.sports, sport];
    setFormData({ ...formData, sports: updated });
    clearFieldError("sports");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for sports
    if (formData.sports.length === 0) {
      setFieldErrors(prev => ({ ...prev, sports: "Please select at least one sport." }));
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await registerCoach(formData);

      setSuccessMessage(response.message || "Application submitted successfully.");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        sports: [],
        experience: "",
        certification: "",
        address: "",
        city: "Pune",
        pincode: "",
        about: "",
        resume: null
      });
      setFieldErrors({});

      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (error) {
      const data = error.response?.data;

      // 1. Field-level errors (most common Spring Boot format)
      if (data?.errors && typeof data.errors === 'object') {
        setFieldErrors(data.errors);
      }
      // 2. Sometimes errors come as array of { field, message }
      else if (Array.isArray(data?.errors)) {
        const mapped = {};
        data.errors.forEach(err => {
          if (err.field) mapped[err.field] = err.message || err.defaultMessage;
        });
        setFieldErrors(mapped);
      }
      // 3. Fallback – general message
      else {
        setErrorMessage(
          data?.message ||
          data?.error ||
          "Something went wrong. Please try again."
        );
      }

      setTimeout(() => {
        setErrorMessage("");
      }, 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to show red error under field
  const ErrorText = ({ name }) => {
    if (!fieldErrors[name]) return null;
    return (
      <p className="mt-1.5 text-sm text-red-600 font-medium">
        {fieldErrors[name]}
      </p>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-800 via-cyan-500 to-orange-500"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Coach Registration</h2>
        <p className="text-gray-500 text-sm mt-1">
          Fill the form below to join Yashashree Sports Academy as a coach
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* General Error Message */}
      {errorMessage && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Full Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition disabled:bg-gray-100
                ${fieldErrors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                }`}
            />
            <ErrorText name="fullName" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              required
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition disabled:bg-gray-100
                ${fieldErrors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                }`}
            />
            <ErrorText name="email" />
          </div>
        </div>

        {/* Phone + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-r-xl border outline-none transition disabled:bg-gray-100
                  ${fieldErrors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                  }`}
              />
            </div>
            <ErrorText name="phone" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition bg-white disabled:bg-gray-100
                ${fieldErrors.gender
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                }`}
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <ErrorText name="gender" />
          </div>
        </div>

        {/* DOB + Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition disabled:bg-gray-100
                ${fieldErrors.dateOfBirth
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                }`}
            />
            <ErrorText name="dateOfBirth" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience *</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition bg-white disabled:bg-gray-100
                ${fieldErrors.experience
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                }`}
            >
              <option value="" disabled>Select experience</option>
              <option value="0-1">0 - 1 Year</option>
              <option value="1-3">1 - 3 Years</option>
              <option value="3-5">3 - 5 Years</option>
              <option value="5-10">5 - 10 Years</option>
              <option value="10+">10+ Years</option>
            </select>
            <ErrorText name="experience" />
          </div>
        </div>

        {/* Sports */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sports You Can Coach *</label>
          <div className="flex flex-wrap gap-2">
            {sportsList.map(sport => (
              <button
                key={sport}
                type="button"
                onClick={() => handleSportToggle(sport)}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all disabled:opacity-60 ${
                  formData.sports.includes(sport)
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-800 hover:text-blue-800'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
          <ErrorText name="sports" />
        </div>

        {/* Certification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Certification / Qualification</label>
          <input
            type="text"
            name="certification"
            value={formData.certification}
            onChange={handleChange}
            placeholder="e.g. NIS, AIFF, Level 1 Coach, etc."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition disabled:bg-gray-100
              ${fieldErrors.certification
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
              }`}
          />
          <ErrorText name="certification" />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            placeholder="Full residential address"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition resize-none disabled:bg-gray-100
              ${fieldErrors.address
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
              }`}
          />
          <ErrorText name="address" />
        </div>

        {/* City + Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition disabled:bg-gray-100
                ${fieldErrors.city
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                }`}
            />
            <ErrorText name="city" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="411045"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition disabled:bg-gray-100
                ${fieldErrors.pincode
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
                }`}
            />
            <ErrorText name="pincode" />
          </div>
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">About Yourself / Coaching Philosophy</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows="3"
            placeholder="Tell us about your coaching experience and approach..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition resize-none disabled:bg-gray-100
              ${fieldErrors.about
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
              }`}
          />
          <ErrorText name="about" />
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Upload Resume / Certificate (PDF)
          </label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100 disabled:bg-gray-100
              ${fieldErrors.resume
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100'
              }`}
          />
          <ErrorText name="resume" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 text-white font-bold rounded-xl text-base shadow-lg transition-all
            ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-800 to-cyan-500 hover:shadow-xl'
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
};

export default CoachRegistrationForm;