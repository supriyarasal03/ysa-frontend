import React, { useEffect, useState } from "react";
import { getMyHistoryBatches } from "./CoachService";

const HistoryBatches = () => {

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // FETCH HISTORY BATCHES
  // =========================================================

  const fetchHistoryBatches = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getMyHistoryBatches();

      setBatches(
        response?.data ?? []
      );

    } catch (error) {

      console.error(
        "Failed to fetch history batches:",
        error
      );

      setError(
        error?.message ||
        "Failed to load history batches."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // LOAD ON PAGE OPEN
  // =========================================================

  useEffect(() => {

    fetchHistoryBatches();

  }, []);


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {

    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    const date =
      new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100%",
          padding: "30px",
          background: "#f8fafc",
        }}
      >

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                fontSize: "16px",
                color: "#64748b",
              }}
            >
              Loading history batches...
            </div>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div
        style={{
          minHeight: "100%",
          padding: "30px",
          background: "#f8fafc",
        }}
      >

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#dc2626",
                marginBottom: "10px",
              }}
            >
              Unable to load history batches
            </div>

            <div
              style={{
                color: "#64748b",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>

            <button
              type="button"
              onClick={fetchHistoryBatches}
              style={{
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "30px",
        background: "#f8fafc",
      }}
    >

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              History Batches
            </h1>

            <p
              style={{
                margin:
                  "8px 0 0",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              View your completed batches and their history.
            </p>

          </div>


          {/* =================================================
              TOTAL COUNT
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#ffffff",
              padding: "12px 18px",
              borderRadius: "10px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >

            <span
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Completed Batches
            </span>

            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              {batches.length}
            </span>

          </div>

        </div>


        {/* =================================================
            NO HISTORY
        ================================================= */}

        {batches.length === 0 ? (

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "60px 30px",
              textAlign: "center",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              📚
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "20px",
                color: "#0f172a",
              }}
            >
              No History Batches
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
              }}
            >
              You don't have any completed batches yet.
            </p>

          </div>

        ) : (

          /* =================================================
             BATCH GRID
          ================================================= */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >

            {batches.map((batch) => (

              <div
                key={batch.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "22px",
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.06)",
                  border:
                    "1px solid #e2e8f0",
                }}
              >

                {/* =================================================
                    BATCH HEADER
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize: "19px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {batch.batchName || "Unnamed Batch"}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      Batch ID: #{batch.id}
                    </div>

                  </div>


                  {/* =================================================
                      COMPLETED STATUS
                  ================================================= */}

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: "20px",
                      background: "#dcfce7",
                      color: "#166534",
                      fontSize: "12px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}
                  >
                    COMPLETED
                  </span>

                </div>


                {/* =================================================
                    BATCH DETAILS
                ================================================= */}

                <div
                  style={{
                    display: "grid",
                    gap: "14px",
                  }}
                >

                  {/* SPORT */}

                  <div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Sport
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#334155",
                      }}
                    >
                      {batch.sportName || "-"}
                    </div>

                  </div>


                  {/* DATE */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "15px",
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          marginBottom: "4px",
                        }}
                      >
                        Start Date
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#334155",
                        }}
                      >
                        {formatDate(
                          batch.startDate
                        )}
                      </div>

                    </div>


                    <div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          marginBottom: "4px",
                        }}
                      >
                        End Date
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#334155",
                        }}
                      >
                        {formatDate(
                          batch.endDate
                        )}
                      </div>

                    </div>

                  </div>


                  {/* TIME */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "15px",
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          marginBottom: "4px",
                        }}
                      >
                        Training Time
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#334155",
                        }}
                      >
                        {formatTime(
                          batch.startTime
                        )}{" "}
                        -{" "}
                        {formatTime(
                          batch.endTime
                        )}
                      </div>

                    </div>

                  </div>


                  {/* TRAINING DAYS */}

                  <div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginBottom: "4px",
                      }}
                    >
                      Training Days
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#334155",
                      }}
                    >
                      {batch.trainingDays || "-"}
                    </div>

                  </div>

                </div>


                {/* =================================================
                    VIEW STUDENTS
                    Will be connected in next step
                ================================================= */}

                <button
                  type="button"
                  disabled
                  style={{
                    width: "100%",
                    marginTop: "22px",
                    padding: "11px 16px",
                    border: "none",
                    borderRadius: "9px",
                    background: "#e2e8f0",
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "not-allowed",
                  }}
                >
                  View Students
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default HistoryBatches;