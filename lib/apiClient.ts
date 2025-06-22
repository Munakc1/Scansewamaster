import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.caresewa.in/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchWithFallback<T>(
  primaryUrl: string,
  fallbackKey: string,
  config?: any
): Promise<T> {
  try {
    const res = await apiClient(primaryUrl, config);
    return res.data;
  } catch (error) {
    console.warn(`[Fallback Triggered]: ${error}`);
    
    try {
      const fallbackRes = await axios.get("/mock/data.json");
      const allMockData = fallbackRes.data;
      
      const fallbackData = fallbackKey
        ? fallbackKey.split(".").reduce((obj, key) => obj?.[key], allMockData)
        : allMockData;

      if (fallbackData === undefined) {
        throw new Error(`Fallback key "${fallbackKey}" not found`);
      }

      return fallbackData;
    } catch (fallbackError) {
      console.error("Fallback failed:", fallbackError);
      throw new Error("No data available");
    }
  }
}

export default apiClient;