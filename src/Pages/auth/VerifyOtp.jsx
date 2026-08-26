  import React, { useState, useEffect } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { verifyOtp, forgotPassword } from "../../services/authService";

  const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [timeLeft, setTimeLeft] = useState(20);
    const [canResend, setCanResend] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
      email: location.state?.email || "",
    });

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    useEffect(() => {
      if (timeLeft === 0) {
        setCanResend(true);
        return;
      }
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleOtpChange = (value, index) => {
      if (!/^\d?$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    };

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    };

    const handleResendOtp = async () => {
      try {
        const response = await forgotPassword({ email: formData.email });
        if (response.success) {
          setSuccessMessage(response.message);
          setTimeLeft(20);
          setCanResend(false);
          setTimeout(() => setSuccessMessage(""), 2000);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOtp({
        email: formData.email,
        otp: otpValue,
      });

      if (response.success) {
        // ✅ Correctly pass email to Reset Password page
        navigate("/reset-password", {
          state: { email: formData.email },
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };



    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
              <p className="text-gray-500 mt-2 text-sm">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* OTP Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-2.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  ))}
                </div>
              </div>

              {/* Resend */}
              <div className="text-center">
                {!canResend ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in{" "}
                    <span className="font-semibold text-blue-600">
                      00:{timeLeft.toString().padStart(2, "0")}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default VerifyOtp;