import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, QrCode, Upload, Loader2 } from "lucide-react";
import PaymentService from "./PaymentService";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const PaymentForm = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const [form, setForm] = useState({
    playerEnrollmentId: "",
    installmentId: "",
    amount: "",
    paymentMethod: "",
  });

  const [qrData, setQrData] = useState(null);
  const [upiScreenshot, setUpiScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const response =
          await PaymentService.getEnrollments();

        setEnrollments(response?.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Unable to load enrollments."
        );
      } finally {
        setLoadingEnrollments(false);
      }
    };

    loadEnrollments();
  }, []);

  const handleEnrollmentChange = async (e) => {
    const enrollmentId = e.target.value;

    setError("");
    setSuccess("");
    setQrData(null);
    setUpiScreenshot(null);
    setInstallments([]);

    setForm({
      playerEnrollmentId: enrollmentId,
      installmentId: "",
      amount: "",
      paymentMethod: "",
    });

    const enrollment =
      enrollments.find(
        (item) =>
          String(item.id) ===
          String(enrollmentId)
      );

    setSelectedEnrollment(
      enrollment || null
    );

    if (!enrollmentId) return;

    try {
      setLoading(true);

      const response =
        await PaymentService.getInstallments(
          enrollmentId
        );

      const list =
        response?.data || [];

      setInstallments(list);

      const pending =
        list.find(
          (item) =>
            String(item.status).toUpperCase() ===
            "PENDING"
        );

      if (pending) {
        setForm((prev) => ({
          ...prev,
          installmentId: pending.id,
          amount: pending.amount,
        }));
      } else if (
        enrollment?.paymentPlan ===
        "ONE_TIME"
      ) {
        setForm((prev) => ({
          ...prev,
          amount:
            enrollment.finalAmount ||
            enrollment.amount ||
            "",
        }));
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to load installments."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInstallmentChange = (e) => {
    const installmentId = e.target.value;

    const installment =
      installments.find(
        (item) =>
          String(item.id) ===
          String(installmentId)
      );

    setQrData(null);
    setUpiScreenshot(null);

    setForm((prev) => ({
      ...prev,
      installmentId,
      amount:
        installment?.amount || "",
    }));
  };

  const generateQr = async () => {
    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      setError(
        "Payment amount must be greater than zero."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await PaymentService.generateQr(
          form.amount
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "QR generation failed."
        );
      }

      setQrData(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to generate QR."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.playerEnrollmentId) {
      setError(
        "Please select an enrollment."
      );
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError(
        "Payment amount must be greater than zero."
      );
      return;
    }

    if (!form.paymentMethod) {
      setError(
        "Please select a payment method."
      );
      return;
    }

    if (
      form.paymentMethod === "UPI" &&
      !upiScreenshot
    ) {
      setError(
        "UPI payment screenshot is required."
      );
      return;
    }

    if (!selectedEnrollment?.playerId) {
      setError(
        "Player information is missing from enrollment."
      );
      return;
    }

    try {
      setLoading(true);

      const payment = {
        playerId:
          Number(selectedEnrollment.playerId),
        playerEnrollmentId:
          Number(form.playerEnrollmentId),
        installmentId:
          form.installmentId
            ? Number(form.installmentId)
            : null,
        amount:
          Number(form.amount),
        paymentMethod:
          form.paymentMethod,
      };

      const data = new FormData();

      data.append(
        "payment",
        JSON.stringify(payment)
      );

      if (
        form.paymentMethod === "UPI" &&
        upiScreenshot
      ) {
        data.append(
          "upiScreenshot",
          upiScreenshot
        );
      }

      const response =
        await PaymentService.create(data);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Payment creation failed."
        );
      }

      if (
        form.paymentMethod === "CASH" &&
        response?.data?.id
      ) {
        await PaymentService.markAsReceived(
          response.data.id
        );
      }

      setSuccess(
        form.paymentMethod === "UPI"
          ? "Payment created. Awaiting verification."
          : "Payment received successfully."
      );

      setTimeout(() => {
        navigate(
          "/receptionist/payment-management"
        );
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        <div className="bg-slate-900 text-white rounded-t-2xl px-6 py-5 flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/receptionist/payment-management"
              )
            }
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl font-bold">
              Collect Payment
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Record a payment for an existing enrollment.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-2xl shadow-sm p-6 md:p-8 space-y-6"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Player Enrollment
            </label>

            <select
              value={
                form.playerEnrollmentId
              }
              onChange={
                handleEnrollmentChange
              }
              disabled={
                loadingEnrollments
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="">
                {loadingEnrollments
                  ? "Loading..."
                  : "Select enrollment"}
              </option>

              {enrollments.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    #{item.id} -{" "}
                    {item.playerName ||
                      `Player #${item.playerId}`}
                    {item.batchName
                      ? ` - ${item.batchName}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>

          {selectedEnrollment && (
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="font-semibold">
                {selectedEnrollment.playerName ||
                  `Player #${selectedEnrollment.playerId}`}
              </p>

              <p className="text-sm text-slate-600 mt-1">
                {selectedEnrollment.sportName ||
                  "—"}{" "}
                •{" "}
                {selectedEnrollment.batchName ||
                  "—"}
              </p>
            </div>
          )}

          {installments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pending Installment
              </label>

              <select
                value={
                  form.installmentId
                }
                onChange={
                  handleInstallmentChange
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="">
                  Select installment
                </option>

                {installments
                  .filter(
                    (item) =>
                      String(
                        item.status
                      ).toUpperCase() ===
                      "PENDING"
                  )
                  .map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        Installment{" "}
                        {
                          item.installmentNumber
                        }{" "}
                        - ₹
                        {money(
                          item.amount
                        )}
                      </option>
                    )
                  )}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  amount:
                    e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Method
            </label>

            <div className="grid grid-cols-2 gap-4">
              {["CASH", "UPI"].map(
                (method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => {
                      setQrData(null);
                      setUpiScreenshot(
                        null
                      );

                      setForm(
                        (prev) => ({
                          ...prev,
                          paymentMethod:
                            method,
                        })
                      );
                    }}
                    className={`p-5 rounded-xl border-2 text-left ${
                      form.paymentMethod ===
                      method
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200"
                    }`}
                  >
                    <p className="font-semibold">
                      {method}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {method === "UPI"
                        ? "Generate QR and upload proof."
                        : "Receive cash at counter."}
                    </p>
                  </button>
                )
              )}
            </div>
          </div>

          {form.paymentMethod ===
            "UPI" && (
            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold">
                      UPI Payment
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Generate QR for ₹
                    {money(
                      form.amount
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    generateQr
                  }
                  disabled={
                    loading ||
                    !form.amount
                  }
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {loading
                    ? "Generating..."
                    : "Generate QR"}
                </button>
              </div>

              {qrData?.qrCodeBase64 && (
                <div className="mt-5 bg-white rounded-xl p-5 text-center">
                  <img
                    src={`data:image/png;base64,${qrData.qrCodeBase64}`}
                    alt="UPI QR"
                    className="w-72 h-72 mx-auto"
                  />

                  <p className="font-bold text-xl mt-3">
                    ₹{qrData.amount}
                  </p>

                  <p className="text-sm text-slate-600">
                    {qrData.payeeName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {qrData.upiId}
                  </p>

                  <label className="mt-5 flex items-center justify-center gap-2 border-2 border-dashed border-purple-200 rounded-xl p-6 cursor-pointer">
                    <Upload className="w-5 h-5 text-purple-600" />

                    <span className="text-sm">
                      {upiScreenshot
                        ? upiScreenshot.name
                        : "Upload payment screenshot"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setUpiScreenshot(
                          e.target.files?.[0] ||
                            null
                        )
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/receptionist/payment-management"
                )
              }
              className="px-5 py-2.5 border border-slate-200 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !form.paymentMethod ||
                (form.paymentMethod ===
                  "UPI" &&
                  !upiScreenshot)
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
