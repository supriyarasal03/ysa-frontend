import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

import {
  addBatch,
  updateBatch,
  getBatchById,
  getSports,
  getAvailableCoaches,
} from "./batchService";

const DAYS = [
  { key: "MONDAY", label: "Mon" },
  { key: "TUESDAY", label: "Tue" },
  { key: "WEDNESDAY", label: "Wed" },
  { key: "THURSDAY", label: "Thu" },
  { key: "FRIDAY", label: "Fri" },
  { key: "SATURDAY", label: "Sat" },
  { key: "SUNDAY", label: "Sun" },
];

const INITIAL_FORM = {
  batchName: "",
  sportId: "",
  coachId: "",
  startHour: "",
  startPeriod: "AM",
  endHour: "",
  endPeriod: "AM",
  trainingDays: [],
  capacity: "",
};

export default function BatchForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM);

  const [sports, setSports] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");


  const [loadingCoaches, setLoadingCoaches] =
  useState(false);

  // ==========================================================
  // HELPERS
  // ==========================================================

  const getSportStatus = (sport) =>
    String(
      sport?.status ??
        sport?.Status ??
        ""
    )
      .trim()
      .toUpperCase();

  const getCoachStatus = (coach) =>
    String(
      coach?.status ??
        coach?.Status ??
        coach?.user?.status ??
        coach?.user?.Status ??
        ""
    )
      .trim()
      .toUpperCase();

  /*
   * Supports:
   * coach.sport.id
   * coach.sportId
   * coach.sports.id
   * coach.sportsId
   */
 const getCoachSportId = (coach) =>
  coach?.sportId ?? null;

  const getCoachName = (coach) => {
    if (coach?.name) return coach.name;
    if (coach?.fullName) return coach.fullName;

    const firstName =
      coach?.firstName ??
      coach?.user?.firstName ??
      "";

    const lastName =
      coach?.lastName ??
      coach?.user?.lastName ??
      "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    if (fullName) return fullName;

    return coach?.username || "Coach";
  };

  const getSportName = (sport) =>
    sport?.sportsName ??
    sport?.sportName ??
    sport?.name ??
    "Sport";

  const activeSports = useMemo(() => {
    return sports.filter((sport) => {
      const status = getSportStatus(sport);

      // If backend does not return status, keep it visible.
      return !status || status === "ACTIVE";
    });
  }, [sports]);

  const selectedSportId = formData.sportId;

 const loadAvailableCoaches = async () => {
  if (
    !formData.sportId ||
    !formData.startHour ||
    !formData.endHour ||
    formData.trainingDays.length === 0
  ) {
    setCoaches([]);
    setFormData((prev) => ({
      ...prev,
      coachId: "",
    }));
    return;
  }

  const startTime = toLocalTime(
    formData.startHour,
    formData.startPeriod
  );

  const endTime = toLocalTime(
    formData.endHour,
    formData.endPeriod
  );

  if (!startTime || !endTime) {
    return;
  }

  const startMinutes = getTimeMinutes(
    formData.startHour,
    formData.startPeriod
  );

  const endMinutes = getTimeMinutes(
    formData.endHour,
    formData.endPeriod
  );

  if (startMinutes >= endMinutes) {
    setCoaches([]);
    setFormData((prev) => ({
      ...prev,
      coachId: "",
    }));
    return;
  }

  try {
    setLoadingCoaches(true);

    const response =
      await getAvailableCoaches({
        sportId: Number(formData.sportId),
        startTime,
        endTime,
        trainingDays:
          formData.trainingDays.join(","),
        excludeBatchId: isEdit
          ? Number(id)
          : null,
      });

    const list =
      Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

    setCoaches(list);

    // Clear selected coach because the
    // available list has changed.
    setFormData((prev) => ({
      ...prev,
      coachId: "",
    }));
  } catch (error) {
    console.error(
      "Failed to load available coaches:",
      error
    );

    setCoaches([]);

    setErrors((prev) => ({
      ...prev,
      coachId:
        error.message ||
        "Failed to load available coaches.",
    }));
  } finally {
    setLoadingCoaches(false);
  }
};





