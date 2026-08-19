import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Upload,
  X,
  User,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
   CheckCircle,
  CreditCard,
  QrCode,
  Loader2,
} from "lucide-react";

import PlayerService from "./PlayerService";
import PaymentService from "../payment/PaymentService";
import axiosClient from "../../api/axiosClient";

const bloodGroups = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
];

const genders = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

const initialForm = {
  username: "",

  password: "",
  confirmPassword: "",
  sportId: "",
  batchId: "",
  feeStructureId: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  address: "",
  playerMobileNo: "",
  playerEmail: "",
  parentName: "",
  parentMobileNo: "",
  parentEmail: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  hasInjury: false,
  injuryDetails: "",
  photoCaptureType: "UPLOADED",
};

const initialFiles = {
  photo: null,
  aadhaarFront: null,
  aadhaarBack: null,
  panCard: null,
  certificate: null,
};

const initialPreviews = {
  photo: null,
  aadhaarFront: null,
  aadhaarBack: null,
  panCard: null,
  certificate: null,
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getAge = (dob) => {
  if (!dob) return null;

  const today = new Date();
  const birth = new Date(dob);

  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

const unwrapList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.content)) return response.data.content;
  if (Array.isArray(response?.content)) return response.content;
  return [];
};

const getFeeId = (fee) =>
  fee?.id ??
  fee?.feeStructureId ??
  fee?.data?.id;

const getFeeSportId = (fee) =>
  fee?.sportId ??
  fee?.sport?.id ??
  fee?.sport?.sportId ??
  fee?.data?.sportId;

const getFeeDurationText = (fee) => {
  const unit = String(fee?.durationUnit || "")
    .replaceAll("_", " ")
    .toUpperCase();

  return `${fee?.duration ?? ""} ${unit}`;
};

const getSportId = (sport) =>
  sport?.id ??
  sport?.sportId ??
  sport?.sportsId ??
  sport?.data?.id;

const getSportName = (sport) =>
  sport?.name ||
  sport?.sportName ||
  sport?.sportsName ||
  sport?.title ||
  (typeof sport?.sport === "string" ? sport.sport : sport?.sport?.name) ||
  sport?.data?.name ||
  sport?.data?.sportName ||
  `Sport #${getSportId(sport) ?? ""}`;

const getBatchName = (batch) =>
  batch?.batchName ||
  batch?.name ||
  `Batch #${batch?.id}`;

const PlayerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState(initialFiles);
  const [previews, setPreviews] = useState(initialPreviews);

  const [sports, setSports] = useState([]);
  const [batches, setBatches] = useState([]);
  const [fees, setFees] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Registration flow:
  // PLAYER -> PAYMENT
  const [step, setStep] = useState("PLAYER");

  const [createdPlayer, setCreatedPlayer] = useState(null);
  const [createdEnrollment, setCreatedEnrollment] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(null);

  const [paymentPlan, setPaymentPlan] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [upiScreenshot, setUpiScreenshot] = useState(null);

  const age = getAge(form.dateOfBirth);
  const isAdult = age !== null && age >= 18;

  // =========================================================
  // LOAD SPORTS + BATCHES
  // =========================================================

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);

        const [sportsResponse, batchesResponse] =
          await Promise.all([
            axiosClient.get("/sport"),
            axiosClient.get("/batches"),
          ]);

        const sportList = unwrapList(sportsResponse.data);
        const batchList = unwrapList(batchesResponse.data);

        setSports(sportList);
        setBatches(batchList);

        if (isEdit) {
          const playerResponse =
            await PlayerService.getById(id);

          const player =
            playerResponse?.data || playerResponse;

          if (player) {
            setForm((prev) => ({
              ...prev,
              username: player.username || "",
          
              sportId: player.sportId || "",
              firstName: player.firstName || "",
              lastName: player.lastName || "",
              dateOfBirth: player.dateOfBirth
                ? String(player.dateOfBirth).slice(0, 10)
                : "",
              gender: player.gender || "",
              bloodGroup: player.bloodGroup || "",
              address: player.address || "",
              playerMobileNo: player.playerMobileNo || "",
              playerEmail: player.playerEmail || "",
              parentName: player.parentName || "",
              parentMobileNo: player.parentMobileNo || "",
              parentEmail: player.parentEmail || "",
              admissionDate: player.admissionDate
                ? String(player.admissionDate).slice(0, 10)
                : prev.admissionDate,
              hasInjury: Boolean(player.hasInjury),
              injuryDetails: player.injuryDetails || "",
              photoCaptureType:
                player.photoCaptureType || "UPLOADED",
            }));
          }
        }
      } catch (error) {
        console.error("Player form load error:", error);
        setBackendErrors({
          general:
            error.response?.data?.message ||
            "Unable to load sports/batches.",
        });
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [id, isEdit]);

  // =========================================================
  // LOAD ALL ACTIVE FEES FOR SELECTED SPORT
  // =========================================================

  useEffect(() => {
    const loadFees = async () => {
      if (!form.sportId) {
        setFees([]);
        return;
      }

      try {
        setBackendErrors((prev) => ({
          ...prev,
          general: "",
        }));

        const response = await axiosClient.get(
          `/fee/sport/${form.sportId}`
        );

        let list = unwrapList(response?.data);

        // Fallback in case the sport-specific endpoint
        // returns an incomplete list.
        if (list.length < 2) {
          try {
            const allResponse = await axiosClient.get(
              "/fee",
              { params: { status: "ACTIVE" } }
            );

            const allFees = unwrapList(allResponse?.data);

            const sportFees = allFees.filter(
              (fee) =>
                String(getFeeSportId(fee)) ===
                String(form.sportId)
            );

            if (sportFees.length > list.length) {
              list = sportFees;
            }
          } catch (fallbackError) {
            console.warn(
              "Fee fallback request failed:",
              fallbackError
            );
          }
        }

        const activeFees = list
          .filter((fee) => {
            const status = String(
              fee?.status || ""
            ).toUpperCase();

            return !status || status === "ACTIVE";
          })
          .filter((fee) => {
            const feeSportId = getFeeSportId(fee);

            return (
              feeSportId == null ||
              String(feeSportId) ===
                String(form.sportId)
            );
          })
          .sort((a, b) => {
            return (
              Number(a?.duration || 0) -
              Number(b?.duration || 0)
            );
          });

        setFees(activeFees);

        setForm((prev) => {
          const stillExists = activeFees.some(
            (fee) =>
              String(getFeeId(fee)) ===
              String(prev.feeStructureId)
          );

          return stillExists
            ? prev
            : {
                ...prev,
                feeStructureId: "",
              };
        });
      } catch (error) {
        console.error("Fee load error:", error);
        setFees([]);
        setBackendErrors((prev) => ({
          ...prev,
          general:
            error.response?.data?.message ||
            "Unable to load fee structures.",
        }));
      }
    };

    loadFees();
  }, [form.sportId]);

  // =========================================================
  // DERIVED DATA
  // =========================================================

  const availableBatches = useMemo(() => {
    return batches.filter((batch) => {
      const sameSport =
        String(batch.sportId) === String(form.sportId);

      const active =
        !batch.status ||
        String(batch.status).toUpperCase() === "ACTIVE";

      const seats =
        Number(batch.availableSeats ?? 0);

      return sameSport && active && seats > 0;
    });
  }, [batches, form.sportId]);

  const selectedBatch = availableBatches.find(
    (batch) =>
      String(batch.id) === String(form.batchId)
  );

  const selectedFee = fees.find(
    (fee) =>
      String(getFeeId(fee)) ===
      String(form.feeStructureId)
  );

  // =========================================================
  // FIELD CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue = value;

    // Names: letters and spaces only.
    if (["firstName", "lastName", "parentName"].includes(name)) {
      finalValue = value.replace(/[^A-Za-z ]/g, "").replace(/\s{2,}/g, " ");
    }

    // Mobile numbers: digits only, maximum 10 digits.
    if (["playerMobileNo", "parentMobileNo"].includes(name)) {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Username follows the backend pattern: letters, numbers, dot, underscore.
    if (name === "username") {
      finalValue = value.replace(/[^A-Za-z0-9._]/g, "").slice(0, 20);
    }

    // Emails: no spaces and keep a reasonable length.
    if (["playerEmail", "parentEmail"].includes(name)) {
      finalValue = value.replace(/\s/g, "").slice(0, 100);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : finalValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setBackendErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMessage("");
  };

  const handleSportChange = (e) => {
    const sportId = e.target.value;

    setForm((prev) => ({
      ...prev,
      sportId,
      batchId: "",
      feeStructureId: "",
    }));

    setFees([]);
    setPaymentPlan("");
    setPaymentMethod("");
    setPaymentAmount("");
    setInstallments([]);
    setSelectedInstallment(null);
    setQrData(null);
    setUpiScreenshot(null);

    setErrors((prev) => ({
      ...prev,
      sportId: "",
      batchId: "",
      feeStructureId: "",
    }));
  };

  const handleBatchChange = (e) => {
    setForm((prev) => ({
      ...prev,
      batchId: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      batchId: "",
    }));
  };

  const handleFeeChange = (e) => {
    setForm((prev) => ({
      ...prev,
      feeStructureId: e.target.value,
    }));

    setPaymentPlan("");
    setPaymentMethod("");
    setPaymentAmount("");
    setInstallments([]);
    setSelectedInstallment(null);
    setQrData(null);
    setUpiScreenshot(null);

    setErrors((prev) => ({
      ...prev,
      feeStructureId: "",
    }));
  };

  // =========================================================
  // FILE HANDLING
  // =========================================================

  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [key]: "File size cannot exceed 10 MB.",
      }));
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    setPreviews((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file),
    }));

    if (key === "photo") {
      setForm((prev) => ({
        ...prev,
        photoCaptureType: "UPLOADED",
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const removeFile = (key) => {
    if (previews[key]?.startsWith("blob:")) {
      URL.revokeObjectURL(previews[key]);
    }

    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    setPreviews((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  // =========================================================
  // CAMERA
  // =========================================================

  const openCamera = async () => {
    try {
      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

      setStream(mediaStream);
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject =
            mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error(error);
      alert(
        "Camera permission denied or not available."
      );
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) =>
        track.stop()
      );
    }

    setStream(null);
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          "live-photo.jpg",
          { type: "image/jpeg" }
        );

        setFiles((prev) => ({
          ...prev,
          photo: file,
        }));

        setPreviews((prev) => ({
          ...prev,
          photo: URL.createObjectURL(blob),
        }));

        setForm((prev) => ({
          ...prev,
          photoCaptureType: "LIVE_CAMERA",
        }));

        setErrors((prev) => ({
          ...prev,
          photo: "",
        }));

        closeCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validatePlayer = () => {
    const next = {};
    const today = new Date().toISOString().slice(0, 10);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z ]+$/;
    const usernameRegex = /^[A-Za-z0-9._]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!form.username.trim()) {
      next.username = "Username is required.";
    } else if (form.username.length < 4 || form.username.length > 20) {
      next.username = "Username must be between 4 and 20 characters.";
    } else if (!usernameRegex.test(form.username)) {
      next.username = "Username can contain only letters, numbers, dot and underscore.";
    }

    if (!isEdit) {
      if (!form.password) {
        next.password = "Password is required.";
      } else if (form.password.length < 8 || form.password.length > 100) {
        next.password = "Password must be between 8 and 100 characters.";
      }

      if (!form.confirmPassword) {
        next.confirmPassword = "Please confirm password.";
      } else if (form.password !== form.confirmPassword) {
        next.confirmPassword = "Passwords do not match.";
      }
    }

    if (!form.firstName.trim()) {
      next.firstName = "First name is required.";
    } else if (form.firstName.trim().length < 3 || form.firstName.trim().length > 30) {
      next.firstName = "First name must be between 3 and 30 characters.";
    } else if (!nameRegex.test(form.firstName.trim())) {
      next.firstName = "First name can contain only letters and spaces.";
    }

    if (!form.lastName.trim()) {
      next.lastName = "Last name is required.";
    } else if (form.lastName.trim().length < 2 || form.lastName.trim().length > 30) {
      next.lastName = "Last name must be between 2 and 30 characters.";
    } else if (!nameRegex.test(form.lastName.trim())) {
      next.lastName = "Last name can contain only letters and spaces.";
    }

    if (!form.dateOfBirth) {
      next.dateOfBirth = "Date of birth is required.";
    } else if (form.dateOfBirth >= today) {
      next.dateOfBirth = "Date of birth must be in the past.";
    }

    if (!form.gender) next.gender = "Gender is required.";
    if (!form.bloodGroup) next.bloodGroup = "Blood group is required.";

    if (!form.address.trim()) {
      next.address = "Address is required.";
    } else if (form.address.trim().length < 5 || form.address.trim().length > 255) {
      next.address = "Address must be between 5 and 255 characters.";
    }

    if (!form.sportId) next.sportId = "Sport is required.";
    if (!form.batchId) next.batchId = "Batch is required.";
    if (!form.feeStructureId) next.feeStructureId = "Fee structure is required.";

    if (isAdult) {
      if (!form.playerMobileNo) {
        next.playerMobileNo = "Player mobile number is required.";
      } else if (!mobileRegex.test(form.playerMobileNo)) {
        next.playerMobileNo = "Enter a valid 10-digit mobile number starting with 6-9.";
      }

      if (!form.playerEmail.trim()) {
        next.playerEmail = "Player email is required for adults.";
      } else if (!emailRegex.test(form.playerEmail)) {
        next.playerEmail = "Enter a valid player email address.";
      }
    } else {
      if (!form.parentName.trim()) {
        next.parentName = "Parent / Guardian name is required.";
      } else if (form.parentName.trim().length < 3 || form.parentName.trim().length > 30) {
        next.parentName = "Parent name must be between 3 and 30 characters.";
      } else if (!nameRegex.test(form.parentName.trim())) {
        next.parentName = "Parent name can contain only letters and spaces.";
      }

      if (!form.parentMobileNo) {
        next.parentMobileNo = "Parent mobile number is required.";
      } else if (!mobileRegex.test(form.parentMobileNo)) {
        next.parentMobileNo = "Enter a valid 10-digit parent mobile number starting with 6-9.";
      }

      if (!form.parentEmail.trim()) {
        next.parentEmail = "Parent email is required.";
      } else if (!emailRegex.test(form.parentEmail)) {
        next.parentEmail = "Enter a valid parent email address.";
      }
    }

    if (!form.admissionDate) {
      next.admissionDate = "Admission date is required.";
    } else if (form.admissionDate > today) {
      next.admissionDate = "Admission date cannot be in the future.";
    }

    if (form.hasInjury && !form.injuryDetails.trim()) {
      next.injuryDetails = "Please provide injury details.";
    } else if (form.injuryDetails && form.injuryDetails.length > 300) {
      next.injuryDetails = "Injury details cannot exceed 300 characters.";
    }

    if (!files.photo) next.photo = "Player photo is required.";
    if (!files.aadhaarFront) next.aadhaarFront = "Aadhaar front is required.";
    if (!files.aadhaarBack) next.aadhaarBack = "Aadhaar back is required.";
    if (isAdult && !files.panCard) next.panCard = "PAN card is required for adults.";

    setErrors(next);

    if (Object.keys(next).length) {
      setTimeout(() => focusErrorField(Object.keys(next)[0]), 80);
    }

    return Object.keys(next).length === 0;
  };

  const getError = (field) =>
    errors[field] || backendErrors[field];

  const focusErrorField = (field) => {
    if (!field) return;

    setTimeout(() => {
      const element = document.querySelector(`[name="${field}"]`);
      const errorElement = document.querySelector(`[data-error-field="${field}"]`);
      const target = element || errorElement;

      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (typeof target.focus === "function") {
        target.focus({ preventScroll: true });
      } else {
        const focusable = target.querySelector?.(
          'input:not([type="hidden"]), select, textarea, button'
        );
        focusable?.focus({ preventScroll: true });
      }
    }, 80);
  };

  const parseBackendValidationErrors = (response, adult = isAdult) => {
    const result = {};
    if (!response) return result;

    const addFieldErrors = (source) => {
      if (!source || typeof source !== "object" || Array.isArray(source)) return;
      Object.entries(source).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value).trim()) {
          result[key] = String(value);
        }
      });
    };

    addFieldErrors(response.data);
    addFieldErrors(response.errors);
    addFieldErrors(response.fieldErrors);

    const message = typeof response.message === "string" ? response.message : "";

    // Handles Hibernate/Jakarta validation text such as:
    // propertyPath=firstName ... interpolatedMessage='First name is required'
    const propertyMatches = [...message.matchAll(/propertyPath=([^,\s}]+)/g)];
    const templateMatches = [...message.matchAll(/messageTemplate='([^']+)'/g)];
    const interpolatedMatches = [...message.matchAll(/interpolatedMessage='([^']+)'/g)];

    propertyMatches.forEach((match, index) => {
      const backendField = match[1];
      const backendMessage =
        interpolatedMatches[index]?.[1] ||
        templateMatches[index]?.[1] ||
        "Invalid value.";

      if (backendField === "playerHasOwnContact") {
        result[adult ? "playerMobileNo" : "parentMobileNo"] = backendMessage;
      } else {
        result[backendField] = backendMessage;
      }
    });

    // Map common backend business/duplicate errors to the actual field.
    if (message) {
      const lower = message.toLowerCase();
      const mappings = [
        ["username", "username"],
        ["email", adult ? "playerEmail" : "parentEmail"],
        ["player email", "playerEmail"],
        ["parent email", "parentEmail"],
        ["player mobile", "playerMobileNo"],
        ["parent mobile", "parentMobileNo"],
        ["sport", "sportId"],
        ["batch", "batchId"],
        ["fee structure", "feeStructureId"],
        ["first name", "firstName"],
        ["last name", "lastName"],
        ["date of birth", "dateOfBirth"],
        ["blood group", "bloodGroup"],
        ["gender", "gender"],
        ["address", "address"],
        ["admission date", "admissionDate"],
        ["parent name", "parentName"],
        ["photo", "photo"],
        ["aadhaar front", "aadhaarFront"],
        ["aadhaar back", "aadhaarBack"],
        ["pan card", "panCard"],
      ];

      mappings.forEach(([keyword, field]) => {
        if (!result[field] && lower.includes(keyword)) {
          result[field] = message;
        }
      });
    }

    if (!Object.keys(result).length && message) {
      result.general = message;
    }

    return result;
  };

  const focusFirstError = (fieldErrors) => {
    const priority = [
      "username",
      "email",
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "bloodGroup",
      "playerMobileNo",
      "playerEmail",
      "parentMobileNo",
      "parentEmail",
      "parentName",
      "address",
      "admissionDate",
      "injuryDetails",
      "sportId",
      "batchId",
      "feeStructureId",
      "photo",
      "aadhaarFront",
      "aadhaarBack",
      "panCard",
      "certificate",
    ];

    const field = priority.find(
      (name) => fieldErrors?.[name]
    );

    if (field) {
      focusErrorField(field);
    }
  };

  // =========================================================
  // STEP 1 - CREATE PLAYER + ENROLLMENT
  // =========================================================

  const handleContinueToPayment = async () => {
    setSuccessMessage("");
    setBackendErrors({});

    if (!validatePlayer()) {
      return;
    }

    if (isEdit) {
      setBackendErrors({
        general:
          "Payment/enrollment creation is available only for new player registration.",
      });
      return;
    }

    try {
      setLoading(true);

      // -------------------------------
      // CREATE PLAYER
      // -------------------------------



     const data = new FormData();

// Email used for User entity
const accountEmail = isAdult
  ? form.playerEmail
  : form.parentEmail;

Object.entries(form).forEach(
  ([key, value]) => {
    if (
      key === "email" ||
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return;
    }

    data.append(key, value);
  }
);

// User.email
data.append("email", accountEmail);

// Backend requires this flag
data.append(
  "playerHasOwnContact",
  String(isAdult)
);






      // Backend PlayerRequest requires this flag.
      data.append(
        "playerHasOwnContact",
        String(isAdult)
      );

      data.append(
        "photo",
        files.photo
      );

      data.append(
        "aadhaarFront",
        files.aadhaarFront
      );

      data.append(
        "aadhaarBack",
        files.aadhaarBack
      );

      if (files.panCard) {
        data.append(
          "panCard",
          files.panCard
        );
      }

      if (files.certificate) {
        data.append(
          "certificate",
          files.certificate
        );
      }

      const playerResponse =
        await PlayerService.create(data);

      const player =
        playerResponse?.data ||
        playerResponse;

      if (!player?.id) {
        throw new Error(
          "Player created but player ID was not returned."
        );
      }

      setCreatedPlayer(player);

      // -------------------------------
      // CREATE ENROLLMENT
      // -------------------------------

      const enrollmentPayload = {
        playerId: Number(player.id),
        sportId: Number(form.sportId),
        batchId: Number(form.batchId),
        feeStructureId: Number(
          form.feeStructureId
        ),
        paymentPlan,
      };

      const enrollmentResponse =
        await axiosClient.post(
          "/player-enrollment",
          enrollmentPayload
        );

      const enrollment =
        enrollmentResponse?.data?.data;

      if (!enrollment?.id) {
        throw new Error(
          "Enrollment created but enrollment ID was not returned."
        );
      }

      setCreatedEnrollment(enrollment);

      // -------------------------------
      // LOAD INSTALLMENTS
      // -------------------------------

      const installmentResponse =
        await PaymentService.getInstallments(
          enrollment.id
        );

      const installmentList =
        installmentResponse?.data || [];

      setInstallments(installmentList);

      const firstPending =
        installmentList.find(
          (item) =>
            String(item.status).toUpperCase() ===
            "PENDING"
        ) || null;

      setSelectedInstallment(
        firstPending
      );

      const amount =
        paymentPlan === "THREE_INSTALLMENTS"
          ? firstPending?.amount
          : enrollment.finalAmount ??
            selectedFee?.amount;

      if (!amount || Number(amount) <= 0) {
        throw new Error(
          "Payment amount could not be determined."
        );
      }

      setPaymentAmount(
        Number(amount)
      );

      setStep("PAYMENT");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Player/enrollment creation error:",
        error
      );

      const response =
        error.response?.data;

      const parsedErrors =
        parseBackendValidationErrors(
          response,
          isAdult
        );

      if (Object.keys(parsedErrors).length) {
        setBackendErrors(parsedErrors);

        setTimeout(() => {
          focusFirstError(parsedErrors);
        }, 80);
      } else {
        setBackendErrors({
          general:
            response?.message ||
            error.message ||
            "Unable to create player enrollment.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INSTALLMENT CHANGE
  // =========================================================

  const handleInstallmentChange = (e) => {
    const installmentId = e.target.value;

    const installment =
      installments.find(
        (item) =>
          String(item.id) ===
          String(installmentId)
      );

    setSelectedInstallment(
      installment || null
    );

    setPaymentAmount(
      installment?.amount || ""
    );

    setQrData(null);
    setUpiScreenshot(null);
  };

  // =========================================================
  // PAYMENT METHOD
  // =========================================================

  const handlePaymentMethodChange = (
    method
  ) => {
    setPaymentMethod(method);
    setQrData(null);
    setUpiScreenshot(null);

    setBackendErrors((prev) => ({
      ...prev,
      paymentMethod: "",
    }));
  };

  // =========================================================
  // GENERATE QR
  // =========================================================

  const handleGenerateQr = async () => {
    if (
      !paymentAmount ||
      Number(paymentAmount) <= 0
    ) {
      setBackendErrors({
        general:
          "Valid payment amount is required.",
      });
      return;
    }

    try {
      setQrLoading(true);
      setBackendErrors({});

      const response =
        await PaymentService.generateQr(
          paymentAmount
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to generate QR."
        );
      }

      setQrData(response.data);
    } catch (error) {
      console.error(
        "QR generation error:",
        error
      );

      setBackendErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          "Unable to generate UPI QR.",
      });
    } finally {
      setQrLoading(false);
    }
  };

  // =========================================================
  // STEP 2 - CREATE PAYMENT
  // =========================================================

  const handleCompletePayment = async () => {
    setBackendErrors({});

    if (!createdPlayer?.id) {
      setBackendErrors({
        general:
          "Player information is missing.",
      });
      return;
    }

    if (!createdEnrollment?.id) {
      setBackendErrors({
        general:
          "Enrollment information is missing.",
      });
      return;
    }

    if (!paymentMethod) {
      setBackendErrors({
        general:
          "Please select a payment method.",
      });
      return;
    }

    if (
      paymentPlan === "THREE_INSTALLMENTS" &&
      !selectedInstallment?.id
    ) {
      setBackendErrors({
        general:
          "Please select an installment.",
      });
      return;
    }

    if (
      !paymentAmount ||
      Number(paymentAmount) <= 0
    ) {
      setBackendErrors({
        general:
          "Payment amount must be greater than zero.",
      });
      return;
    }

    if (
      paymentMethod === "UPI" &&
      !upiScreenshot
    ) {
      setBackendErrors({
        general:
          "UPI payment screenshot is required.",
      });
      return;
    }

    try {
      setLoading(true);

      const payment = {
        playerId: Number(
          createdPlayer.id
        ),
        playerEnrollmentId: Number(
          createdEnrollment.id
        ),
        installmentId:
          paymentPlan === "THREE_INSTALLMENTS"
            ? Number(
                selectedInstallment.id
              )
            : null,
        amount: Number(paymentAmount),
        paymentMethod,
      };

      const data = new FormData();

      data.append(
        "payment",
        JSON.stringify(payment)
      );

      if (
        paymentMethod === "UPI" &&
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

      const paymentResponse =
        response.data;

      // CASH is received immediately.
      // UPI remains PENDING until receptionist verifies it.
      if (
        paymentMethod === "CASH" &&
        paymentResponse?.id
      ) {
        await PaymentService.markAsReceived(
          paymentResponse.id
        );
      }

      setSuccessMessage(
        paymentMethod === "UPI"
          ? "Registration completed. UPI payment is pending verification."
          : "Player registration and cash payment completed successfully."
      );

      setTimeout(() => {
        navigate(
          "/receptionist/players"
        );
      }, 1800);
    } catch (error) {
      console.error(
        "Payment creation error:",
        error
      );

      setBackendErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          "Unable to create payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT MODE
  // =========================================================

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validatePlayer()) return;

    try {
      setLoading(true);



const data = new FormData();

const accountEmail = isAdult
  ? form.playerEmail
  : form.parentEmail;

Object.entries(form).forEach(
  ([key, value]) => {
    if (
      key === "email" ||
      value === null ||
      value === undefined ||
      value === "" ||
      [
        "confirmPassword",
        "batchId",
        "feeStructureId",
      ].includes(key)
    ) {
      return;
    }

    data.append(key, value);
  }
);

// User.email
data.append("email", accountEmail);

// Contact ownership
data.append(
  "playerHasOwnContact",
  String(isAdult)
);







      if (files.photo) {
        data.append(
          "photo",
          files.photo
        );
      }

      if (files.aadhaarFront) {
        data.append(
          "aadhaarFront",
          files.aadhaarFront
        );
      }

      if (files.aadhaarBack) {
        data.append(
          "aadhaarBack",
          files.aadhaarBack
        );
      }

      if (files.panCard) {
        data.append(
          "panCard",
          files.panCard
        );
      }

      if (files.certificate) {
        data.append(
          "certificate",
          files.certificate
        );
      }

      await PlayerService.update(
        id,
        data
      );

      setSuccessMessage(
        "Player updated successfully."
      );

      setTimeout(() => {
        navigate(
          "/receptionist/players"
        );
      }, 1200);
    } catch (error) {
      console.error(
        "Player update error:",
        error
      );

      setBackendErrors({
        general:
          error.response?.data?.message ||
          "Unable to update player.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLEANUP CAMERA + PREVIEWS
  // =========================================================

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) =>
          track.stop()
        );
      }

      Object.values(previews).forEach(
        (preview) => {
          if (preview?.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        }
      );
    };
  }, [stream]);

  // =========================================================
  // =========================================================
  // RENDER
  // =========================================================

  const inputClass = (field) =>
    `w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 ${
      getError(field)
        ? "border-red-400 focus:border-red-500"
        : "border-slate-200 focus:border-blue-500"
    }`;

  const sectionClass =
    "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden";

  const fieldLabel =
    "block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 mb-1.5";

  const errorText = (field) =>
    getError(field) ? (
      <p
        className="mt-1.5 text-xs text-red-500 error-text"
        data-error-field={field}
      >
        {getError(field)}
      </p>
    ) : null;

  // Reusable section header used by the payment screen.
  // Keep this inside the component so the JSX returned by the helper
  // has access to the current component render.
  const sectionTitle = (number, icon, title, subtitle) => (
    <div className="px-5 sm:px-6 py-5 border-b border-slate-100 bg-white">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Step {number}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );



  if (loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-6 flex items-center gap-3 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm">Loading player registration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* PAGE HEADER */}
      <div className="bg-[#0f172a] text-white shadow-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="h-[76px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => navigate("/receptionist/players")}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition shrink-0"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">
                  {isEdit ? "Edit Player" : "Register New Player"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 truncate">
                  {step === "PLAYER"
                    ? "Enter player details and continue to payment"
                    : "Collect registration payment"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/receptionist/players")}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-28">
        {!isEdit && (
          <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
            <span className={step === "PLAYER" ? "font-semibold text-blue-600" : "text-emerald-600"}>
              1. Player & Enrollment
            </span>
            <span>›</span>
            <span className={step === "PAYMENT" ? "font-semibold text-blue-600" : ""}>
              2. Payment
            </span>
          </div>
        )}

        {backendErrors.general && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{backendErrors.general}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {step === "PLAYER" && (
          <form
            onSubmit={
              isEdit
                ? handleEditSubmit
                : (e) => {
                    e.preventDefault();
                    handleContinueToPayment();
                  }
            }
          >
            <div className="space-y-5">

              <div className="min-w-0 space-y-5">
                {/* 01 PERSONAL DETAILS */}
                <section className={sectionClass}>
                  <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 tracking-[0.12em] uppercase">
                          Step 01
                        </p>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          Personal Details
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Enter the player's basic information
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-[170px_minmax(0,1fr)] gap-6">
                      {/* PHOTO */}
                      <div>
                        <label className={fieldLabel}>Player Photo *</label>
                        <div className="w-full max-w-[160px] aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center relative">
                          {previews.photo ? (
                            <img
                              src={previews.photo}
                              alt="Player"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <User className="w-12 h-12 text-slate-300 mx-auto" />
                              <p className="text-[11px] text-slate-400 mt-2">
                                Photo required
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3 max-w-[160px]">
                          <button
                            type="button"
                            onClick={openCamera}
                            className="h-9 inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-semibold hover:bg-blue-700"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            Camera
                          </button>

                          <label className="h-9 inline-flex items-center justify-center gap-1.5 border border-slate-200 bg-white rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer hover:bg-slate-50">
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "photo")}
                            />
                          </label>
                        </div>

                        {files.photo && (
                          <button
                            type="button"
                            onClick={() => removeFile("photo")}
                            className="mt-2 w-full max-w-[160px] h-8 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Remove photo
                          </button>
                        )}

                        {errorText("photo")}
                      </div>

                      {/* BASIC FIELDS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={fieldLabel}>First Name *</label>
                          <input
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            className={inputClass("firstName")}
                          />
                          {errorText("firstName")}
                        </div>

                        <div>
                          <label className={fieldLabel}>Last Name *</label>
                          <input
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            className={inputClass("lastName")}
                          />
                          {errorText("lastName")}
                        </div>

                        <div>
                          <label className={fieldLabel}>Date of Birth *</label>
                          <input
                            name="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            className={inputClass("dateOfBirth")}
                          />
                          {errorText("dateOfBirth")}
                          {age !== null && (
                            <div className={`mt-2 inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                              isAdult
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-violet-50 text-violet-700 border border-violet-100"
                            }`}>
                              Age {age} · {isAdult ? "18 or above" : "Under 18"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className={fieldLabel}>Gender *</label>
                          <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className={inputClass("gender")}
                          >
                            <option value="">Select gender</option>
                            {genders.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                          {errorText("gender")}
                        </div>

                        <div>
                          <label className={fieldLabel}>Blood Group *</label>
                          <select
                            name="bloodGroup"
                            value={form.bloodGroup}
                            onChange={handleChange}
                            className={inputClass("bloodGroup")}
                          >
                            <option value="">Select blood group</option>
                            {bloodGroups.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                          {errorText("bloodGroup")}
                        </div>

                        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 flex flex-col justify-center">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                            Login account
                          </p>
                          <p className="text-xs font-semibold text-slate-700 mt-1">
                            {isAdult ? "Player account" : "Parent / guardian account"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <label className={fieldLabel}>Residential Address *</label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter complete residential address"
                        className={`w-full px-3.5 py-3 rounded-xl border bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                          getError("address")
                            ? "border-red-400"
                            : "border-slate-200"
                        }`}
                      />
                      {errorText("address")}
                    </div>
                  </div>
                </section>

                {/* 02 CONTACT DETAILS */}
                <section className={sectionClass}>
                  <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isAdult
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-violet-50 text-violet-600"
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-blue-600 tracking-[0.12em] uppercase">
                            Step 02
                          </p>
                          <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            Contact Details
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {isAdult
                              ? "Adult player's contact information"
                              : "Parent or guardian contact information"}
                          </p>
                        </div>
                      </div>

                      {age !== null && (
                        <span className={`hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isAdult
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-violet-50 text-violet-700"
                        }`}>
                          Age {age}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    {isAdult ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <p className="text-sm font-semibold text-emerald-800">
                            Player contact
                          </p>
                          <span className="text-xs text-emerald-600">
                            Used for the player account
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={fieldLabel}>Player Mobile *</label>
                            <input
                              name="playerMobileNo"
                              value={form.playerMobileNo}
                              onChange={handleChange}
                              maxLength={10}
                              inputMode="numeric"
                              placeholder="10-digit mobile number"
                              className={inputClass("playerMobileNo")}
                            />
                            {errorText("playerMobileNo")}
                          </div>

                          <div>
                            <label className={fieldLabel}>Player Email *</label>
                            <input
                              name="playerEmail"
                              type="email"
                              value={form.playerEmail}
                              onChange={handleChange}
                              placeholder="player@example.com"
                              className={inputClass("playerEmail")}
                            />
                            {errorText("playerEmail")}
                          </div>

                          <div className="md:col-span-2">
                            <label className={fieldLabel}>Parent / Guardian Name *</label>
                            <input
                              name="parentName"
                              value={form.parentName}
                              onChange={handleChange}
                              placeholder="Enter parent / guardian name"
                              className={inputClass("parentName")}
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                              Required by the player record as guardian / emergency contact information.
                            </p>
                            {errorText("parentName")}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-violet-200 bg-violet-50/20 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 rounded-full bg-violet-500" />
                          <p className="text-sm font-semibold text-violet-800">
                            Parent / Guardian contact
                          </p>
                          <span className="text-xs text-violet-600">
                            Used for the parent account
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={fieldLabel}>Parent / Guardian Name *</label>
                            <input
                              name="parentName"
                              value={form.parentName}
                              onChange={handleChange}
                              placeholder="Enter parent / guardian name"
                              className={inputClass("parentName")}
                            />
                            {errorText("parentName")}
                          </div>

                          <div>
                            <label className={fieldLabel}>Parent Mobile *</label>
                            <input
                              name="parentMobileNo"
                              value={form.parentMobileNo}
                              onChange={handleChange}
                              maxLength={10}
                              inputMode="numeric"
                              placeholder="10-digit mobile number"
                              className={inputClass("parentMobileNo")}
                            />
                            {errorText("parentMobileNo")}
                          </div>

                          <div className="md:col-span-2">
                            <label className={fieldLabel}>Parent Email *</label>
                            <input
                              name="parentEmail"
                              type="email"
                              value={form.parentEmail}
                              onChange={handleChange}
                              placeholder="parent@example.com"
                              className={inputClass("parentEmail")}
                            />
                            {errorText("parentEmail")}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* 03 ADMISSION & MEDICAL */}
                <section className={sectionClass}>
                  <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 tracking-[0.12em] uppercase">
                        Step 03
                      </p>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Admission & Medical
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Admission date and injury information
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    <div className="max-w-sm">
                      <label className={fieldLabel}>Admission Date *</label>
                      <input
                        name="admissionDate"
                        type="date"
                        value={form.admissionDate}
                        onChange={handleChange}
                        className={inputClass("admissionDate")}
                      />
                      {errorText("admissionDate")}
                    </div>

                    <div className={`rounded-2xl border p-4 sm:p-5 ${
                      form.hasInjury
                        ? "border-amber-200 bg-amber-50/40"
                        : "border-slate-200 bg-slate-50/50"
                    }`}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="hasInjury"
                          checked={form.hasInjury}
                          onChange={handleChange}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Player has an existing injury
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Select this if any injury or medical concern should be recorded.
                          </p>
                        </div>
                      </label>

                      {form.hasInjury && (
                        <div className="mt-4">
                          <label className={fieldLabel}>Injury Details *</label>
                          <textarea
                            name="injuryDetails"
                            value={form.injuryDetails}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe the injury or medical concern"
                            className={`w-full px-3.5 py-3 rounded-xl border bg-white text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                              getError("injuryDetails")
                                ? "border-red-400"
                                : "border-slate-200"
                            }`}
                          />
                          {errorText("injuryDetails")}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* 04 DOCUMENTS */}
                <section className={sectionClass}>
                  <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 tracking-[0.12em] uppercase">
                        Step 04
                      </p>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Documents
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Upload identity and supporting documents
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "aadhaarFront", label: "Aadhaar Front", required: true },
                        { key: "aadhaarBack", label: "Aadhaar Back", required: true },
                        ...(isAdult
                          ? [{ key: "panCard", label: "PAN Card", required: true }]
                          : []),
                        { key: "certificate", label: "Certificate", required: false },
                      ].map((doc) => {
                        const selectedFile = files[doc.key];

                        return (
                          <div
                            key={doc.key}
                            className={`rounded-2xl border p-4 transition ${
                              getError(doc.key)
                                ? "border-red-300 bg-red-50/40"
                                : selectedFile
                                ? "border-emerald-200 bg-emerald-50/30"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {doc.label}
                                  </p>
                                  {doc.required && (
                                    <span className="text-red-500 text-xs">*</span>
                                  )}
                                </div>

                                {selectedFile ? (
                                  <div className="mt-1 flex items-center gap-2 min-w-0">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <p
                                      className="text-xs text-emerald-700 font-medium truncate"
                                      title={selectedFile.name}
                                    >
                                      {selectedFile.name}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-400 mt-1">
                                    {doc.required ? "Required" : "Optional"} · PDF or image
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {selectedFile && (
                                  <button
                                    type="button"
                                    onClick={() => removeFile(doc.key)}
                                    title="Remove file"
                                    className="w-9 h-9 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}

                                <label
                                  className={`h-9 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-xs font-semibold ${
                                    selectedFile
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100"
                                  }`}
                                >
                                  {selectedFile ? (
                                    <>
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      Uploaded
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5" />
                                      Upload
                                    </>
                                  )}

                                  {!selectedFile && (
                                    <input
                                      type="file"
                                      accept="image/*,.pdf"
                                      className="hidden"
                                      onChange={(e) => handleFileChange(e, doc.key)}
                                    />
                                  )}
                                </label>
                              </div>
                            </div>

                            {getError(doc.key) && (
                              <p
                                className="text-xs text-red-500 mt-2 error-text"
                                data-error-field={doc.key}
                              >
                                {getError(doc.key)}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* 05 ENROLLMENT */}
                <section className={sectionClass}>
                  <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 tracking-[0.12em] uppercase">
                        Step 05
                      </p>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Enrollment Details
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Select sport, batch and applicable fee structure
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={fieldLabel}>Sport *</label>
                        <select
                          name="sportId"
                          value={form.sportId}
                          onChange={handleSportChange}
                          className={inputClass("sportId")}
                        >
                          <option value="">Select sport</option>
                          {sports.map((sport) => (
                            <option key={getSportId(sport)} value={getSportId(sport)}>
                              {getSportName(sport)}
                            </option>
                          ))}
                        </select>
                        {errorText("sportId")}
                      </div>

                      <div>
                        <label className={fieldLabel}>Batch *</label>
                        <select
                          name="batchId"
                          value={form.batchId}
                          onChange={handleBatchChange}
                          disabled={!form.sportId}
                          className={`${inputClass("batchId")} disabled:bg-slate-50 disabled:text-slate-400`}
                        >
                          <option value="">
                            {form.sportId ? "Select batch" : "Select sport first"}
                          </option>
                          {availableBatches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                              {getBatchName(batch)} — {batch.availableSeats} seats available
                            </option>
                          ))}
                        </select>

                        {selectedBatch && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                            <span>Capacity: {selectedBatch.capacity}</span>
                            <span>Current: {selectedBatch.currentPlayers}</span>
                            <span className="text-emerald-600 font-semibold">
                              Available: {selectedBatch.availableSeats}
                            </span>
                          </div>
                        )}
                        {errorText("batchId")}
                      </div>
                    </div>

                    <div>
                      <label className={fieldLabel}>Fee Structure *</label>
                      <select
                        name="feeStructureId"
                        value={form.feeStructureId}
                        onChange={handleFeeChange}
                        disabled={!form.batchId}
                        className={`${inputClass("feeStructureId")} disabled:bg-slate-50 disabled:text-slate-400`}
                      >
                        <option value="">
                          {form.batchId ? "Select fee structure" : "Select batch first"}
                        </option>
                        {fees.map((fee) => (
                          <option key={getFeeId(fee)} value={getFeeId(fee)}>
                            ₹{money(fee.amount)} — {getFeeDurationText(fee)}
                          </option>
                        ))}
                      </select>

                      {!fees.length && form.batchId && (
                        <p className="text-xs text-red-500 mt-2">
                          No active fee structures found for this sport.
                        </p>
                      )}
                      {errorText("feeStructureId")}
                    </div>

                    {selectedFee && (
                      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600">
                              Selected Fee
                            </p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">
                              {getFeeDurationText(selectedFee)}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-2xl font-bold text-blue-700">
                              ₹{money(selectedFee.amount)}
                            </p>
                            <p className="text-xs text-blue-600 mt-0.5">
                              Total enrollment fee
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedFee && (
                      <div>
                        <label className={fieldLabel}>Payment Plan *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setPaymentPlan("ONE_TIME")}
                            className={`rounded-2xl border-2 p-5 text-left transition ${
                              paymentPlan === "ONE_TIME"
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-sm text-slate-900">
                                  One-time payment
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Pay the complete fee in one payment.
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                                paymentPlan === "ONE_TIME"
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-300"
                              }`} />
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentPlan("THREE_INSTALLMENTS")}
                            className={`rounded-2xl border-2 p-5 text-left transition ${
                              paymentPlan === "THREE_INSTALLMENTS"
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-sm text-slate-900">
                                  3 installments
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Split the fee into three scheduled payments.
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                                paymentPlan === "THREE_INSTALLMENTS"
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-300"
                              }`} />
                            </div>
                          </button>
                        </div>

                        {!paymentPlan && (
                          <p className="text-xs text-red-500 mt-2">
                            Select a payment plan.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {/* 06 ACCOUNT */}
                <section className={sectionClass}>
                  <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 tracking-[0.12em] uppercase">
                        Step 06
                      </p>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Account Credentials
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isAdult ? "Player login credentials" : "Parent / guardian login credentials"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* No duplicate login-email field or email banner.
                        The account email is taken from the contact section
                        by the existing submit logic. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={fieldLabel}>Username *</label>
                        <input
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          placeholder="Create username"
                          className={inputClass("username")}
                        />
                        {errorText("username")}
                      </div>

                      {!isEdit && (
                        <>
                          <div>
                            <label className={fieldLabel}>Password *</label>
                            <input
                              name="password"
                              type="password"
                              value={form.password}
                              onChange={handleChange}
                              placeholder="Minimum 8 characters"
                              className={inputClass("password")}
                            />
                            {errorText("password")}
                          </div>

                          <div>
                            <label className={fieldLabel}>Confirm Password *</label>
                            <input
                              name="confirmPassword"
                              type="password"
                              value={form.confirmPassword}
                              onChange={handleChange}
                              placeholder="Re-enter password"
                              className={inputClass("confirmPassword")}
                            />
                            {errorText("confirmPassword")}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </section>

                {/* ACTION BAR */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {isEdit ? "Ready to update player" : "Ready to continue"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {isEdit
                        ? "Review the details before saving changes."
                        : "Player and enrollment details will be saved before payment."}
                    </p>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => navigate("/receptionist/players")}
                      disabled={loading}
                      className="min-w-[130px] h-11 px-5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading || (!isEdit && !paymentPlan)}
                      className="min-w-[210px] h-11 inline-flex items-center justify-center gap-2 px-6 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {isEdit ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {isEdit ? "Update Player" : "Save & Continue to Payment"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* =====================================================
            STEP 2 - PAYMENT
        ===================================================== */}
        {step === "PAYMENT" && (
          <div className="space-y-5">
            {/* PAYMENT HEADER */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    Final Step
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Collect Payment
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Review enrollment and record the first payment.
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4 min-w-[190px]">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-600">
                    Amount Due
                  </p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    ₹{money(paymentAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Player
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {createdPlayer?.firstName} {createdPlayer?.lastName}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Enrollment
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    #{createdEnrollment?.id}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Plan
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {paymentPlan === "THREE_INSTALLMENTS"
                      ? "3 Installments"
                      : "One Time"}
                  </p>
                </div>
              </div>
            </div>

            {/* INSTALLMENTS */}
            {paymentPlan === "THREE_INSTALLMENTS" && (
              <div className={sectionClass}>
                {sectionTitle(
                  "01",
                  <CreditCard className="w-5 h-5" />,
                  "Select Installment",
                  "Choose the installment being paid today"
                )}

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {installments.map((item) => {
                      const pending =
                        String(item.status).toUpperCase() === "PENDING";

                      const selected =
                        String(selectedInstallment?.id) === String(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={!pending}
                          onClick={() =>
                            handleInstallmentChange({
                              target: { value: item.id },
                            })
                          }
                          className={`rounded-2xl border-2 p-4 text-left transition ${
                            selected
                              ? "border-blue-600 bg-blue-50"
                              : pending
                              ? "border-slate-200 bg-white hover:border-slate-300"
                              : "border-slate-100 bg-slate-50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold text-slate-500">
                              Installment {item.installmentNumber}
                            </p>
                            <span
                              className={`text-[10px] font-semibold uppercase ${
                                pending
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xl font-bold text-slate-900 mt-2">
                            ₹{money(item.amount)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT METHOD */}
            <div className={sectionClass}>
              {sectionTitle(
                paymentPlan === "THREE_INSTALLMENTS" ? "02" : "01",
                <CreditCard className="w-5 h-5" />,
                "Payment Method",
                "Select how the customer is paying"
              )}

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("CASH")}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      paymentMethod === "CASH"
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-base font-semibold">Cash</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Payment received at the reception counter.
                        </p>
                      </div>
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("UPI")}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      paymentMethod === "UPI"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-base font-semibold">UPI</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Generate QR, receive payment and upload proof.
                        </p>
                      </div>
                      <QrCode className="w-5 h-5 text-blue-600" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* UPI */}
            {paymentMethod === "UPI" && (
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold">
                      UPI Payment
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Generate the QR for ₹{money(paymentAmount)}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Amount to collect
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        ₹{money(paymentAmount)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateQr}
                      disabled={qrLoading || !paymentAmount}
                      className="h-11 px-5 inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {qrLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          Generate QR
                        </>
                      )}
                    </button>
                  </div>

                  {qrData?.qrCodeBase64 && (
                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 flex flex-col items-center">
                        <img
                          src={`data:image/png;base64,${qrData.qrCodeBase64}`}
                          alt="UPI QR Code"
                          className="w-64 h-64 bg-white p-3 rounded-2xl shadow-sm"
                        />
                        <p className="text-2xl font-bold text-slate-900 mt-4">
                          ₹{qrData.amount}
                        </p>
                        <p className="text-sm font-medium text-slate-700 mt-1">
                          {qrData.payeeName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          UPI: {qrData.upiId}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-5">
                        <p className="text-sm font-semibold text-slate-900">
                          Payment proof
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Upload the screenshot after the UPI payment is completed.
                        </p>

                        <label className="mt-4 min-h-36 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 px-5 py-6 cursor-pointer hover:bg-slate-50">
                          <Upload className="w-6 h-6 text-blue-600" />
                          <span className="text-sm font-medium text-slate-700 text-center">
                            {upiScreenshot
                              ? upiScreenshot.name
                              : "Click to upload payment screenshot"}
                          </span>
                          <span className="text-xs text-slate-400">
                            PNG, JPG or JPEG
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              setUpiScreenshot(
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </label>

                        {upiScreenshot && (
                          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                            <p className="text-xs text-emerald-700 font-medium truncate">
                              ✓ {upiScreenshot.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => setUpiScreenshot(null)}
                              className="w-7 h-7 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PAYMENT ACTIONS */}
            <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur rounded-2xl border border-slate-200 shadow-lg p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("PLAYER");
                  setPaymentMethod("");
                  setQrData(null);
                  setUpiScreenshot(null);
                }}
                disabled={loading}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to Player Details
              </button>

              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={
                  loading ||
                  !paymentMethod ||
                  (paymentMethod === "UPI" && !upiScreenshot)
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Registration
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CAMERA MODAL
      ===================================================== */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">
                Live Camera
              </h3>

              <button
                type="button"
                onClick={closeCamera}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-xl bg-black"
            />

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
              >
                Capture Photo
              </button>

              <button
                type="button"
                onClick={closeCamera}
                className="px-5 py-2.5 border border-gray-200 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default PlayerForm;
