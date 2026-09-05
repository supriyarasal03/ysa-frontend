import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  FileText,
  Download,
  Mail,
  Loader2,
  ExternalLink,
  User,
  CreditCard,
  Package,
} from "lucide-react";

import AdmissionReceiptService from "./AdmissionReceiptService";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const AdmissionReceiptModal = ({
  playerId,
  onClose,
  onContinue,
}) => {

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [emailSuccess, setEmailSuccess] = useState("");
  const [error, setError] = useState("");


  // =========================================================
  // LOAD RECEIPT
  // =========================================================

  useEffect(() => {

    const loadReceipt = async () => {

      if (!playerId) {
        setError("Player ID is missing.");
        setLoading(false);
        return;
      }

      try {

        setLoading(true);
        setError("");

        const response =
          await AdmissionReceiptService.getReceipt(
            playerId
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Unable to load admission receipt."
          );
        }

        setReceipt(response.data);

      } catch (err) {

        console.error(
          "Admission receipt load error:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load admission receipt."
        );

      } finally {
        setLoading(false);
      }

    };

    loadReceipt();

  }, [playerId]);


  // =========================================================
  // VIEW PDF
  // =========================================================

  const handleViewReceipt = async () => {

    if (!playerId) return;

    try {

      setPdfLoading(true);
      setError("");

      const response =
        await AdmissionReceiptService.getReceiptPdf(
          playerId
        );

      const blob = response.data;

      const objectUrl =
        URL.createObjectURL(blob);

      window.open(
        objectUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60000);

    } catch (err) {

      console.error(
        "Receipt view error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to open admission receipt."
      );

    } finally {
      setPdfLoading(false);
    }

  };


  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const handleDownloadReceipt = async () => {

    if (!playerId) return;

    try {

      setPdfLoading(true);
      setError("");

      const response =
        await AdmissionReceiptService.getReceiptPdf(
          playerId
        );

      const blob = response.data;

      const objectUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = objectUrl;

      link.download =
        `Yashree-Sports-Academy-Admission-Receipt-${playerId}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);

    } catch (err) {

      console.error(
        "Receipt download error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to download admission receipt."
      );

    } finally {
      setPdfLoading(false);
    }

  };


  // =========================================================
  // SEND WELCOME EMAIL + RECEIPT
  // =========================================================

  const handleSendEmail = async () => {

    if (!playerId) return;

    try {

      setEmailLoading(true);
      setEmailSuccess("");
      setError("");

      const response =
        await AdmissionReceiptService.sendWelcomeEmail(
          playerId
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to send welcome email."
        );
      }

      setEmailSuccess(
        response.message ||
        "Welcome message and admission receipt sent successfully."
      );

    } catch (err) {

      console.error(
        "Welcome email error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to send welcome message and receipt."
      );

    } finally {
      setEmailLoading(false);
    }

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="bg-slate-900 px-6 sm:px-8 py-6 text-white flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center">

              <CheckCircle2 className="w-7 h-7 text-emerald-400" />

            </div>

            <div>

              <h2 className="text-xl sm:text-2xl font-bold">
                Player Registered Successfully
              </h2>

              <p className="text-sm text-slate-300 mt-1">
                Admission receipt and welcome message
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

        </div>


        {/* ===================================================
            BODY
        =================================================== */}

        <div className="overflow-y-auto p-6 sm:p-8">

          {loading ? (

            <div className="py-16 flex flex-col items-center justify-center">

              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />

              <p className="text-sm text-slate-500 mt-4">
                Preparing admission receipt...
              </p>

            </div>

          ) : error ? (

            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>

          ) : receipt ? (

            <div className="space-y-6">

              {/* =================================================
                  SUCCESS MESSAGE
              ================================================= */}

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                <div className="flex items-start gap-3">

                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />

                  <div>

                    <p className="font-semibold text-emerald-800">
                      Admission completed successfully
                    </p>

                    <p className="text-sm text-emerald-700 mt-1">
                      The student has been registered successfully.
                      You can now view/download the receipt or send
                      the welcome message with the receipt PDF.
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  STUDENT SUMMARY
              ================================================= */}

              <div className="rounded-2xl border border-slate-200 overflow-hidden">

                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">

                  <div className="flex items-center gap-2">

                    <User className="w-5 h-5 text-blue-600" />

                    <h3 className="font-semibold text-slate-900">
                      Admission Summary
                    </h3>

                  </div>

                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                  <SummaryField
                    label="Student"
                    value={receipt.studentName}
                  />

                  <SummaryField
                    label="Sport"
                    value={receipt.sportName}
                  />

                  <SummaryField
                    label="Batch"
                    value={receipt.batchName}
                  />

                  <SummaryField
                    label="Admission Date"
                    value={formatDate(receipt.admissionDate)}
                  />

                </div>

              </div>


              {/* =================================================
                  FEE SUMMARY
              ================================================= */}

              <div className="rounded-2xl border border-slate-200 overflow-hidden">

                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">

                  <div className="flex items-center gap-2">

                    <CreditCard className="w-5 h-5 text-blue-600" />

                    <h3 className="font-semibold text-slate-900">
                      Fee Summary
                    </h3>

                  </div>

                </div>

                <div className="p-5 space-y-3 text-sm">

                  <FeeRow
                    label="Course Fee"
                    value={receipt.courseFee}
                  />

                  <FeeRow
                    label="Discount"
                    value={receipt.discount}
                    negative
                  />

                  <FeeRow
                    label="Course Fee After Discount"
                    value={receipt.courseFeeAfterDiscount}
                  />

                  <FeeRow
                    label="Inventory"
                    value={receipt.inventoryFee}
                  />

                  <div className="border-t border-slate-200 pt-4 flex justify-between">

                    <span className="font-bold text-slate-900">
                      Total Payable
                    </span>

                    <span className="font-bold text-xl text-blue-700">
                      ₹{money(receipt.totalPayable)}
                    </span>

                  </div>

                </div>

              </div>


              {/* =================================================
                  INVENTORY
              ================================================= */}

              {receipt.inventoryItems?.length > 0 && (

                <div className="rounded-2xl border border-slate-200 overflow-hidden">

                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">

                    <div className="flex items-center gap-2">

                      <Package className="w-5 h-5 text-blue-600" />

                      <h3 className="font-semibold text-slate-900">
                        Inventory Issued
                      </h3>

                    </div>

                  </div>

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead className="bg-slate-50">

                        <tr>

                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                            Item
                          </th>

                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                            Brand
                          </th>

                          <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                            Qty
                          </th>

                          <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                            Unit Price
                          </th>

                          <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                            Total
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {receipt.inventoryItems.map(
                          (item, index) => (

                            <tr key={index}>

                              <td className="px-5 py-3 font-medium text-slate-800">
                                {item.itemName || "—"}
                              </td>

                              <td className="px-5 py-3 text-slate-600">
                                {item.brand || "—"}
                              </td>

                              <td className="px-5 py-3 text-center text-slate-700">
                                {item.quantity || 0}
                              </td>

                              <td className="px-5 py-3 text-right text-slate-700">
                                ₹{money(item.unitPrice)}
                              </td>

                              <td className="px-5 py-3 text-right font-semibold text-slate-900">
                                ₹{money(item.totalPrice)}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              )}


              {/* =================================================
                  PAYMENT
              ================================================= */}

              <div className="rounded-2xl border border-slate-200 p-5">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Payment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                  <SummaryField
                    label="Payment Plan"
                    value={receipt.paymentPlan}
                  />

                  <SummaryField
                    label="Payment Method"
                    value={receipt.paymentMethod}
                  />

                  <SummaryField
                    label="Amount Paid"
                    value={`₹${money(receipt.amountPaid)}`}
                  />

                  <SummaryField
                    label="Payment Status"
                    value={receipt.paymentStatus}
                  />

                </div>

              </div>


              {/* =================================================
                  EMAIL SUCCESS
              ================================================= */}

              {emailSuccess && (

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">

                  <div className="flex items-start gap-3">

                    <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />

                    <div>

                      <p className="font-semibold text-emerald-800">
                        Email sent successfully
                      </p>

                      <p className="text-sm text-emerald-700 mt-1">
                        {emailSuccess}
                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>

          ) : null}

        </div>


        {/* ===================================================
            FOOTER ACTIONS
        =================================================== */}

        <div className="border-t border-slate-200 bg-white px-6 sm:px-8 py-5">

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={handleViewReceipt}
              disabled={
                loading ||
                !receipt ||
                pdfLoading
              }
              className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {pdfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}

              View Receipt

            </button>


            <button
              type="button"
              onClick={handleDownloadReceipt}
              disabled={
                loading ||
                !receipt ||
                pdfLoading
              }
              className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              <Download className="w-4 h-4" />

              Download Receipt

            </button>


            <button
              type="button"
              onClick={handleSendEmail}
              disabled={
                loading ||
                !receipt ||
                emailLoading
              }
              className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {emailLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Welcome + Receipt
                </>
              )}

            </button>

          </div>


          <button
            type="button"
            onClick={onContinue}
            className="w-full mt-3 h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
          >
            Continue to Player Management
          </button>

        </div>

      </div>

    </div>
  );
};


// =============================================================
// SUMMARY FIELD
// =============================================================

const SummaryField = ({
  label,
  value,
}) => (

  <div>

    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
      {label}
    </p>

    <p className="text-sm font-semibold text-slate-900 mt-1">
      {value || "—"}
    </p>

  </div>

);


// =============================================================
// FEE ROW
// =============================================================

const FeeRow = ({
  label,
  value,
  negative = false,
}) => (

  <div className="flex items-center justify-between">

    <span className="text-slate-500">
      {label}
    </span>

    <span
      className={
        negative && Number(value || 0) > 0
          ? "font-medium text-emerald-600"
          : "font-medium text-slate-800"
      }
    >
      ₹{money(value)}
    </span>

  </div>

);


export default AdmissionReceiptModal;