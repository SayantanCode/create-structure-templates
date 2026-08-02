// Triggers a browser file download from a Blob (e.g. an export/report
// response from apiClient with `responseType: "blob"`), with the given
// filename — the DOM dance (anchor + click + revoke) every "export to CSV"
// button needs, written once.
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function downloadFromResponse(apiClientPromise, filename) {
  const response = await apiClientPromise;
  downloadBlob(response.data, filename);
}
