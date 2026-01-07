export function formatDateTime(input?: string): string {
  if (!input) return "";

  const d = new Date(input);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}


export function toISO(value: string) {
  if (!value) return null;
  return new Date(value).toISOString();
}