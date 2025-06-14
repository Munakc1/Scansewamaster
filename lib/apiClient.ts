import axios from "axios";

export async function fetchWithFallback<T>(
  primaryUrl: string,
  fallbackKey: string,
  timeout = 5000
): Promise<T> {
  try {
    const res = await axios.get<T>(primaryUrl, { timeout });
    return res.data;
  } catch (error) {
    console.warn(`[Fallback Triggered]: ${error}`);

    try {
      const fallbackRes = await axios.get("/mock/data.json");
      const allMockData = fallbackRes.data;

      // Support nested fallback keys like "aboutUs.timelineData"
      const keys = fallbackKey.split(".");
      const fallbackData = keys.reduce((obj, key) => obj?.[key], allMockData);

      if (fallbackData === undefined) {
        throw new Error(`Fallback key "${fallbackKey}" not found in mock data`);
      }

      return fallbackData;
    } catch (fallbackError) {
      console.error("Fallback failed:", fallbackError);
      throw new Error("No data available");
    }
  }
}
