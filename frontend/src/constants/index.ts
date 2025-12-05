export const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL ||   "http://localhost:8080/api/v1"
    : "/api/v1";
