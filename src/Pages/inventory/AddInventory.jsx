import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Users,
  Plus,
  Trash2,
  IndianRupee,
  PackagePlus,
  Loader2,
} from "lucide-react";

import {
  getAllSports,
  addInventory,
} from "./inventoryApi";

// ==========================================================
// CREATE BRAND
// ==========================================================

const createBrand = () => ({
  brand: "",
  costPrice: "",
  sellingPrice: "",
  quantity: "",
  lowStockAlert: "",
});

// ==========================================================
// CREATE ITEM
// ==========================================================

const createItem = () => ({
  subItem: "",
  brands: [createBrand()],
});

// ==========================================================
// COMPONENT
// ==========================================================

const AddInventory = () => {
  const navigate = useNavigate();

  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");

  const [items, setItems] = useState([
    createItem(),
  ]);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [sportsLoading, setSportsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fieldRefs = useRef({});

  // ==========================================================
  // BACK TO INVENTORY
  // ==========================================================

 // ==========================================================
// NAVIGATION
// ==========================================================

const goToInventory = () => {
  if (loading) return;

  // Force browser navigation to Inventory Management
  window.location.href = "/inventory";
};

const handleBackToInventory = () => {
  goToInventory();
};

const handleCancel = () => {
  goToInventory();
};



  // ==========================================================
  // LOAD SPORTS
  // ONLY ACTIVE SPORTS
  // ==========================================================

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    setSportsLoading(true);
    setApiError("");

    try {
      const response = await getAllSports();

      const responseData =
        response?.data ?? response;

      const sportList = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
        ? responseData.data
        : [];

      // ======================================================
      // IMPORTANT:
      // SHOW ONLY ACTIVE SPORTS
      // ======================================================
const activeSports = sportList.filter((sport) => {
  const status = sport?.Status ?? sport?.status;

  return (
    String(status || "")
      .trim()
      .toUpperCase() === "ACTIVE"
  );
});






      setSports(activeSports);

      if (activeSports.length === 0) {
        setApiError(
          "No active sports are available. Please add or activate a sport first."
        );
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load sports."
      );
    } finally {
      setSportsLoading(false);
    }
  };

  // ==========================================================
  // FIELD REF / FOCUS
  // ==========================================================

  const setFieldRef = (key, element) => {
    if (element) {
      fieldRefs.current[key] = element;
    }
  };

  const focusField = (key) => {
    setTimeout(() => {
      fieldRefs.current[key]?.focus();
    }, 80);
  };

  // ==========================================================
  // VALIDATION HELPERS
  // ==========================================================

  const isValidText = (value) =>
    /^[A-Za-z][A-Za-z\s.&'-]*$/.test(
      String(value || "").trim()
    );

  const validateText = (value, label) => {
    const trimmed = String(value || "").trim();

    if (!trimmed) {
      return `${label} is required.`;
    }

    if (!isValidText(trimmed)) {
      return `${label} can contain letters, spaces and . & ' - only.`;
    }

    if (trimmed.length < 2) {
      return `${label} must contain at least 2 characters.`;
    }

    if (trimmed.length > 100) {
      return `${label} cannot exceed 100 characters.`;
    }

    return "";
  };

  const validatePositiveNumber = (
    value,
    label,
    allowDecimal = false,
    allowZero = false
  ) => {
    const stringValue =
      String(value ?? "").trim();

    if (!stringValue) {
      return `${label} is required.`;
    }

    const pattern = allowDecimal
      ? /^\d{1,8}(\.\d{1,2})?$/
      : /^\d{1,9}$/;

    if (!pattern.test(stringValue)) {
      return allowDecimal
        ? `${label} must contain maximum 8 integer digits and 2 decimal digits.`
        : `${label} must contain numbers only and cannot exceed 9 digits.`;
    }

    const numberValue = Number(stringValue);

    if (allowZero ? numberValue < 0 : numberValue <= 0) {
      return allowZero
        ? `${label} cannot be negative.`
        : `${label} must be greater than zero.`;
    }

    return "";
  };

  // ==========================================================
  // ERROR KEYS
  // ==========================================================

  const subItemKey = (itemIndex) =>
    `item_${itemIndex}_subItem`;

  const brandKey = (
    itemIndex,
    brandIndex
  ) =>
    `item_${itemIndex}_brand_${brandIndex}_brand`;

  const costPriceKey = (
    itemIndex,
    brandIndex
  ) =>
    `item_${itemIndex}_brand_${brandIndex}_costPrice`;

  const priceKey = (
    itemIndex,
    brandIndex
  ) =>
    `item_${itemIndex}_brand_${brandIndex}_sellingPrice`;

  const quantityKey = (
    itemIndex,
    brandIndex
  ) =>
    `item_${itemIndex}_brand_${brandIndex}_quantity`;

  const lowStockKey = (
    itemIndex,
    brandIndex
  ) =>
    `item_${itemIndex}_brand_${brandIndex}_lowStockAlert`;

  // ==========================================================
  // VALIDATE BRAND
  // ==========================================================

  const validateBrand = (
    brand,
    itemIndex,
    brandIndex
  ) => {
    const brandErrors = {};

    const brandError = validateText(
      brand.brand,
      "Brand"
    );

    if (brandError) {
      brandErrors[
        brandKey(itemIndex, brandIndex)
      ] = brandError;
    }

    const costPriceError =
      validatePositiveNumber(
        brand.costPrice,
        "Cost price",
        true,
        false
      );

    if (costPriceError) {
      brandErrors[
        costPriceKey(itemIndex, brandIndex)
      ] = costPriceError;
    }

    const priceError =
      validatePositiveNumber(
        brand.sellingPrice,
        "Selling price",
        true,
        false
      );

    if (priceError) {
      brandErrors[
        priceKey(itemIndex, brandIndex)
      ] = priceError;
    }

    const quantityError =
      validatePositiveNumber(
        brand.quantity,
        "Total quantity",
        false,
        true
      );

    if (quantityError) {
      brandErrors[
        quantityKey(itemIndex, brandIndex)
      ] = quantityError;
    }

    const lowStockError =
      validatePositiveNumber(
        brand.lowStockAlert,
        "Low stock alert",
        false,
        true
      );

    if (lowStockError) {
      brandErrors[
        lowStockKey(itemIndex, brandIndex)
      ] = lowStockError;
    }

    return brandErrors;
  };

  // ==========================================================
  // VALIDATE SINGLE ITEM
  // ==========================================================

  const validateItem = (
    item,
    itemIndex
  ) => {
    const itemErrors = {};

    const subItemError = validateText(
      item.subItem,
      "Sub item"
    );

    if (subItemError) {
      itemErrors[
        subItemKey(itemIndex)
      ] = subItemError;
    }

    item.brands.forEach(
      (brand, brandIndex) => {
        Object.assign(
          itemErrors,
          validateBrand(
            brand,
            itemIndex,
            brandIndex
          )
        );
      }
    );

    const seenBrands = {};

    item.brands.forEach(
      (brand, brandIndex) => {
        const cleanBrand = String(
          brand.brand || ""
        )
          .trim()
          .toLowerCase();

        if (!cleanBrand) return;

        if (seenBrands[cleanBrand] !== undefined) {
          itemErrors[
            brandKey(
              itemIndex,
              brandIndex
            )
          ] =
            "This brand is already added for this sub item.";
        } else {
          seenBrands[cleanBrand] =
            brandIndex;
        }
      }
    );

    return itemErrors;
  };

  // ==========================================================
  // VALIDATE COMPLETE FORM
  // ==========================================================

  const validateForm = () => {
    const newErrors = {};

    if (!selectedSport) {
      newErrors.sport =
        "Sport is required.";
    }

    items.forEach(
      (item, itemIndex) => {
        Object.assign(
          newErrors,
          validateItem(
            item,
            itemIndex
          )
        );
      }
    );

    const combinations = {};

    items.forEach(
      (item, itemIndex) => {
        const cleanSubItem =
          String(item.subItem || "")
            .trim()
            .toLowerCase();

        if (!cleanSubItem) return;

        item.brands.forEach(
          (brand, brandIndex) => {
            const cleanBrand =
              String(brand.brand || "")
                .trim()
                .toLowerCase();

            if (!cleanBrand) return;

            const combination =
              `${cleanSubItem}|||${cleanBrand}`;

            if (
              combinations[combination] !==
              undefined
            ) {
              newErrors[
                brandKey(
                  itemIndex,
                  brandIndex
                )
              ] =
                "This sub item and brand combination is already added.";
            } else {
              combinations[combination] = {
                itemIndex,
                brandIndex,
              };
            }
          }
        );
      }
    );

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0
    ) {
      if (newErrors.sport) {
        focusField("sport");
      } else {
        const firstError =
          Object.keys(newErrors)[0];

        focusField(firstError);
      }

      return false;
    }

    return true;
  };

  // ==========================================================
  // SUB ITEM CHANGE
  // ==========================================================

  const handleSubItemChange = (
    itemIndex,
    value
  ) => {
    const cleaned = value.replace(
      /[^A-Za-z\s.&'-]/g,
      ""
    );

    setItems((previous) =>
      previous.map(
        (item, index) =>
          index === itemIndex
            ? {
                ...item,
                subItem: cleaned,
              }
            : item
      )
    );

    setErrors((previous) => {
      const next = {
        ...previous,
      };

      delete next[
        subItemKey(itemIndex)
      ];

      delete next.general;

      return next;
    });

    setApiError("");
    setSuccessMessage("");
  };

  // ==========================================================
  // BRAND TEXT CHANGE
  // ==========================================================

  const handleBrandTextChange = (
    itemIndex,
    brandIndex,
    value
  ) => {
    const cleaned = value.replace(
      /[^A-Za-z\s.&'-]/g,
      ""
    );

    setItems((previous) =>
      previous.map(
        (item, currentItemIndex) => {
          if (
            currentItemIndex !==
            itemIndex
          ) {
            return item;
          }

          return {
            ...item,
            brands: item.brands.map(
              (
                brand,
                currentBrandIndex
              ) =>
                currentBrandIndex ===
                brandIndex
                  ? {
                      ...brand,
                      brand: cleaned,
                    }
                  : brand
            ),
          };
        }
      )
    );

    setErrors((previous) => {
      const next = {
        ...previous,
      };

      delete next[
        brandKey(
          itemIndex,
          brandIndex
        )
      ];

      delete next.general;

      return next;
    });

    setApiError("");
    setSuccessMessage("");
  };

  // ==========================================================
  // NUMBER CHANGE
  // ==========================================================

  const handleNumberChange = (
    itemIndex,
    brandIndex,
    field,
    value,
    allowDecimal = false
  ) => {
    let cleaned;

    if (allowDecimal) {
      cleaned = value
        .replace(/[^0-9.]/g, "")
        .replace(
          /^(\d*\.\d*).*$/,
          "$1"
        );

      const parts =
        cleaned.split(".");

      if (parts.length > 2) {
        cleaned =
          parts[0] +
          "." +
          parts
            .slice(1)
            .join("");
      }
    } else {
      cleaned = value.replace(
        /[^0-9]/g,
        ""
      );
    }

    setItems((previous) =>
      previous.map(
        (item, currentItemIndex) => {
          if (
            currentItemIndex !==
            itemIndex
          ) {
            return item;
          }

          return {
            ...item,
            brands: item.brands.map(
              (
                brand,
                currentBrandIndex
              ) =>
                currentBrandIndex ===
                brandIndex
                  ? {
                      ...brand,
                      [field]:
                        cleaned,
                    }
                  : brand
            ),
          };
        }
      )
    );

    let errorKey = "";

    if (field === "costPrice") {
      errorKey = costPriceKey(
        itemIndex,
        brandIndex
      );
    }

    if (
      field === "sellingPrice"
    ) {
      errorKey = priceKey(
        itemIndex,
        brandIndex
      );
    }

    if (field === "quantity") {
      errorKey = quantityKey(
        itemIndex,
        brandIndex
      );
    }

    if (
      field === "lowStockAlert"
    ) {
      errorKey = lowStockKey(
        itemIndex,
        brandIndex
      );
    }

    setErrors((previous) => {
      const next = {
        ...previous,
      };

      delete next[errorKey];
      delete next.general;

      return next;
    });

    setApiError("");
    setSuccessMessage("");
  };

  // ==========================================================
  // BLUR VALIDATION
  // ==========================================================

  const validateSingleField = (
    itemIndex,
    brandIndex,
    field
  ) => {
    const item =
      items[itemIndex];

    if (!item) return "";

    let message = "";
    let key = "";

    if (field === "subItem") {
      message = validateText(
        item.subItem,
        "Sub item"
      );

      key = subItemKey(
        itemIndex
      );
    }

    if (field === "brand") {
      message = validateText(
        item.brands[brandIndex]
          ?.brand,
        "Brand"
      );

      key = brandKey(
        itemIndex,
        brandIndex
      );
    }

    if (field === "costPrice") {
      message =
        validatePositiveNumber(
          item.brands[brandIndex]
            ?.costPrice,
          "Cost price",
          true,
          false
        );

      key = costPriceKey(
        itemIndex,
        brandIndex
      );
    }

    if (
      field === "sellingPrice"
    ) {
      message =
        validatePositiveNumber(
          item.brands[brandIndex]
            ?.sellingPrice,
          "Selling price",
          true,
          false
        );

      key = priceKey(
        itemIndex,
        brandIndex
      );
    }

    if (field === "quantity") {
      message =
        validatePositiveNumber(
          item.brands[brandIndex]
            ?.quantity,
          "Total quantity",
          false,
          true
        );

      key = quantityKey(
        itemIndex,
        brandIndex
      );
    }

    if (
      field === "lowStockAlert"
    ) {
      message =
        validatePositiveNumber(
          item.brands[brandIndex]
            ?.lowStockAlert,
          "Low stock alert",
          false,
          true
        );

      key = lowStockKey(
        itemIndex,
        brandIndex
      );
    }

    setErrors((previous) => {
      const next = {
        ...previous,
      };

      if (message) {
        next[key] = message;
      } else {
        delete next[key];
      }

      return next;
    });

    return message;
  };

  // ==========================================================
  // ADD ANOTHER BRAND
  // ==========================================================

  const handleAddAnotherBrand = (
    itemIndex
  ) => {
    const item =
      items[itemIndex];

    if (!item) return;

    const currentErrors =
      validateItem(
        item,
        itemIndex
      );

    setErrors((previous) => ({
      ...previous,
      ...currentErrors,
    }));

    if (
      Object.keys(currentErrors)
        .length > 0
    ) {
      const firstError =
        Object.keys(
          currentErrors
        )[0];

      focusField(firstError);
      return;
    }

    const newBrandIndex =
      item.brands.length;

    setItems((previous) =>
      previous.map(
        (currentItem, index) =>
          index === itemIndex
            ? {
                ...currentItem,
                brands: [
                  ...currentItem.brands,
                  createBrand(),
                ],
              }
            : currentItem
      )
    );

    setSuccessMessage("");
    setApiError("");

    setTimeout(() => {
      focusField(
        brandKey(
          itemIndex,
          newBrandIndex
        )
      );
    }, 100);
  };

  // ==========================================================
  // REMOVE BRAND
  // ==========================================================

  const handleRemoveBrand = (
    itemIndex,
    brandIndex
  ) => {
    const item =
      items[itemIndex];

    if (!item) return;

    if (item.brands.length === 1) {
      return;
    }

    setItems((previous) =>
      previous.map(
        (currentItem, index) =>
          index === itemIndex
            ? {
                ...currentItem,
                brands:
                  currentItem.brands.filter(
                    (
                      _,
                      currentBrandIndex
                    ) =>
                      currentBrandIndex !==
                      brandIndex
                  ),
              }
            : currentItem
      )
    );

    setErrors((previous) => {
      const next = {};

      Object.entries(
        previous
      ).forEach(
        ([key, value]) => {
          if (
            !key.startsWith(
              `item_${itemIndex}_brand_${brandIndex}_`
            )
          ) {
            next[key] = value;
          }
        }
      );

      return next;
    });

    setSuccessMessage("");
  };

  // ==========================================================
  // ADD ANOTHER ITEM
  // ==========================================================

  const handleAddAnotherItem = () => {
    const currentErrors = {};

    items.forEach(
      (item, itemIndex) => {
        Object.assign(
          currentErrors,
          validateItem(
            item,
            itemIndex
          )
        );
      }
    );

    setErrors(currentErrors);

    if (
      Object.keys(currentErrors)
        .length > 0
    ) {
      const firstError =
        Object.keys(
          currentErrors
        )[0];

      focusField(firstError);
      return;
    }

    setItems((previous) => [
      ...previous,
      createItem(),
    ]);

    setSuccessMessage("");
    setApiError("");

    setTimeout(() => {
      const newIndex =
        items.length;

      focusField(
        subItemKey(newIndex)
      );
    }, 100);
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const handleRemoveItem = (
    index
  ) => {
    if (items.length === 1) {
      return;
    }

    setItems((previous) =>
      previous.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );

    setErrors((previous) => {
      const next = {};

      Object.entries(
        previous
      ).forEach(
        ([key, value]) => {
          if (
            !key.startsWith(
              `item_${index}_`
            )
          ) {
            next[key] = value;
          }
        }
      );

      return next;
    });

    setSuccessMessage("");
  };

  // ==========================================================
  // BACKEND ERROR HANDLING
  // ==========================================================

  const applyBackendErrors = (
    error
  ) => {
    const response =
      error?.response?.data ||
      {};

    const backendData =
      response?.data;

    const mapped = {};

    if (
      backendData &&
      typeof backendData ===
        "object" &&
      !Array.isArray(
        backendData
      )
    ) {
      Object.entries(
        backendData
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
    }

    if (
      Object.keys(mapped)
        .length === 0
    ) {
      mapped.general =
        response?.message ||
        error?.message ||
        "Unable to add inventory.";
    }

    setErrors(mapped);

    const firstField =
      Object.keys(mapped).find(
        (field) =>
          field !== "general"
      );

    if (firstField) {
      focusField(firstField);
    }
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      for (
        let itemIndex = 0;
        itemIndex < items.length;
        itemIndex++
      ) {
        const item =
          items[itemIndex];

        for (
          let brandIndex = 0;
          brandIndex <
          item.brands.length;
          brandIndex++
        ) {
          const brand =
            item.brands[
              brandIndex
            ];

          await addInventory({
            sportId:
              Number(
                selectedSport
              ),

            subItem:
              item.subItem.trim(),

            brand:
              brand.brand.trim(),

            costPrice:
              Number(
                brand.costPrice
              ),

            sellingPrice:
              Number(
                brand.sellingPrice
              ),

            quantity:
              Number(
                brand.quantity
              ),

            lowStockAlert:
              Number(
                brand.lowStockAlert
              ),
          });
        }
      }

      setSuccessMessage(
        items.length === 1 &&
          items[0].brands.length ===
            1
          ? "New inventory item added successfully."
          : "Inventory items and brands added successfully."
      );

      setErrors({});

      setItems([
        createItem(),
      ]);

      setSelectedSport("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        navigate("/inventory", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      applyBackendErrors(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // FIELD UI
  // ==========================================================

  const fieldClass = (error) =>
    `
      h-12 w-full rounded-xl border
      bg-white px-4
      text-[15px] text-[#263e5a]
      outline-none transition
      placeholder:text-[#9aabbd]
      ${
        error
          ? "border-red-500 bg-red-50/40"
          : "border-[#d5e0eb]"
      }
      focus:border-[#0787c8]
      focus:ring-2
      focus:ring-[#0787c8]/10
    `;

  const ErrorText = ({
    error,
  }) => {
    if (!error) return null;

    return (
      <p className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    );
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[960px]">

        {/* PAGE HEADER */}

        <div className="mb-7 flex items-start gap-5">

          <button
            type="button"
            onClick={handleBackToInventory}
            disabled={loading}
            className="
              mt-1 flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-[14px]
              border border-[#d7e0e9]
              bg-white
              text-[#536b82]
              shadow-sm
              transition
              hover:bg-[#f7fafc]
              hover:text-[#0787c8]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            title="Back to Inventory"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#172b4d]">
              Add New Inventory
            </h1>

            <p className="mt-2 text-[16px] text-[#66809f]">
              Add new sports inventory and
              define stock details.
            </p>
          </div>

        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-[18px] border border-[#dbe4ed] bg-white shadow-sm">

          {/* DARK HEADER */}

          <div className="bg-[#0f172a] px-7 py-9 text-white sm:px-10">

            <div className="flex items-center gap-5">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1e293b]">
                <PackagePlus className="h-7 w-7 text-[#4cc4ff]" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Inventory Information
                </h2>

                <p className="mt-1.5 text-sm text-slate-300">
                  Select the sport and enter
                  sub-items, brands and stock
                  details.
                </p>
              </div>

            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-7 sm:p-10"
          >

            {/* GENERAL ERROR */}

            {errors.general && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errors.general}
              </div>
            )}

            {/* API ERROR */}

            {apiError &&
              !errors.general && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {apiError}
                </div>
              )}

            {/* SUCCESS */}

            {successMessage && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                {successMessage}
              </div>
            )}

            {/* SPORT */}

            <section className="rounded-[18px] border border-[#dbe4ed] bg-white p-6 sm:p-7">

              <div className="mb-7 flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef8ff]">
                  <Trophy className="h-5 w-5 text-[#0787c8]" />
                </div>

                <div>
                  <h3 className="font-semibold text-[#173653]">
                    Sport Selection
                  </h3>

                  <p className="mt-1 text-sm text-[#8296aa]">
                    Select an existing active sport
                    from the academy.
                  </p>
                </div>

              </div>

              <label className="mb-2 block text-sm font-semibold text-[#294560]">
                Sport{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                ref={(element) =>
                  setFieldRef(
                    "sport",
                    element
                  )
                }
                value={selectedSport}
                disabled={sportsLoading}
                onChange={(event) => {
                  setSelectedSport(
                    event.target.value
                  );

                  setErrors(
                    (previous) => {
                      const next = {
                        ...previous,
                      };

                      delete next.sport;
                      delete next.general;

                      return next;
                    }
                  );

                  setApiError("");
                  setSuccessMessage("");
                }}
                className={fieldClass(
                  errors.sport
                )}
              >
                <option value="">
                  {sportsLoading
                    ? "Loading sports..."
                    : "Select Sport"}
                </option>

                {sports.map(
                  (sport) => (
                    <option
                      key={sport.id}
                      value={sport.id}
                    >
                      {sport.sportsName ||
                        sport.sportName ||
                        sport.name}
                    </option>
                  )
                )}
              </select>

              <ErrorText
                error={errors.sport}
              />

              {!sportsLoading &&
                sports.length ===
                  0 && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    No active sports found.
                  </p>
                )}

              {sportsLoading && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#7c91a7]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading sports from
                  database...
                </div>
              )}

            </section>

            {/* ITEMS */}

            <div className="mt-7">

              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                <div>
                  <h3 className="text-lg font-bold text-[#173653]">
                    Inventory Items
                  </h3>

                  <p className="mt-1 text-sm text-[#8296aa]">
                    Add sub-items and multiple
                    brands under each sub-item.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eef8ff] px-3 py-1.5 text-xs font-semibold text-[#0787c8]">
                  <Users className="h-3.5 w-3.5" />
                  {items.length}{" "}
                  {items.length === 1
                    ? "Item"
                    : "Items"}
                </span>

              </div>

              <div className="space-y-6">

                {items.map(
                  (
                    item,
                    itemIndex
                  ) => (
                    <section
                      key={itemIndex}
                      className="rounded-[18px] border border-[#dbe4ed] bg-[#fbfdff] p-5 sm:p-7"
                    >

                      {/* ITEM HEADER */}

                      <div className="mb-6 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf6ff] text-sm font-bold text-[#0787c8]">
                            {itemIndex +
                              1}
                          </div>

                          <div>
                            <h4 className="font-semibold text-[#23415f]">
                              Item{" "}
                              {itemIndex +
                                1}
                            </h4>

                            <p className="text-xs text-[#8799ac]">
                              Sub item and brand
                              details
                            </p>
                          </div>

                        </div>

                        {items.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveItem(
                                itemIndex
                              )
                            }
                            className="flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        )}

                      </div>

                      {/* SUB ITEM */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#294560]">
                          Sub Item{" "}
                          <span className="text-red-500">
                            *
                          </span>
                        </label>

                        <input
                          ref={(element) =>
                            setFieldRef(
                              subItemKey(
                                itemIndex
                              ),
                              element
                            )
                          }
                          type="text"
                          value={
                            item.subItem
                          }
                          placeholder="e.g. Bat, Ball, Stump"
                          onChange={(
                            event
                          ) =>
                            handleSubItemChange(
                              itemIndex,
                              event.target
                                .value
                            )
                          }
                          onBlur={() =>
                            validateSingleField(
                              itemIndex,
                              0,
                              "subItem"
                            )
                          }
                          className={fieldClass(
                            errors[
                              subItemKey(
                                itemIndex
                              )
                            ]
                          )}
                        />

                        <ErrorText
                          error={
                            errors[
                              subItemKey(
                                itemIndex
                              )
                            ]
                          }
                        />
                      </div>

                      {/* BRANDS */}

                      <div className="mt-6">

                        <div className="mb-4 flex items-center justify-between">

                          <div>
                            <h5 className="text-sm font-bold text-[#23415f]">
                              Brands
                            </h5>

                            <p className="mt-1 text-xs text-[#8799ac]">
                              Add one or more brands
                              for this sub item.
                            </p>
                          </div>

                          <span className="rounded-full bg-[#eef8ff] px-3 py-1 text-xs font-semibold text-[#0787c8]">
                            {
                              item.brands
                                .length
                            }{" "}
                            {item.brands
                              .length ===
                            1
                              ? "Brand"
                              : "Brands"}
                          </span>

                        </div>

                        <div className="space-y-4">

                          {item.brands.map(
                            (
                              brand,
                              brandIndex
                            ) => (
                              <div
                                key={
                                  brandIndex
                                }
                                className="rounded-[16px] border border-[#dbe4ed] bg-white p-5"
                              >

                                {/* BRAND HEADER */}

                                <div className="mb-5 flex items-center justify-between">

                                  <div className="flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef8ff] text-xs font-bold text-[#0787c8]">
                                      {brandIndex +
                                        1}
                                    </div>

                                    <span className="text-sm font-semibold text-[#294560]">
                                      Brand{" "}
                                      {brandIndex +
                                        1}
                                    </span>

                                  </div>

                                  {item.brands
                                    .length >
                                    1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveBrand(
                                          itemIndex,
                                          brandIndex
                                        )
                                      }
                                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Remove
                                    </button>
                                  )}

                                </div>

                                {/* BRAND */}

                                <div>
                                  <label className="mb-2 block text-sm font-semibold text-[#294560]">
                                    Brand{" "}
                                    <span className="text-red-500">
                                      *
                                    </span>
                                  </label>

                                  <input
                                    ref={(
                                      element
                                    ) =>
                                      setFieldRef(
                                        brandKey(
                                          itemIndex,
                                          brandIndex
                                        ),
                                        element
                                      )
                                    }
                                    type="text"
                                    value={
                                      brand.brand
                                    }
                                    placeholder="e.g. SG"
                                    onChange={(
                                      event
                                    ) =>
                                      handleBrandTextChange(
                                        itemIndex,
                                        brandIndex,
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                    onBlur={() =>
                                      validateSingleField(
                                        itemIndex,
                                        brandIndex,
                                        "brand"
                                      )
                                    }
                                    className={fieldClass(
                                      errors[
                                        brandKey(
                                          itemIndex,
                                          brandIndex
                                        )
                                      ]
                                    )}
                                  />

                                  <ErrorText
                                    error={
                                      errors[
                                        brandKey(
                                          itemIndex,
                                          brandIndex
                                        )
                                      ]
                                    }
                                  />
                                </div>

                                {/* COST PRICE / SELLING PRICE / QUANTITY / LOW STOCK */}

                                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                                  {/* COST PRICE */}

                                  <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#294560]">
                                      Cost Price{" "}
                                      <span className="text-red-500">
                                        *
                                      </span>
                                    </label>

                                    <div className="relative">

                                      <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ea2b7]" />

                                      <input
                                        ref={(
                                          element
                                        ) =>
                                          setFieldRef(
                                            costPriceKey(
                                              itemIndex,
                                              brandIndex
                                            ),
                                            element
                                          )
                                        }
                                        type="text"
                                        inputMode="decimal"
                                        value={
                                          brand.costPrice
                                        }
                                        placeholder="3500"
                                        onChange={(
                                          event
                                        ) =>
                                          handleNumberChange(
                                            itemIndex,
                                            brandIndex,
                                            "costPrice",
                                            event
                                              .target
                                              .value,
                                            true
                                          )
                                        }
                                        onBlur={() =>
                                          validateSingleField(
                                            itemIndex,
                                            brandIndex,
                                            "costPrice"
                                          )
                                        }
                                        className={`${fieldClass(
                                          errors[
                                            costPriceKey(
                                              itemIndex,
                                              brandIndex
                                            )
                                          ]
                                        )} pl-10`}
                                      />

                                    </div>

                                    <ErrorText
                                      error={
                                        errors[
                                          costPriceKey(
                                            itemIndex,
                                            brandIndex
                                          )
                                        ]
                                      }
                                    />
                                  </div>

                                  {/* SELLING PRICE */}

                                  <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#294560]">
                                      Selling Price{" "}
                                      <span className="text-red-500">
                                        *
                                      </span>
                                    </label>

                                    <div className="relative">

                                      <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ea2b7]" />

                                      <input
                                        ref={(
                                          element
                                        ) =>
                                          setFieldRef(
                                            priceKey(
                                              itemIndex,
                                              brandIndex
                                            ),
                                            element
                                          )
                                        }
                                        type="text"
                                        inputMode="decimal"
                                        value={
                                          brand.sellingPrice
                                        }
                                        placeholder="4800"
                                        onChange={(
                                          event
                                        ) =>
                                          handleNumberChange(
                                            itemIndex,
                                            brandIndex,
                                            "sellingPrice",
                                            event
                                              .target
                                              .value,
                                            true
                                          )
                                        }
                                        onBlur={() =>
                                          validateSingleField(
                                            itemIndex,
                                            brandIndex,
                                            "sellingPrice"
                                          )
                                        }
                                        className={`${fieldClass(
                                          errors[
                                            priceKey(
                                              itemIndex,
                                              brandIndex
                                            )
                                          ]
                                        )} pl-10`}
                                      />

                                    </div>

                                    <ErrorText
                                      error={
                                        errors[
                                          priceKey(
                                            itemIndex,
                                            brandIndex
                                          )
                                        ]
                                      }
                                    />
                                  </div>

                                  {/* QUANTITY */}

                                  <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#294560]">
                                      Total Quantity{" "}
                                      <span className="text-red-500">
                                        *
                                      </span>
                                    </label>

                                    <input
                                      ref={(
                                        element
                                      ) =>
                                        setFieldRef(
                                          quantityKey(
                                            itemIndex,
                                            brandIndex
                                          ),
                                          element
                                        )
                                      }
                                      type="text"
                                      inputMode="numeric"
                                      value={
                                        brand.quantity
                                      }
                                      placeholder="20"
                                      onChange={(
                                        event
                                      ) =>
                                        handleNumberChange(
                                          itemIndex,
                                          brandIndex,
                                          "quantity",
                                          event
                                            .target
                                            .value
                                        )
                                      }
                                      onBlur={() =>
                                        validateSingleField(
                                          itemIndex,
                                          brandIndex,
                                          "quantity"
                                        )
                                      }
                                      className={fieldClass(
                                        errors[
                                          quantityKey(
                                            itemIndex,
                                            brandIndex
                                          )
                                        ]
                                      )}
                                    />

                                    <ErrorText
                                      error={
                                        errors[
                                          quantityKey(
                                            itemIndex,
                                            brandIndex
                                          )
                                        ]
                                      }
                                    />
                                  </div>

                                  {/* LOW STOCK */}

                                  <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#294560]">
                                      Low Stock Alert{" "}
                                      <span className="text-red-500">
                                        *
                                      </span>
                                    </label>

                                    <input
                                      ref={(
                                        element
                                      ) =>
                                        setFieldRef(
                                          lowStockKey(
                                            itemIndex,
                                            brandIndex
                                          ),
                                          element
                                        )
                                      }
                                      type="text"
                                      inputMode="numeric"
                                      value={
                                        brand.lowStockAlert
                                      }
                                      placeholder="5"
                                      onChange={(
                                        event
                                      ) =>
                                        handleNumberChange(
                                          itemIndex,
                                          brandIndex,
                                          "lowStockAlert",
                                          event
                                            .target
                                            .value
                                        )
                                      }
                                      onBlur={() =>
                                        validateSingleField(
                                          itemIndex,
                                          brandIndex,
                                          "lowStockAlert"
                                        )
                                      }
                                      className={fieldClass(
                                        errors[
                                          lowStockKey(
                                            itemIndex,
                                            brandIndex
                                          )
                                        ]
                                      )}
                                    />

                                    <ErrorText
                                      error={
                                        errors[
                                          lowStockKey(
                                            itemIndex,
                                            brandIndex
                                          )
                                        ]
                                      }
                                    />
                                  </div>

                                </div>

                                <p className="mt-4 text-xs text-[#8296aa]">
                                  Stock quantity entered
                                  here becomes the
                                  opening/current stock
                                  for this brand.
                                </p>

                              </div>
                            )
                          )}

                        </div>

                        {/* ADD ANOTHER BRAND */}

                        <button
                          type="button"
                          onClick={() =>
                            handleAddAnotherBrand(
                              itemIndex
                            )
                          }
                          disabled={loading}
                          className="
                            mt-4 flex h-11 w-full
                            items-center justify-center
                            gap-2 rounded-xl
                            border border-dashed
                            border-[#b9dff2]
                            bg-[#f8fcff]
                            text-sm font-semibold
                            text-[#0787c8]
                            transition
                            hover:border-[#0787c8]
                            hover:bg-[#eef9ff]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Brand
                        </button>

                      </div>

                    </section>
                  )
                )}

              </div>

              {/* ADD ANOTHER ITEM */}

              <button
                type="button"
                onClick={
                  handleAddAnotherItem
                }
                disabled={loading}
                className="
                  mt-6 flex h-12 w-full
                  items-center justify-center
                  gap-2 rounded-xl
                  border-2 border-dashed
                  border-[#b9dff2]
                  bg-[#f8fcff]
                  text-sm font-semibold
                  text-[#0787c8]
                  transition
                  hover:border-[#0787c8]
                  hover:bg-[#eef9ff]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <Plus className="h-4 w-4" />
                Add Another Item
              </button>

            </div>

            {/* BOTTOM ACTION BAR */}

            <div className="mt-8 border-t border-[#e4ebf1] pt-7">

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">

               <button
  type="button"
  onClick={handleCancel}
  disabled={loading}
  className="
    h-12 rounded-xl
    border border-[#d4deea]
    bg-white px-7
    font-semibold
    text-[#536b86]
    transition
    hover:bg-[#f7fafc]
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  Cancel
</button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    sportsLoading
                  }
                  className="
                    flex h-12
                    min-w-[190px]
                    items-center
                    justify-center
                    gap-2 rounded-xl
                    bg-[#0787c8]
                    px-7
                    font-semibold
                    text-white
                    shadow-md
                    transition
                    hover:bg-[#0678b3]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding Inventory...
                    </>
                  ) : (
                    <>
                      <PackagePlus className="h-4 w-4" />
                      Add Inventory
                    </>
                  )}
                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AddInventory;