useEffect(() => {
  if (fetching) return;

  const timer = setTimeout(() => {
    loadAvailableCoaches();
  }, 300);

  return () => clearTimeout(timer);
}, [
  formData.sportId,
  formData.startHour,
  formData.startPeriod,
  formData.endHour,
  formData.endPeriod,
  formData.trainingDays,
]);




  // ==========================================================
  // LOAD SPORTS + COACHES
  // ==========================================================
useEffect(() => {
  const loadSports = async () => {
    try {
      setErrors({});

      const sportResponse = await getSports();

      const sportList =
        Array.isArray(sportResponse?.data)
          ? sportResponse.data
          : Array.isArray(sportResponse)
          ? sportResponse
          : [];

      setSports(sportList);

      // Do NOT load all coaches here.
      // Coaches will be loaded only after:
      // Sport + Time + Training Days are selected.
      setCoaches([]);
    } catch (error) {
      console.error(
        "Failed to load sports:",
        error
      );

      setErrors({
        general:
          error.message ||
          "Failed to load sports. Please refresh.",
      });
    }
  };

  loadSports();
}, []);








  // ==========================================================
  // LOAD BATCH FOR EDIT
  // ==========================================================

  useEffect(() => {
    if (!isEdit) {
      setFetching(false);
      return;
    }

    const loadBatch = async () => {
      try {
        setFetching(true);

        const response =
          await getBatchById(id);

        const batch =
          response?.data || response;

        if (!batch) {
          throw new Error(
            "Batch not found."
          );
        }

        const parseTime = (timeString) => {
          if (!timeString) {
            return {
              hour: "",
              period: "AM",
            };
          }

          const [hourValue] =
            String(timeString)
              .split(":")
              .map(Number);

          const period =
            hourValue >= 12
              ? "PM"
              : "AM";

          let hour =
            hourValue % 12;

          if (hour === 0) {
            hour = 12;
          }

          return {
            hour: String(hour),
            period,
          };
        };

        const normalizeDays = (
          value
        ) => {
          if (!value) return [];

          const shortToFull = {
            MON: "MONDAY",
            TUE: "TUESDAY",
            WED: "WEDNESDAY",
            THU: "THURSDAY",
            FRI: "FRIDAY",
            SAT: "SATURDAY",
            SUN: "SUNDAY",
          };

          return String(value)
            .split(",")
            .map((day) =>
              day.trim().toUpperCase()
            )
            .filter(Boolean)
            .map(
              (day) =>
                shortToFull[day] || day
            );
        };

        const start =
          parseTime(batch.startTime);

        const end =
          parseTime(batch.endTime);

        setFormData({
          batchName:
            batch.batchName || "",

          sportId:
            batch.sportId != null
              ? String(batch.sportId)
              : "",

          coachId:
            batch.coachId != null
              ? String(batch.coachId)
              : "",

          startHour: start.hour,
          startPeriod: start.period,

          endHour: end.hour,
          endPeriod: end.period,

          trainingDays:
            normalizeDays(
              batch.trainingDays
            ),

          capacity:
            batch.capacity != null
              ? String(batch.capacity)
              : "",
        });
      } catch (error) {
        console.error(
          "Failed to load batch:",
          error
        );

        setErrors({
          general:
            error.message ||
            "Failed to load batch.",
        });
      } finally {
        setFetching(false);
      }
    };

    loadBatch();
  }, [id, isEdit]);

  // ==========================================================
  // SUCCESS MESSAGE
  // ==========================================================

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    if (name === "capacity") {
      if (
        value === "" ||
        /^\d+$/.test(value)
      ) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));

        setErrors((prev) => ({
          ...prev,
          capacity: "",
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));

    // Sport controls the coach dropdown.
    if (name === "sportId") {
      setFormData((prev) => ({
        ...prev,
        sportId: value,
        coachId: "",
      }));

      setErrors((prev) => ({
        ...prev,
        sportId: "",
        coachId: "",
        general: "",
      }));
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists =
        prev.trainingDays.includes(day);

      return {
        ...prev,
        trainingDays: exists
          ? prev.trainingDays.filter(
              (item) => item !== day
            )
          : [
              ...prev.trainingDays,
              day,
            ],
      };
    });

    setErrors((prev) => ({
      ...prev,
      trainingDays: "",
      general: "",
    }));
  };

  // ==========================================================
  // TIME HELPERS
  // ==========================================================

  const to24Hour = (
    hour,
    period
  ) => {
    let value = Number(hour);

    if (period === "PM" && value !== 12) {
      value += 12;
    }

    if (period === "AM" && value === 12) {
      value = 0;
    }

    return value;
  };

  const toLocalTime = (
    hour,
    period
  ) => {
    if (!hour) return null;

    const value =
      to24Hour(hour, period);

    return `${String(value).padStart(
      2,
      "0"
    )}:00:00`;
  };

  const getTimeMinutes = (
    hour,
    period
  ) => {
    if (!hour) return null;

    return (
      to24Hour(hour, period) * 60
    );
  };

  // ==========================================================
  // FRONTEND VALIDATION
  // ==========================================================

  const validate = () => {
    const newErrors = {};





    if (!formData.sportId) {
      newErrors.sportId =
        "Sport is required.";
    }

    if (!formData.coachId) {
      newErrors.coachId =
        "Coach is required.";
    }

    if (!formData.startHour) {
      newErrors.startTime =
        "Start time is required.";
    }

    if (!formData.endHour) {
      newErrors.endTime =
        "End time is required.";
    }

    if (
      formData.startHour &&
      formData.endHour
    ) {
      const startMinutes =
        getTimeMinutes(
          formData.startHour,
          formData.startPeriod
        );

      const endMinutes =
        getTimeMinutes(
          formData.endHour,
          formData.endPeriod
        );

      if (
        startMinutes >= endMinutes
      ) {
        newErrors.endTime =
          "End time must be after start time.";
      }
    }

    if (
      formData.trainingDays.length === 0
    ) {
      newErrors.trainingDays =
        "Select at least one training day.";
    }

    if (!formData.capacity) {
      newErrors.capacity =
        "Capacity is required.";
    } else {
      const capacity =
        Number(formData.capacity);

      if (capacity < 1) {
        newErrors.capacity =
          "Capacity must be at least 1.";
      } else if (capacity > 500) {
        newErrors.capacity =
          "Capacity cannot exceed 500.";
      }
    }

    // Frontend safety check:
    // selected coach must belong to selected sport.
    if (
      formData.sportId &&
      formData.coachId
    ) {
      const selectedCoach =
        coaches.find(
          (coach) =>
            String(coach.id) ===
            String(formData.coachId)
        );

      const coachSportId =
        getCoachSportId(
          selectedCoach
        );

      if (
        coachSportId == null ||
        String(coachSportId) !==
          String(formData.sportId)
      ) {
        newErrors.coachId =
          "Selected coach is not assigned to this sport.";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    setErrors((prev) => ({
      ...prev,
      general: "",
    }));
const payload = {
  sportId: Number(formData.sportId),

  coachId: Number(formData.coachId),

  startTime: toLocalTime(
    formData.startHour,
    formData.startPeriod
  ),

  endTime: toLocalTime(
    formData.endHour,
    formData.endPeriod
  ),

  trainingDays:
    formData.trainingDays.join(","),

  capacity: Number(formData.capacity),
};


    try {
      if (isEdit) {
        await updateBatch(
          id,
          payload
        );

        setSuccessMessage(
          "Batch updated successfully."
        );
      } else {
        await addBatch(payload);

        setSuccessMessage(
          "Batch created successfully."
        );

        // Empty form after successful creation.
        setFormData({
          ...INITIAL_FORM,
        });

        setErrors({});
      }
    } catch (error) {
      console.error(
        "Batch save error:",
        error
      );

      const responseData =
        error?.response?.data || {};

      const backendMessage =
        responseData?.message ||
        error?.message ||
        "Something went wrong.";

      const fieldErrors =
        error?.data &&
        typeof error.data === "object" &&
        !Array.isArray(error.data)
          ? error.data
          : responseData?.data &&
            typeof responseData.data ===
              "object" &&
            !Array.isArray(
              responseData.data
            )
          ? responseData.data
          : null;

      if (
        fieldErrors &&
        Object.keys(fieldErrors).length
      ) {
        const mapped = {};

        Object.entries(
          fieldErrors
        ).forEach(
          ([field, message]) => {
            if (
              typeof message ===
              "string"
            ) {
              mapped[field] =
                message;
            }
          }
        );

        setErrors({
          ...mapped,
          general:
            mapped.general ||
            backendMessage,
        });
      } else {
        setErrors({
          general:
            backendMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // ERROR TEXT
  // ==========================================================

  const ErrorText = ({
    name,
  }) => {
    if (!errors[name]) {
      return null;
    }

    return (
      <p className="mt-1.5 text-sm text-red-600">
        {errors[name]}
      </p>
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />

          <p className="mt-3 text-sm text-slate-500">
            Loading batch data...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-slate-900 text-white rounded-t-2xl px-6 md:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              {isEdit
                ? "Edit Batch"
                : "Create New Batch"}
            </h1>

            <p className="text-slate-300 text-xs md:text-sm mt-1">
              Yashree Sports Academy
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/batch-managmnet"
              )
            }
            className="p-2 rounded-lg hover:bg-white/10 transition"
            title="Close"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-2xl shadow-sm"
        >

          {/* GENERAL ERROR */}
          {errors.general && (
            <div className="mx-6 md:mx-8 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errors.general}
            </div>
          )}

          {/* ==================================================
              1. BATCH INFORMATION
              ================================================== */}
          <section className="p-6 md:p-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                1
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  BATCH INFORMATION
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Basic details of the training batch
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* BATCH NAME */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  BATCH NAME{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

              <input
  type="text"
  name="batchName"
  value={formData.batchName || "Automatically generated"}
  readOnly
  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600"
/>

<p className="mt-1.5 text-xs text-slate-400">
  Batch name will be generated automatically based on the selected sport.
</p>
                <ErrorText name="batchName" />
              </div>

              {/* SPORT */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  SPORT{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="sportId"
                  value={formData.sportId}
                  onChange={handleChange}
                  className={`w-full h-11 px-4 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.sportId
                      ? "border-red-500"
                      : "border-slate-200"
                  }`}
                >
                  <option value="">
                    Select Sport
                  </option>

                  {activeSports.map(
                    (sport) => (
                      <option
                        key={sport.id}
                        value={sport.id}
                      >
                        {getSportName(
                          sport
                        )}
                      </option>
                    )
                  )}
                </select>

                <ErrorText name="sportId" />
              </div>

              {/* COACH */}



<div>
  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
    COACH{" "}
    <span className="text-red-500">*</span>
  </label>

  <select
    name="coachId"
    value={formData.coachId}
    onChange={handleChange}
    disabled={
      !formData.sportId ||
      !formData.startHour ||
      !formData.endHour ||
      formData.trainingDays.length === 0 ||
      loadingCoaches
    }
    className={`w-full h-11 px-4 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-400 ${
      errors.coachId
        ? "border-red-500"
        : "border-slate-200"
    }`}
  >
    <option value="">
      {loadingCoaches
        ? "Finding available coaches..."
        : !formData.sportId
        ? "Select Sport First"
        : !formData.startHour ||
          !formData.endHour
        ? "Select Time First"
        : formData.trainingDays.length === 0
        ? "Select Training Days First"
        : coaches.length === 0
        ? "No Coach Available"
        : "Select Coach"}
    </option>

    {coaches.map((coach) => (
      <option
        key={coach.id}
        value={coach.id}
      >
        {getCoachName(coach)}
      </option>
    ))}
  </select>

  <p className="mt-1.5 text-xs text-slate-400">
    Only coaches available for the selected
    sport, days and time are shown.
  </p>

  <ErrorText name="coachId" />
</div>
            </div>




          </section>




          

          {/* ==================================================
              2. BATCH SCHEDULE
              ================================================== */}
          <section className="border-t border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                2
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  BATCH SCHEDULE
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Set training time and days
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* START TIME */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  START TIME{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="flex gap-2">
                  <select
                    name="startHour"
                    value={formData.startHour}
                    onChange={handleChange}
                    className={`flex-1 h-11 px-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.startTime
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">
                      Hour
                    </option>

                    {Array.from(
                      { length: 12 },
                      (_, index) =>
                        index + 1
                    ).map((hour) => (
                      <option
                        key={hour}
                        value={hour}
                      >
                        {hour}
                      </option>
                    ))}
                  </select>

                  <select
                    name="startPeriod"
                    value={formData.startPeriod}
                    onChange={handleChange}
                    className="w-24 h-11 px-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="AM">
                      AM
                    </option>
                    <option value="PM">
                      PM
                    </option>
                  </select>
                </div>

                <ErrorText name="startTime" />
              </div>

              {/* END TIME */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  END TIME{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="flex gap-2">
                  <select
                    name="endHour"
                    value={formData.endHour}
                    onChange={handleChange}
                    className={`flex-1 h-11 px-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.endTime
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">
                      Hour
                    </option>

                    {Array.from(
                      { length: 12 },
                      (_, index) =>
                        index + 1
                    ).map((hour) => (
                      <option
                        key={hour}
                        value={hour}
                      >
                        {hour}
                      </option>
                    ))}
                  </select>

                  <select
                    name="endPeriod"
                    value={formData.endPeriod}
                    onChange={handleChange}
                    className="w-24 h-11 px-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="AM">
                      AM
                    </option>
                    <option value="PM">
                      PM
                    </option>
                  </select>
                </div>

                <ErrorText name="endTime" />
              </div>
            </div>

            {/* TRAINING DAYS */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                TRAINING DAYS{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const selected =
                    formData.trainingDays.includes(
                      day.key
                    );

                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() =>
                        toggleDay(
                          day.key
                        )
                      }
                      className={`min-w-[58px] px-4 py-2.5 rounded-xl text-sm font-semibold transition border ${
                        selected
                          ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-sky-400 hover:bg-sky-50"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Select one or more days for this batch.
              </p>

              <ErrorText name="trainingDays" />
            </div>
          </section>

          {/* ==================================================
              3. CAPACITY
              ================================================== */}
          <section className="border-t border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                3
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  BATCH CAPACITY
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Set the maximum number of players
                </p>
              </div>
            </div>

            <div className="mt-6 max-w-sm">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                MAXIMUM PLAYERS{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                inputMode="numeric"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                maxLength={3}
                placeholder="e.g. 25"
                className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.capacity
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Minimum 1 player and maximum 500 players.
              </p>

              <ErrorText name="capacity" />
            </div>
          </section>

          {/* SUCCESS */}
          {successMessage && (
            <div className="mx-6 md:mx-8 mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {/* BUTTONS */}
          <div className="border-t border-slate-100 px-6 md:px-8 py-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/batch-managmnet"
                )
              }
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  {isEdit
                    ? "Updating Batch..."
                    : "Creating Batch..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 inline mr-2" />
                  {isEdit
                    ? "Update Batch"
                    : "Create Batch"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
