/**
 * API client for Tsinghua Card system
 * Handles data fetching and AES-128-ECB decryption
 */

import CryptoJS from "crypto-js";
import type { FetchDataRequest, ApiResponse, DecryptedResponse, RawTransaction } from "./types";

const API_URL = "https://card.tsinghua.edu.cn/business/querySelfTradeList";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

/**
 * Decrypt AES-128-ECB encrypted data
 * Format: key(16 chars) + base64(encrypted data)
 */
function decryptAesEcb(encrypted: string): string {
  try {
    console.log("[DECRYPT] Encrypted data length:", encrypted.length);
    const key = encrypted.substring(0, 16);
    const data = encrypted.substring(16);
    console.log("[DECRYPT] Key:", key, "Data length:", data.length);

    const decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("[DECRYPT] Decrypted length:", result.length);

    const parsed = JSON.parse(result);
    console.log("[DECRYPT] Success - records:", parsed.resultData?.rows?.length || 0);

    return result;
  } catch (error) {
    console.error("[DECRYPT] Failed:", error);
    throw new Error(`Decryption failed: ${error}`);
  }
}

/**
 * Fetch a single page of transaction data
 */
async function fetchPage(
  request: FetchDataRequest,
  serviceHallCookie: string,
  attempt: number = 0,
): Promise<DecryptedResponse> {
  try {
    const sanitized = { ...request, idserial: "***" };
    console.log("[API-REQ] Request:", sanitized);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `servicehall=${serviceHallCookie}`,
      },
      body: JSON.stringify(request),
    });

    console.log("[API-RES] Status:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json: ApiResponse = await response.json();
    console.log("[API-RES] Data received:", json.data ? `${json.data.length} chars` : "null");

    if (!json.data) {
      throw new Error("API response missing data field");
    }

    const decryptedData = decryptAesEcb(json.data);
    const parsed: DecryptedResponse = JSON.parse(decryptedData);

    console.log("[API-RES] Total records in response:", parsed.resultData?.total || 0);
    console.log("[API-RES] Rows in this page:", parsed.resultData?.rows?.length || 0);

    return parsed;
  } catch (error) {
    console.error("[API-ERR] Attempt", attempt + 1, "failed:", error);

    if (attempt < MAX_RETRIES - 1) {
      const delay = RETRY_DELAY * (attempt + 1);
      console.log(`[API-RETRY] Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchPage(request, serviceHallCookie, attempt + 1);
    }

    throw error;
  }
}

/**
 * Fetch all transaction data for a date range
 * Handles pagination automatically
 */
export async function fetchData(
  userId: string,
  serviceHallCookie: string,
  startDate: string = "2025-01-01",
  endDate: string = "2025-12-31",
): Promise<RawTransaction[]> {
  const allData: RawTransaction[] = [];
  let pageNumber = 0;
  const pageSize = 1000;

  console.log("[FETCH] Starting fetch for user:", userId);
  console.log("[FETCH] Date range:", startDate, "to", endDate);

  while (true) {
    const request: FetchDataRequest = {
      pageNumber,
      pageSize,
      starttime: startDate,
      endtime: endDate,
      idserial: userId,
      tradetype: "-1",
    };

    console.log("[FETCH] Fetching page:", pageNumber);
    const response = await fetchPage(request, serviceHallCookie);
    const { rows, total } = response.resultData;

    console.log("[FETCH] Page", pageNumber, "- got", rows.length, "rows, total available:", total);

    allData.push(...rows);

    // Check if we've fetched all data
    if (total < (pageNumber + 1) * pageSize) {
      console.log("[FETCH] All pages fetched. Breaking...");
      break;
    }

    pageNumber++;
  }

  console.log("[FETCH] Total raw records:", allData.length);

  // Clean data: filter out invalid entries
  const cleanedData = allData.filter((row) => {
    if (row.meraddr === "-") {
      if (row.mername) {
        row.meraddr = row.mername.split("_")[0];
        return true;
      } else {
        return false;
      }
    }
    return true;
  });

  console.log("[FETCH] After cleaning:", cleanedData.length, "records");

  return cleanedData;
}

/**
 * Get servicehall cookie from browser
 */
export async function getServiceHallCookie(): Promise<string | null> {
  try {
    console.log("[COOKIE] Attempting to get servicehall cookie...");
    const cookie = await browser.cookies.get({
      url: "https://card.tsinghua.edu.cn",
      name: "servicehall",
    });

    console.log("[COOKIE] Cookie object:", cookie);

    if (cookie && cookie.value) {
      console.log("[COOKIE] Found cookie, length:", cookie.value.length);
      return cookie.value;
    }

    console.error("[COOKIE] Cookie not found or empty");
    return null;
  } catch (error) {
    console.error("[COOKIE] Error getting cookie:", error);
    return null;
  }
}
