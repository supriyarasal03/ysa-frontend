import axiosClient from "../api/axiosClient";

/**
 * Securely View or Download a file (with JWT token)
 */
export const viewOrDownloadFile = async (
  fileUrl,
  fileName = "document",
  download = false
) => {
  if (!fileUrl) {
    alert("File not available");
    return;
  }

  try {
    const url = fileUrl.startsWith("http")
      ? fileUrl
      : `http://localhost:8080${fileUrl}`;

    const response = await axiosClient.get(url, {
      responseType: "blob",
    });

    // Get correct content type from response
    const contentType =
      response.headers["content-type"] ||
      response.headers["Content-Type"] ||
      "application/octet-stream";

    const blob = new Blob([response.data], { type: contentType });
    const blobUrl = window.URL.createObjectURL(blob);

    if (download) {
      // Force download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Open in new tab for viewing
      const newWindow = window.open(blobUrl, "_blank");

      // If browser blocks popup
      if (!newWindow) {
        alert("Please allow popups to view the file");
      }
    }

    // Clean memory after some time
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 30000);
  } catch (error) {
    console.error("File open error:", error);

    if (error?.response?.status === 401) {
      alert("Session expired. Please login again.");
    } else {
      alert("Unable to open the file. Please try again.");
    }
  }
};