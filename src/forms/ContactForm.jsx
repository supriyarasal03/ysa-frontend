import { useState } from "react";
import { saveContact } from "../services/contactService";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    queryType: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await saveContact(formData);

      setSuccessMessage(response.message);

      setFormData({
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        queryType: "",
        message: "",
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-800 via-cyan-500 to-orange-500"></div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-700 font-medium">
          ✅ {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700 font-medium">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Your first name"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Your last name"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contact Number
            </label>

            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>

              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="9876543210"
                required
                maxLength={10}
                className="w-full px-4 py-3 rounded-r-xl border border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email ID
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Query / Issue Type
          </label>

          <select
            name="queryType"
            value={formData.queryType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
          >
            <option value="">Select query / issue type</option>
            <option value="Free Trial Booking">Free Trial Booking</option>
            <option value="Enrollment Inquiry">Enrollment Inquiry</option>
            <option value="Coach Application">Coach Application</option>
            <option value="Partnership">Partnership</option>
            <option value="General Query">General Query</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Message (Optional)
          </label>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            placeholder="Type your message here..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 text-white font-bold rounded-xl text-base shadow-lg bg-gradient-to-r from-blue-800 to-cyan-500 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;