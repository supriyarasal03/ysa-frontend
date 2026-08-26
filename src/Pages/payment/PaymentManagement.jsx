import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock3,
  IndianRupee,
  X,
  CreditCard,
  Users,
  CalendarDays,
} from "lucide-react";

import PaymentService from "./PaymentService";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  // =========================================================
  // RESPONSE DATA
  // =========================================================

  const getData = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  // =========================================================
  // LOAD PAYMENTS
  // =========================================================

  const loadPayments = async () => {
    try {
      setLoading(true);

      const response =
        await PaymentService.getAll();

      setPayments(getData(response));
    } catch (error) {
      console.error(
        "Failed to load payments:",
        error
      );

      setPayments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
  };

  // =========================================================
  // STATUS
  // =========================================================

  const normalizeStatus = (value) => {
    return String(value || "").toUpperCase();
  };

  const isReceived = (payment) => {
    const value =
      normalizeStatus(payment.status);

    return (
      value === "RECEIVED" ||
      value === "COMPLETED" ||
      value === "SUCCESS" ||
      value === "PAID"
    );
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue =
        search.toLowerCase().trim();

      const playerName =
        String(
          payment.playerName || ""
        ).toLowerCase();

      const sportName =
        String(
          payment.sportName || ""
        ).toLowerCase();

      const batchName =
        String(
          payment.batchName || ""
        ).toLowerCase();

      const paymentId =
        String(payment.id || "");

      const matchesSearch =
        !searchValue ||
        playerName.includes(searchValue) ||
        sportName.includes(searchValue) ||
        batchName.includes(searchValue) ||
        paymentId.includes(searchValue);

      const paymentStatus =
        isReceived(payment)
          ? "RECEIVED"
          : "PENDING";

      const matchesStatus =
        status === "ALL" ||
        status === paymentStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [payments, search, status]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalPayments =
    payments.length;

  const receivedPayments =
    payments.filter(isReceived);

  const pendingPayments =
    payments.filter(
      (payment) => !isReceived(payment)
    );

  const receivedAmount =
    receivedPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );

  const pendingAmount =
    pendingPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );

  // =========================================================
  // VIEW PAYMENT
  // =========================================================

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };

  // =========================================================
  // MARK RECEIVED
  // =========================================================

  const handleMarkReceived = async (payment) => {
    try {
      await PaymentService.markAsReceived(
        payment.id
      );

      await loadPayments();
    } catch (error) {
      console.error(
        "Failed to mark payment received:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update payment."
      );
    }
  };

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw
            size={22}
            className="animate-spin"
          />
          <span>
            Loading payment details...
          </span>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-6 py-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start justify-between mb-7">

        <div>
          <h1 className="text-3xl font-bold text-[#10213f]">
            Payment Management
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage player payment transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-[#10213f] hover:bg-gray-50 transition"
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

        {/* TOTAL */}

        <SummaryCard
          icon={<CreditCard size={23} />}
          iconClass="bg-blue-50 text-blue-600"
          title="Total Payments"
          value={totalPayments}
        />

        {/* RECEIVED */}

        <SummaryCard
          icon={<CheckCircle2 size={23} />}
          iconClass="bg-green-50 text-green-600"
          title="Received"
          value={formatCurrency(
            receivedAmount
          )}
        />

        {/* PENDING */}

        <SummaryCard
          icon={<Clock3 size={23} />}
          iconClass="bg-orange-50 text-orange-600"
          title="Pending"
          value={formatCurrency(
            pendingAmount
          )}
        />

        {/* TRANSACTIONS */}

        <SummaryCard
          icon={<Users size={23} />}
          iconClass="bg-purple-50 text-purple-600"
          title="Transactions"
          value={payments.length}
        />

      </div>

      {/* =====================================================
          FILTER AREA
      ===================================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* SEARCH */}

            <div className="relative w-full lg:w-[520px]">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search player, sport, batch or payment ID..."
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* STATUS */}

            <div className="flex items-center gap-3">

              <label className="text-sm text-gray-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none bg-white focus:border-blue-500"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="RECEIVED">
                  Received
                </option>

                <option value="PENDING">
                  Pending
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        {filteredPayments.length === 0 ? (

          <div className="py-20 text-center">

            <CreditCard
              size={42}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No payments found
            </h3>

            <p className="text-gray-400 mt-1">
              Try changing your search or status filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead className="bg-[#f8fafc]">

                <tr className="text-left">

                  <TableHeader>
                    Payment
                  </TableHeader>

                  <TableHeader>
                    Player
                  </TableHeader>

                  <TableHeader>
                    Sport / Batch
                  </TableHeader>

                  <TableHeader>
                    Installment
                  </TableHeader>

                  <TableHeader>
                    Amount
                  </TableHeader>

                  <TableHeader>
                    Method
                  </TableHeader>

                  <TableHeader>
                    Date
                  </TableHeader>

                  <TableHeader>
                    Status
                  </TableHeader>

                  <TableHeader align="right">
                    Actions
                  </TableHeader>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredPayments.map(
                  (payment) => {

                    const received =
                      isReceived(payment);

                    return (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* PAYMENT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                              <IndianRupee
                                size={19}
                                className="text-blue-600"
                              />
                            </div>

                            <div>

                              <p className="font-semibold text-[#10213f]">
                                #{payment.id}
                              </p>

                              <p className="text-xs text-gray-400">
                                Enrollment #
                                {
                                  payment.playerEnrollmentId ||
                                  "-"
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PLAYER */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-[#10213f]">
                            {payment.playerName ||
                              "Unknown Player"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Player #
                            {payment.playerId ||
                              "-"}
                          </p>

                        </td>

                        {/* SPORT / BATCH */}

                        <td className="px-6 py-5">

                          <p className="text-gray-700">
                            {payment.sportName ||
                              "-"}
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            {payment.batchName ||
                              "-"}
                          </p>

                        </td>

                        {/* INSTALLMENT */}

                        <td className="px-6 py-5">

                          {payment.installmentNumber ? (

                            <div>

                              <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                Installment{" "}
                                {
                                  payment.installmentNumber
                                }
                              </span>

                              <p className="text-xs text-gray-400 mt-1">
                                #
                                {
                                  payment.installmentId ||
                                  "-"
                                }
                              </p>

                            </div>

                          ) : (

                            <span className="inline-flex px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                              One Time
                            </span>

                          )}

                        </td>

                        {/* AMOUNT */}

                        <td className="px-6 py-5">

                          <p className="font-bold text-[#10213f]">
                            {formatCurrency(
                              payment.amount
                            )}
                          </p>

                          {payment.remainingAmount !==
                            undefined && (

                            <p className="text-xs text-gray-400 mt-1">
                              Remaining:{" "}
                              {formatCurrency(
                                payment.remainingAmount
                              )}
                            </p>

                          )}

                        </td>

                        {/* METHOD */}

                        <td className="px-6 py-5">

                          <span className="text-gray-700">
                            {payment.paymentMethod ||
                              "-"}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-gray-600">

                            <CalendarDays
                              size={16}
                              className="text-gray-400"
                            />

                            {formatDate(
                              payment.paymentDate
                            )}

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          {received ? (

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">

                              <CheckCircle2
                                size={15}
                              />

                              Received

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">

                              <Clock3
                                size={15}
                              />

                              Pending

                            </span>

                          )}

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex justify-end items-center gap-2">

                            {/* VIEW */}

                            <button
                              type="button"
                              title="View payment"
                              onClick={() =>
                                handleViewPayment(
                                  payment
                                )
                              }
                              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition"
                            >
                              <Eye size={18} />
                            </button>

                            {/* MARK RECEIVED */}

                            {!received && (

                              <button
                                type="button"
                                onClick={() =>
                                  handleMarkReceived(
                                    payment
                                  )
                                }
                                className="px-3 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                              >
                                Mark Received
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================================
          PAYMENT DETAILS MODAL
      ===================================================== */}

      {detailsOpen &&
        selectedPayment && (

          <PaymentDetailsModal
            payment={selectedPayment}
            onClose={() => {
              setDetailsOpen(false);
              setSelectedPayment(null);
            }}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />

        )}

    </div>
  );
};

// =============================================================
// SUMMARY CARD
// =============================================================

const SummaryCard = ({
  icon,
  iconClass,
  title,
  value,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

      <div className="flex items-center gap-4">

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-[#10213f] mt-1">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};

// =============================================================
// TABLE HEADER
// =============================================================

const TableHeader = ({
  children,
  align = "left",
}) => {
  return (
    <th
      className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
};

// =============================================================
// PAYMENT DETAILS MODAL
// =============================================================

const PaymentDetailsModal = ({
  payment,
  onClose,
  formatCurrency,
  formatDate,
}) => {
  const received =
    String(payment.status || "")
      .toUpperCase() === "RECEIVED" ||
    String(payment.status || "")
      .toUpperCase() === "COMPLETED" ||
    String(payment.status || "")
      .toUpperCase() === "PAID" ||
    String(payment.status || "")
      .toUpperCase() === "SUCCESS";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">

          <div>

            <h2 className="text-xl font-bold text-[#10213f]">
              Payment Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Transaction #{payment.id}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>

        </div>

        {/* CONTENT */}

        <div className="p-7">

          {/* PLAYER */}

          <div className="bg-blue-50 rounded-2xl p-5 mb-6">

            <p className="text-sm text-gray-500">
              Player
            </p>

            <p className="text-xl font-bold text-[#10213f] mt-1">
              {payment.playerName ||
                "Unknown Player"}
            </p>

            <p className="text-gray-600 mt-1">
              {payment.sportName || "-"}
              {" • "}
              {payment.batchName || "-"}
            </p>

          </div>

          {/* DETAILS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <DetailItem
              label="Payment Amount"
              value={formatCurrency(
                payment.amount
              )}
            />

            <DetailItem
              label="Payment Method"
              value={
                payment.paymentMethod ||
                "-"
              }
            />

            <DetailItem
              label="Payment Date"
              value={formatDate(
                payment.paymentDate
              )}
            />

            <DetailItem
              label="Enrollment"
              value={`#${payment.playerEnrollmentId || "-"}`}
            />

            <DetailItem
              label="Fee Structure"
              value={`#${payment.feeStructureId || "-"}`}
            />

            <DetailItem
              label="Duration"
              value={
                payment.duration
                  ? `${payment.duration} ${
                      payment.durationUnit || ""
                    }`
                  : "-"
              }
            />

            <DetailItem
              label="Installment"
              value={
                payment.installmentNumber
                  ? `Installment ${payment.installmentNumber}`
                  : "One Time"
              }
            />

            <DetailItem
              label="Remaining Amount"
              value={formatCurrency(
                payment.remainingAmount
              )}
            />

          </div>

          {/* STATUS */}

          <div className="mt-6 p-4 rounded-xl border border-gray-200 flex items-center justify-between">

            <span className="font-semibold text-gray-700">
              Payment Status
            </span>

            {received ? (

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 font-medium">
                <CheckCircle2 size={16} />
                Received
              </span>

            ) : (

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 font-medium">
                <Clock3 size={16} />
                Pending
              </span>

            )}

          </div>

          {/* UPI SCREENSHOT */}

          {payment.upiScreenshotUrl && (

            <div className="mt-6">

              <h3 className="font-semibold text-gray-700 mb-3">
                UPI Screenshot
              </h3>

              <img
                src={payment.upiScreenshotUrl}
                alt="UPI Payment"
                className="max-h-72 rounded-xl border border-gray-200 object-contain"
              />

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

// =============================================================
// DETAIL ITEM
// =============================================================

const DetailItem = ({
  label,
  value,
}) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4">

      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="font-semibold text-gray-800 mt-2">
        {value}
      </p>

    </div>
  );
};

export default PaymentManagement;