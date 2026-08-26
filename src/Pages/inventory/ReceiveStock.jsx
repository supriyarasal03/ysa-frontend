import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllSports,
  searchInventory,
  receiveStock,
} from "./inventoryApi";

const ReceiveStock = ({
  onClose,
  onSuccess,
}) => {
  const [sports, setSports] =
    useState([]);

  const [selectedSport, setSelectedSport] =
    useState("");

  const [subItem, setSubItem] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [items, setItems] =
    useState([]);

  const [selectedInventory, setSelectedInventory] =
    useState(null);

  const [quantity, setQuantity] =
    useState("");

  const [errors, setErrors] =
    useState({});

    const navigate = useNavigate(); 

  const [apiError, setApiError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const fieldRefs =
    useRef({});

  // ==========================================================
  // LOAD SPORTS
  // ==========================================================

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      const response =
        await getAllSports();

      setSports(
        (response?.data || []).filter(
          (sport) =>
            sport.status === "ACTIVE"
        )
      );
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
          "Unable to load sports."
      );
    }
  };

  // ==========================================================
  // FOCUS
  // ==========================================================

  const registerRef = (
    key,
    element
  ) => {
    if (element) {
      fieldRefs.current[key] =
        element;
    }
  };

  const focusField = (key) => {
    setTimeout(() => {
      fieldRefs.current[
        key
      ]?.focus();
    }, 50);
  };

  // ==========================================================
  // TEXT VALIDATION
  // ==========================================================

  const isTextValid = (value) =>
    /^[A-Za-z][A-Za-z\s.&'-]*$/.test(
      value.trim()
    );

  // ==========================================================
  // SEARCH
  // ==========================================================

  const findInventory = async () => {
    setErrors({});
    setApiError("");
    setSelectedInventory(null);
    setItems([]);

    if (!selectedSport) {
      setErrors({
        sport:
          "Sport is required.",
      });

      focusField("sport");
      return;
    }

    if (!subItem.trim()) {
      setErrors({
        subItem:
          "Sub item is required.",
      });

      focusField("subItem");
      return;
    }

    if (!isTextValid(subItem)) {
      setErrors({
        subItem:
          "Sub item can contain letters and spaces only.",
      });

      focusField("subItem");
      return;
    }

    if (!brand.trim()) {
      setErrors({
        brand:
          "Brand is required.",
      });

      focusField("brand");
      return;
    }

    if (!isTextValid(brand)) {
      setErrors({
        brand:
          "Brand can contain letters and spaces only.",
      });

      focusField("brand");
      return;
    }

    setSearchLoading(true);

    try {
      const response =
        await searchInventory({
          sportId: selectedSport,
          subItem,
          brand,
        });

      const result =
        response?.data || [];

      setItems(result);

      if (result.length === 0) {
        setApiError(
          "No inventory found for the selected Sport, Sub Item and Brand."
        );
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
          "Unable to search inventory."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // ==========================================================
  // QUANTITY VALIDATION
  // ==========================================================

  const validateQuantity = () => {
    const newErrors = {};

    if (!quantity) {
      newErrors.quantity =
        "Received quantity is required.";
    } else if (
      !/^\d+$/.test(
        String(quantity)
      )
    ) {
      newErrors.quantity =
        "Quantity must contain numbers only.";
    } else if (
      Number(quantity) <= 0
    ) {
      newErrors.quantity =
        "Received quantity must be greater than zero.";
    }

    return newErrors;
  };

  // ==========================================================
  // RECEIVE
  // ==========================================================

  const handleReceiveStock =
    async (event) => {
      event.preventDefault();

      setApiError("");
      setSuccessMessage("");

      if (!selectedInventory) {
        setApiError(
          "Please select an existing inventory item."
        );
        return;
      }

      const validationErrors =
        validateQuantity();

      setErrors(
        validationErrors
      );

      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {
        focusField("quantity");
        return;
      }

      setLoading(true);

      try {
        await receiveStock(
          selectedInventory.id,
          {
            quantity:
              Number(quantity),
          }
        );

        setSuccessMessage(
          "Stock received successfully."
        );

        setQuantity("");
        setErrors({});

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        const backendErrors =
          error?.response?.data?.data ||
          {};

        if (
          Object.keys(
            backendErrors
          ).length > 0
        ) {
          setErrors(
            backendErrors
          );

          focusField(
            Object.keys(
              backendErrors
            )[0]
          );
        } else {
          setApiError(
            error?.response?.data?.message ||
              "Unable to receive stock."
          );

          focusField(
            "quantity"
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f3f7fb] px-6 py-7 lg:px-10">

      {/* HEADER */}

      <div className="mb-7">
        <h1 className="text-3xl font-bold text-[#172b4d]">
          Receive Stock
        </h1>

        <p className="mt-2 text-[16px] text-[#66809f]">
          Add new stock to an existing
          inventory item
        </p>
      </div>

      {/* CARD */}

      <div className="mx-auto max-w-[900px] rounded-[18px] border border-[#dce5ed] bg-white p-6 shadow-sm lg:p-8">

        {/* SPORT */}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-[#415d79]">
            Sport{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            ref={(element) =>
              registerRef(
                "sport",
                element
              )
            }
            value={selectedSport}
            onChange={(event) => {
              setSelectedSport(
                event.target.value
              );

              setSelectedInventory(
                null
              );

              setItems([]);

              setErrors({});
              setApiError("");
            }}
            className={`h-12 w-full rounded-xl border bg-white px-4 text-[#263e5a] outline-none ${
              errors.sport
                ? "border-red-500"
                : "border-[#d5e0eb]"
            } focus:border-[#0787c8]`}
          >
            <option value="">
              Select Sport
            </option>

            {sports.map((sport) => (
              <option
                key={sport.id}
                value={sport.id}
              >
                {sport.sportsName}
              </option>
            ))}
          </select>

          {errors.sport && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.sport}
            </p>
          )}
        </div>

        {/* SUB ITEM */}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-[#415d79]">
            Sub Item{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            ref={(element) =>
              registerRef(
                "subItem",
                element
              )
            }
            type="text"
            value={subItem}
            placeholder="Enter sub item"
            onChange={(event) => {
              const value =
                event.target.value.replace(
                  /[^A-Za-z\s.&'-]/g,
                  ""
                );

              setSubItem(value);
              setErrors({});
              setApiError("");
            }}
            className={`h-12 w-full rounded-xl border px-4 text-[#263e5a] outline-none ${
              errors.subItem
                ? "border-red-500 bg-red-50"
                : "border-[#d5e0eb]"
            } focus:border-[#0787c8]`}
          />

          {errors.subItem && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.subItem}
            </p>
          )}
        </div>

        {/* BRAND */}

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-[#415d79]">
            Brand{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            ref={(element) =>
              registerRef(
                "brand",
                element
              )
            }
            type="text"
            value={brand}
            placeholder="Enter brand"
            onChange={(event) => {
              const value =
                event.target.value.replace(
                  /[^A-Za-z\s.&'-]/g,
                  ""
                );

              setBrand(value);
              setErrors({});
              setApiError("");
            }}
            className={`h-12 w-full rounded-xl border px-4 text-[#263e5a] outline-none ${
              errors.brand
                ? "border-red-500 bg-red-50"
                : "border-[#d5e0eb]"
            } focus:border-[#0787c8]`}
          />

          {errors.brand && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.brand}
            </p>
          )}
        </div>

        {/* FIND */}

        <button
          type="button"
          onClick={
            findInventory
          }
          disabled={
            searchLoading
          }
          className="mb-6 h-12 w-full rounded-xl border border-[#0787c8] bg-white font-semibold text-[#0787c8] transition hover:bg-[#eff9ff] disabled:opacity-60"
        >
          {searchLoading
            ? "Searching..."
            : "Find Inventory"}
        </button>

        {/* SEARCH RESULTS */}

        {items.length > 0 && (
          <div className="mb-6 rounded-xl border border-[#e0e8ef] bg-[#f9fcff] p-5">

            <h3 className="mb-4 text-lg font-semibold text-[#203a58]">
              Existing Inventory
            </h3>

            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelectedInventory(
                    item
                  )
                }
                className={`mb-3 flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  selectedInventory?.id ===
                  item.id
                    ? "border-[#0787c8] bg-[#f2faff]"
                    : "border-[#dbe6ee] bg-white hover:border-[#0787c8]"
                }`}
              >

                <div className="flex flex-col gap-1.5">

                  <strong className="text-[#203a58]">
                    {
                      item.sportName
                    }
                    {" → "}
                    {
                      item.subItem
                    }
                    {" → "}
                    {item.brand}
                  </strong>

                  <span className="text-xs text-[#7289a1]">
                    Current Stock:{" "}
                    {
                      item.currentStock
                    }
                  </span>

                </div>

                <span className="font-semibold text-[#172b4d]">
                  ₹
                  {Number(
                    item.sellingPrice
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </button>
            ))}

          </div>
        )}

        {/* SELECTED ITEM */}

        {selectedInventory && (
          <form
            onSubmit={
              handleReceiveStock
            }
          >

            {/* SELECTED BOX */}

            <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-[#cdeafb] bg-[#eef8ff] p-5 sm:grid-cols-2">

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#6b829c]">
                  Selected Inventory
                </span>

                <strong className="text-[#173a5c]">
                  {
                    selectedInventory.sportName
                  }
                  {" → "}
                  {
                    selectedInventory.subItem
                  }
                  {" → "}
                  {
                    selectedInventory.brand
                  }
                </strong>
              </div>

              <div className="flex flex-col gap-1.5 sm:text-right">
                <span className="text-xs text-[#6b829c]">
                  Current Stock
                </span>

                <strong className="text-xl text-[#173a5c]">
                  {
                    selectedInventory.currentStock
                  }
                </strong>
              </div>

            </div>

            {/* QUANTITY */}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                New Stock Received{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                ref={(element) =>
                  registerRef(
                    "quantity",
                    element
                  )
                }
                type="text"
                inputMode="numeric"
                value={quantity}
                placeholder="Enter received quantity"
                onChange={(event) => {
                  const value =
                    event.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );

                  setQuantity(value);

                  setErrors(
                    (previous) => ({
                      ...previous,
                      quantity:
                        undefined,
                    })
                  );

                  setApiError("");
                }}
                className={`h-12 w-full rounded-xl border px-4 text-[#263e5a] outline-none ${
                  errors.quantity
                    ? "border-red-500 bg-red-50"
                    : "border-[#d5e0eb]"
                } focus:border-[#0787c8]`}
              />

              {errors.quantity && (
                <p className="mt-1.5 text-xs text-red-600">
                  {
                    errors.quantity
                  }
                </p>
              )}
            </div>

            {/* ERROR */}

            {apiError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {apiError}
              </div>
            )}

            {/* SUCCESS ABOVE BUTTON */}

            {successMessage && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                {successMessage}
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex justify-end gap-3">

             <button
  type="button"
  onClick={() =>
    navigate("/inventory")
  }
  disabled={loading}
  className="h-12 rounded-xl border border-[#d4deea] bg-white px-7 font-semibold text-[#536b86]"
>
  x``
</button>

              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-xl bg-[#0787c8] px-8 font-semibold text-white shadow-md transition hover:bg-[#0678b3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Receiving..."
                  : "Receive Stock"}
              </button>

            </div>

          </form>
        )}

        {/* GENERAL ERROR */}

        {apiError &&
          !selectedInventory && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {apiError}
            </div>
          )}

      </div>
    </div>
  );
};

export default ReceiveStock;