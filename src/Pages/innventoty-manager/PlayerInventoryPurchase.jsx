import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPurchaseSports,
  getPurchaseBatches,
  getPurchasePlayers,
  getPurchaseInventory,
  purchaseInventory,
  generateUpiQr,
} from "./playerInventoryPurchaseApi";

const PlayerInventoryPurchase = () => {

  // =========================================================
  // SELECTIONS
  // =========================================================

  const [sportId, setSportId] =
    useState("");

  const [batchId, setBatchId] =
    useState("");

  const [playerId, setPlayerId] =
    useState("");

  const [inventoryId, setInventoryId] =
    useState("");

  const [quantity, setQuantity] =
    useState("1");

  const [paymentMethod, setPaymentMethod] =
    useState("");


  // =========================================================
  // UPI SCREENSHOT
  // =========================================================

  const [upiScreenshot, setUpiScreenshot] =
    useState(null);


  // =========================================================
  // DATA
  // =========================================================

  const [sports, setSports] =
    useState([]);

  const [batches, setBatches] =
    useState([]);

  const [players, setPlayers] =
    useState([]);

  const [inventory, setInventory] =
    useState([]);


  // =========================================================
  // UPI QR
  // =========================================================

  const [upiQr, setUpiQr] =
    useState(null);

  const [upiQrLoading, setUpiQrLoading] =
    useState(false);


  // =========================================================
  // LOADING
  // =========================================================

  const [sportsLoading, setSportsLoading] =
    useState(false);

  const [batchesLoading, setBatchesLoading] =
    useState(false);

  const [playersLoading, setPlayersLoading] =
    useState(false);

  const [inventoryLoading, setInventoryLoading] =
    useState(false);

  const [purchaseLoading, setPurchaseLoading] =
    useState(false);


  // =========================================================
  // MESSAGES
  // =========================================================

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // =========================================================
  // LOAD SPORTS
  // =========================================================

  useEffect(() => {

    loadSports();

  }, []);


  const loadSports = async () => {

    try {

      setSportsLoading(true);
      setError("");

      const response =
        await getPurchaseSports();

      setSports(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      setError(
        err?.message ||
        "Unable to load sports."
      );

    } finally {

      setSportsLoading(false);

    }

  };


  // =========================================================
  // SPORT CHANGE
  // =========================================================

  const handleSportChange = async (
    event
  ) => {

    const value =
      event.target.value;

    setSportId(value);

    setBatchId("");
    setPlayerId("");
    setInventoryId("");
    setQuantity("1");
    setPaymentMethod("");
    setUpiScreenshot(null);
    setUpiQr(null);

    setBatches([]);
    setPlayers([]);
    setInventory([]);

    setError("");
    setSuccessMessage("");

    if (!value) {
      return;
    }


    // -------------------------------------------------------
    // LOAD ONGOING BATCHES
    // -------------------------------------------------------

    try {

      setBatchesLoading(true);

      const response =
        await getPurchaseBatches(value);

      setBatches(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      setError(
        err?.message ||
        "Unable to load ongoing batches."
      );

    } finally {

      setBatchesLoading(false);

    }


    // -------------------------------------------------------
    // LOAD INVENTORY
    // -------------------------------------------------------

    try {

      setInventoryLoading(true);

      const response =
        await getPurchaseInventory(value);

      setInventory(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      setError(
        err?.message ||
        "Unable to load inventory."
      );

    } finally {

      setInventoryLoading(false);

    }

  };


  // =========================================================
  // BATCH CHANGE
  // =========================================================

  const handleBatchChange = async (
    event
  ) => {

    const value =
      event.target.value;

    setBatchId(value);

    setPlayerId("");
    setPaymentMethod("");
    setUpiScreenshot(null);
    setUpiQr(null);

    setPlayers([]);

    setError("");
    setSuccessMessage("");

    if (!value || !sportId) {
      return;
    }

    try {

      setPlayersLoading(true);

      const response =
        await getPurchasePlayers(
          sportId,
          value
        );

      setPlayers(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      setError(
        err?.message ||
        "Unable to load students."
      );

    } finally {

      setPlayersLoading(false);

    }

  };


  // =========================================================
  // SELECTED INVENTORY
  // =========================================================

  const selectedInventory =
    useMemo(() => {

      return inventory.find(
        (item) =>
          String(item?.id) ===
          String(inventoryId)
      );

    }, [
      inventory,
      inventoryId,
    ]);


  // =========================================================
  // AVAILABLE STOCK
  // =========================================================

  const availableStock =
    Number(
      selectedInventory?.currentStock ??
      selectedInventory?.stock ??
      0
    );


  // =========================================================
  // SELLING PRICE
  // =========================================================

  const sellingPrice =
    Number(
      selectedInventory?.sellingPrice ??
      selectedInventory?.unitPrice ??
      0
    );


  // =========================================================
  // TOTAL
  // =========================================================

  const totalAmount =
    sellingPrice *
    Number(quantity || 0);


  // =========================================================
  // GENERATE UPI QR
  // =========================================================

  const loadUpiQr = async () => {

    if (
      paymentMethod !== "UPI" ||
      totalAmount <= 0
    ) {

      setUpiQr(null);

      return;

    }

    try {

      setUpiQrLoading(true);
      setError("");

      const response =
        await generateUpiQr(
          totalAmount.toFixed(2)
        );

      if (!response?.success) {

        throw new Error(
          response?.message ||
          "Unable to generate UPI QR."
        );

      }

      setUpiQr(
        response?.data || null
      );

    } catch (err) {

      setUpiQr(null);

      setError(
        err?.message ||
        "Unable to generate UPI QR."
      );

    } finally {

      setUpiQrLoading(false);

    }

  };


  // =========================================================
  // INVENTORY CHANGE
  // =========================================================

  const handleInventoryChange = (
    event
  ) => {

    setInventoryId(
      event.target.value
    );

    setQuantity("1");
    setPaymentMethod("");
    setUpiScreenshot(null);
    setUpiQr(null);

    setError("");
    setSuccessMessage("");

  };


  // =========================================================
  // QUANTITY CHANGE
  // =========================================================

  const handleQuantityChange = (
    event
  ) => {

    const value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 5);

    setQuantity(value);

    setUpiScreenshot(null);
    setUpiQr(null);

    setError("");
    setSuccessMessage("");

  };


  // =========================================================
  // PAYMENT METHOD CHANGE
  // =========================================================

  const handlePaymentMethodChange = (
    event
  ) => {

    const value =
      event.target.value;

    setPaymentMethod(value);

    setError("");
    setSuccessMessage("");

    // Clear screenshot when switching to Cash
    if (value === "CASH") {

      setUpiScreenshot(null);
      setUpiQr(null);

    }

  };


  // =========================================================
  // GENERATE QR WHEN UPI + TOTAL CHANGES
  // =========================================================

  useEffect(() => {

    if (
      paymentMethod === "UPI" &&
      totalAmount > 0
    ) {

      loadUpiQr();

    } else {

      setUpiQr(null);

    }

  }, [
    paymentMethod,
    totalAmount,
  ]);


  // =========================================================
  // UPI SCREENSHOT CHANGE
  // =========================================================

  const handleUpiScreenshotChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    setError("");

    if (!file) {

      setUpiScreenshot(null);

      return;

    }


    // -------------------------------------------------------
    // FILE TYPE VALIDATION
    // -------------------------------------------------------

    if (!file.type.startsWith("image/")) {

      setUpiScreenshot(null);

      event.target.value = "";

      setError(
        "Please upload a valid payment screenshot image."
      );

      return;

    }


    // -------------------------------------------------------
    // FILE SIZE VALIDATION
    // -------------------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      setUpiScreenshot(null);

      event.target.value = "";

      setError(
        "Payment screenshot must be less than 5 MB."
      );

      return;

    }


    setUpiScreenshot(file);

  };


  // =========================================================
  // VALIDATION
  // =========================================================

  const validatePurchase = () => {

    if (!sportId) {

      setError(
        "Please select a sport."
      );

      return false;

    }

    if (!batchId) {

      setError(
        "Please select an ongoing batch."
      );

      return false;

    }

    if (!playerId) {

      setError(
        "Please select a student."
      );

      return false;

    }

    if (!inventoryId) {

      setError(
        "Please select an inventory item."
      );

      return false;

    }

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        requestedQuantity
      ) ||
      requestedQuantity <= 0
    ) {

      setError(
        "Quantity must be greater than zero."
      );

      return false;

    }

    if (
      requestedQuantity >
      availableStock
    ) {

      setError(
        `Only ${availableStock} unit(s) available in stock.`
      );

      return false;

    }


    // -------------------------------------------------------
    // PAYMENT METHOD
    // -------------------------------------------------------

    if (!paymentMethod) {

      setError(
        "Please select a payment method."
      );

      return false;

    }


    // -------------------------------------------------------
    // UPI SCREENSHOT
    // -------------------------------------------------------

    if (
      paymentMethod === "UPI" &&
      !upiScreenshot
    ) {

      setError(
        "Please upload the UPI payment screenshot."
      );

      return false;

    }


    return true;

  };


  // =========================================================
  // PURCHASE
  // =========================================================

  const handlePurchase = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!validatePurchase()) {
      return;
    }

    try {

      setPurchaseLoading(true);


      // =====================================================
      // PURCHASE PAYLOAD
      // =====================================================

      const payload = {

        sportId:
          Number(sportId),

        batchId:
          Number(batchId),

        playerId:
          Number(playerId),

        inventoryId:
          Number(inventoryId),

        quantity:
          Number(quantity),

        paymentMethod:
          paymentMethod,

      };


      console.log(
        "Inventory Purchase Payload:",
        payload
      );


      const response =
        await purchaseInventory(
          payload,
          upiScreenshot
        );


      if (!response?.success) {

        throw new Error(
          response?.message ||
          "Inventory purchase failed."
        );

      }


      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccessMessage(
        response?.message ||
        "Inventory purchased successfully."
      );


      // =====================================================
      // UPDATE DISPLAYED STOCK
      // =====================================================

      const purchasedQuantity =
        Number(quantity);


      setInventory(
        (previous) =>
          previous.map(
            (item) => {

              if (
                String(item.id) !==
                String(inventoryId)
              ) {

                return item;

              }


              const currentStock =
                Number(
                  item.currentStock ??
                  item.stock ??
                  0
                );


              return {

                ...item,

                currentStock:
                  Math.max(
                    0,
                    currentStock -
                    purchasedQuantity
                  ),

              };

            }
          )
      );


      // =====================================================
      // RESET PURCHASE FIELDS
      // =====================================================

      setInventoryId("");

      setQuantity("1");

      setPaymentMethod("");

      setUpiScreenshot(null);

      setUpiQr(null);


    } catch (err) {

      setError(
        err?.message ||
        "Unable to complete inventory purchase."
      );

    } finally {

      setPurchaseLoading(false);

    }

  };


  // =========================================================
  // CLEAR FORM
  // =========================================================

  const clearForm = () => {

    setSportId("");

    setBatchId("");

    setPlayerId("");

    setInventoryId("");

    setQuantity("1");

    setPaymentMethod("");

    setUpiScreenshot(null);

    setUpiQr(null);

    setBatches([]);

    setPlayers([]);

    setInventory([]);

    setError("");

    setSuccessMessage("");

  };


  // =========================================================
  // HELPERS
  // =========================================================

  const getSportName = (item) => {

    return (
      item?.sportsName ||
      item?.sportName ||
      item?.name ||
      "-"
    );

  };


  const getBatchName = (item) => {

    return (
      item?.batchName ||
      item?.name ||
      "-"
    );

  };


  const getPlayerName = (item) => {

    return (
      item?.playerName ||
      item?.name ||
      `${item?.firstName || ""} ${item?.lastName || ""}`.trim() ||
      "-"
    );

  };


  const getInventoryName = (item) => {

    if (!item) {
      return "-";
    }

    if (
      item.subItem &&
      item.brand
    ) {

      return `${item.subItem} — ${item.brand}`;

    }

    return (
      item.subItem ||
      item.name ||
      item.itemName ||
      "-"
    );

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen bg-[#f3f7fb] px-6 py-7 lg:px-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-7">

        <h1 className="text-3xl font-bold text-[#172b4d]">
          Player Inventory Purchase
        </h1>

        <p className="mt-2 text-[16px] text-[#66809f]">
          Sell inventory items to students enrolled
          in ongoing batches.
        </p>

      </div>


      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {successMessage && (

        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 font-medium text-green-700">

          {successMessage}

        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-600">

          {error}

        </div>

      )}


      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="rounded-[18px] border border-[#dce5ed] bg-white shadow-sm">

        {/* ===================================================
            CARD HEADER
        =================================================== */}

        <div className="border-b border-[#e7edf3] px-7 py-6">

          <h2 className="text-xl font-bold text-[#172b4d]">
            Purchase Inventory
          </h2>

          <p className="mt-1 text-sm text-[#7b90a7]">
            Select sport, ongoing batch, student and inventory item.
          </p>

        </div>


        {/* ===================================================
            FORM
        =================================================== */}

        <form
          onSubmit={handlePurchase}
          className="p-7"
        >

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


            {/* =================================================
                SPORT
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">

                Sport{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>

              <select
                value={sportId}
                onChange={handleSportChange}
                disabled={
                  sportsLoading ||
                  purchaseLoading
                }
                className="h-12 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[#344b66] outline-none focus:border-[#0787c8] disabled:cursor-not-allowed disabled:bg-[#f3f6f9]"
              >

                <option value="">

                  {sportsLoading
                    ? "Loading sports..."
                    : "Select Sport"}

                </option>

                {sports.map(
                  (sport) => (

                    <option
                      key={
                        sport.id
                      }
                      value={
                        sport.id
                      }
                    >
                      {getSportName(
                        sport
                      )}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* =================================================
                BATCH
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">

                Ongoing Batch{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>

              <select
                value={batchId}
                onChange={handleBatchChange}
                disabled={
                  !sportId ||
                  batchesLoading ||
                  purchaseLoading
                }
                className="h-12 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[#344b66] outline-none focus:border-[#0787c8] disabled:cursor-not-allowed disabled:bg-[#f3f6f9]"
              >

                <option value="">

                  {!sportId
                    ? "Select Sport First"
                    : batchesLoading
                    ? "Loading batches..."
                    : "Select Ongoing Batch"}

                </option>

                {batches.map(
                  (batch) => (

                    <option
                      key={
                        batch.id
                      }
                      value={
                        batch.id
                      }
                    >
                      {getBatchName(
                        batch
                      )}
                    </option>

                  )
                )}

              </select>

              {sportId &&
                !batchesLoading &&
                batches.length ===
                  0 && (

                  <p className="mt-2 text-xs text-[#8a9db1]">
                    No ongoing batches available for this sport.
                  </p>

                )}

            </div>


            {/* =================================================
                STUDENT
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">

                Student{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>

              <select
                value={playerId}
                onChange={(event) => {

                  setPlayerId(
                    event.target.value
                  );

                  setError("");
                  setSuccessMessage("");

                }}
                disabled={
                  !batchId ||
                  playersLoading ||
                  purchaseLoading
                }
                className="h-12 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[#344b66] outline-none focus:border-[#0787c8] disabled:cursor-not-allowed disabled:bg-[#f3f6f9]"
              >

                <option value="">

                  {!batchId
                    ? "Select Batch First"
                    : playersLoading
                    ? "Loading students..."
                    : "Select Student"}

                </option>

                {players.map(
                  (player) => (

                    <option
                      key={
                        player.id ??
                        player.playerId
                      }
                      value={
                        player.id ??
                        player.playerId
                      }
                    >
                      {getPlayerName(
                        player
                      )}
                    </option>

                  )
                )}

              </select>

              {batchId &&
                !playersLoading &&
                players.length ===
                  0 && (

                  <p className="mt-2 text-xs text-[#8a9db1]">
                    No active students found in this batch.
                  </p>

                )}

            </div>


            {/* =================================================
                INVENTORY
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">

                Inventory Item{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>

              <select
                value={inventoryId}
                onChange={handleInventoryChange}
                disabled={
                  !sportId ||
                  inventoryLoading ||
                  purchaseLoading
                }
                className="h-12 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[#344b66] outline-none focus:border-[#0787c8] disabled:cursor-not-allowed disabled:bg-[#f3f6f9]"
              >

                <option value="">

                  {!sportId
                    ? "Select Sport First"
                    : inventoryLoading
                    ? "Loading inventory..."
                    : "Select Inventory Item"}

                </option>

                {inventory
                  .filter(
                    (item) =>
                      String(
                        item?.status ||
                        "ACTIVE"
                      ).toUpperCase() ===
                        "ACTIVE" &&
                      Number(
                        item?.currentStock ??
                        item?.stock ??
                        0
                      ) > 0
                  )
                  .map(
                    (item) => (

                      <option
                        key={
                          item.id
                        }
                        value={
                          item.id
                        }
                      >
                        {getInventoryName(
                          item
                        )}
                        {" — ₹"}
                        {Number(
                          item.sellingPrice ??
                          item.unitPrice ??
                          0
                        ).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                        {" — Stock: "}
                        {Number(
                          item.currentStock ??
                          item.stock ??
                          0
                        )}
                      </option>

                    )
                  )}

              </select>

            </div>

          </div>


          {/* ===================================================
              SELECTED INVENTORY DETAILS
          =================================================== */}

          {selectedInventory && (

            <div className="mt-7 rounded-[16px] border border-[#dce5ed] bg-[#f8fafc] p-6">

              <div className="mb-5">

                <h3 className="text-lg font-bold text-[#172b4d]">
                  Inventory Details
                </h3>

                <p className="mt-1 text-sm text-[#7b90a7]">
                  Current inventory information.
                </p>

              </div>


              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                {/* ITEM */}

                <div>

                  <p className="text-xs font-medium text-[#8295aa]">
                    Item
                  </p>

                  <p className="mt-2 text-[16px] font-semibold text-[#17385c]">
                    {getInventoryName(
                      selectedInventory
                    )}
                  </p>

                </div>


                {/* PRICE */}

                <div>

                  <p className="text-xs font-medium text-[#8295aa]">
                    Selling Price
                  </p>

                  <p className="mt-2 text-[17px] font-semibold text-[#17385c]">

                    ₹
                    {sellingPrice.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}

                  </p>

                </div>


                {/* STOCK */}

                <div>

                  <p className="text-xs font-medium text-[#8295aa]">
                    Available Stock
                  </p>

                  <p className="mt-2 text-[17px] font-semibold text-green-600">
                    {availableStock}
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ===================================================
              QUANTITY + TOTAL
          =================================================== */}

          {selectedInventory && (

            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* QUANTITY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#415d79]">

                  Quantity{" "}

                  <span className="text-red-500">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={
                    purchaseLoading
                  }
                  placeholder="Enter quantity"
                  className="h-12 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[#344b66] outline-none focus:border-[#0787c8] disabled:cursor-not-allowed disabled:bg-[#f3f6f9]"
                />

                <p className="mt-2 text-xs text-[#8a9db1]">
                  Maximum available: {availableStock}
                </p>

              </div>


              {/* TOTAL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                  Total Amount
                </label>

                <div className="flex h-12 items-center rounded-xl border border-[#ccebdc] bg-[#f0fbf5] px-4">

                  <span className="text-xl font-bold text-green-600">

                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}

                  </span>

                </div>

              </div>

            </div>

          )}


          {/* ===================================================
              PAYMENT METHOD
          =================================================== */}

          {selectedInventory && (

            <div className="mt-7">

              <label className="mb-3 block text-sm font-semibold text-[#415d79]">

                Payment Method{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* CASH */}

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-4 transition ${
                    paymentMethod === "CASH"
                      ? "border-[#0787c8] bg-[#f0f9ff]"
                      : "border-[#d5e0eb] bg-white hover:bg-[#f8fafc]"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={
                      paymentMethod ===
                      "CASH"
                    }
                    onChange={
                      handlePaymentMethodChange
                    }
                    disabled={
                      purchaseLoading
                    }
                    className="h-4 w-4"
                  />

                  <div>

                    <p className="font-semibold text-[#17385c]">
                      Cash
                    </p>

                    <p className="mt-1 text-xs text-[#8295aa]">
                      Payment received in cash
                    </p>

                  </div>

                </label>


                {/* UPI */}

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-4 transition ${
                    paymentMethod === "UPI"
                      ? "border-[#0787c8] bg-[#f0f9ff]"
                      : "border-[#d5e0eb] bg-white hover:bg-[#f8fafc]"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={
                      paymentMethod ===
                      "UPI"
                    }
                    onChange={
                      handlePaymentMethodChange
                    }
                    disabled={
                      purchaseLoading
                    }
                    className="h-4 w-4"
                  />

                  <div>

                    <p className="font-semibold text-[#17385c]">
                      UPI
                    </p>

                    <p className="mt-1 text-xs text-[#8295aa]">
                      Payment received through UPI
                    </p>

                  </div>

                </label>

              </div>


              {/* =================================================
                  UPI QR CODE
              ================================================= */}

              {paymentMethod === "UPI" && (

                <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#dce5ed] bg-[#f8fafc] p-6">

                  <h3 className="text-lg font-bold text-[#172b4d]">
                    Scan to Pay
                  </h3>

                  <p className="mt-1 text-sm text-[#7b90a7]">
                    Scan this QR code using any UPI app.
                  </p>


                  {upiQrLoading ? (

                    <div className="mt-5 flex h-[260px] w-[260px] items-center justify-center rounded-xl border border-[#dce5ed] bg-white">

                      <p className="text-sm font-medium text-[#66809f]">
                        Generating QR...
                      </p>

                    </div>

                  ) : upiQr?.qrCodeBase64 ? (

                    <>

                      <div className="mt-5 rounded-xl border border-[#dce5ed] bg-white p-4 shadow-sm">

                        <img
                          src={`data:image/png;base64,${upiQr.qrCodeBase64}`}
                          alt="UPI Payment QR Code"
                          className="h-[300px] w-[300px]"
                        />

                      </div>


                      <p className="mt-4 text-xl font-bold text-green-600">

                        ₹
                        {Number(
                          totalAmount
                        ).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </p>


                      {upiQr.upiId && (

                        <p className="mt-1 text-sm text-[#66809f]">

                          UPI ID:{" "}

                          <span className="font-semibold text-[#344b66]">
                            {upiQr.upiId}
                          </span>

                        </p>

                      )}

                      <p className="mt-2 text-xs text-[#8a9db1]">
                        Please verify the payment before completing the purchase.
                      </p>

                    </>

                  ) : (

                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">

                      Unable to generate UPI QR.

                    </div>

                  )}


                  {/* =================================================
                      UPI SCREENSHOT UPLOAD
                  ================================================= */}

                  <div className="mt-7 w-full max-w-[520px]">

                    <label className="mb-2 block text-sm font-semibold text-[#415d79]">

                      Payment Screenshot{" "}

                      <span className="text-red-500">
                        *
                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleUpiScreenshotChange
                      }
                      disabled={
                        purchaseLoading
                      }
                      className="block w-full cursor-pointer rounded-xl border border-[#d5e0eb] bg-white px-4 py-3 text-sm text-[#344b66] file:mr-4 file:rounded-lg file:border-0 file:bg-[#0787c8] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#0678b3] disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="mt-2 text-xs text-[#8a9db1]">
                      Upload the UPI payment screenshot after completing the payment. Maximum size: 5 MB.
                    </p>


                    {/* FILE NAME */}

                    {upiScreenshot && (

                      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                        <p className="text-sm font-semibold text-green-700">
                          Screenshot selected
                        </p>

                        <p className="mt-1 break-all text-xs text-green-600">
                          {upiScreenshot.name}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              )}

            </div>

          )}


          {/* ===================================================
              BUTTONS
          =================================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e7edf3] pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={clearForm}
              disabled={
                purchaseLoading
              }
              className="h-12 rounded-xl border border-[#d4deea] bg-white px-7 font-semibold text-[#536b86] transition hover:bg-[#f7fafc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear
            </button>


            <button
              type="submit"
              disabled={
                purchaseLoading ||
                !sportId ||
                !batchId ||
                !playerId ||
                !inventoryId ||
                !quantity ||
                !paymentMethod ||
                (
                  paymentMethod === "UPI" &&
                  !upiScreenshot
                )
              }
              className="h-12 min-w-[190px] rounded-xl bg-[#0787c8] px-7 font-semibold text-white shadow-md transition hover:bg-[#0678b3] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {purchaseLoading
                ? "Processing..."
                : "Purchase Inventory"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default PlayerInventoryPurchase;