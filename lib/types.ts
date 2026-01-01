/**
 * Type definitions for the annual report data
 */

// Raw transaction record from API (decrypted)
export interface RawTransaction {
  txdate: string; // Transaction date
  meraddr: string; // Cafeteria name
  mername: string; // Stall name
  txamt: number; // Amount in cents
  balance: number; // Card balance after transaction
  txcode: string; // Transaction code ("1210" for meals)
}

// Processed transaction
export interface Transaction {
  date: Date;
  cafeteria: string;
  stall: string;
  amount: number;
  balance: number;
  code: string;
}

// Meal (grouped transactions)
export interface Meal {
  date: Date;
  cafeteria: string;
  amount: number;
  numStalls: number;
}

// Report data structure
export interface ReportData {
  // Basic stats
  totalAmount: number;
  totalMeals: number;
  numUniqueCafeterias: number;
  numUniqueStalls: number;

  // Favorite places
  mostVisitedCafeteria: string;
  mostVisitedCafeteriaCount: number;
  mostSpentCafeteria: string;
  mostSpentCafeteriaAmount: number;
  mostSpentStall: string;
  mostSpentStallAmount: number;
  cafeteriasSpent: Array<{ cafeteria: string; amount: number }>;

  // Cost analysis
  mostCostlyCafeteria: string;
  mostCostlyCafeteriaCost: number;
  mostCheapCafeteria: string;
  mostCheapCafeteriaCost: number;

  // Time habits
  breakfastMostFrequent: { hour: number; minute: number; count: number };
  lunchMostFrequent: { hour: number; minute: number; count: number };
  dinnerMostFrequent: { hour: number; minute: number; count: number };
  earliest: Date;
  latest: Date;

  // Special meals
  newYearFirstMeal: { date: Date; cafeteria: string };
  mostExpensiveMealDate: Date;
  mostExpensiveMealAmount: number;
  mostExpensiveMealCafeteria: string;
  mostNumStallsMealDate: Date;
  mostNumStallsMealStalls: number;
  mostNumStallsCafeteria: string;

  // Visit pattern
  numVisitedDates: number;
  maxConsecutiveNoRecordDateBegin: string | null;
  maxConsecutiveNoRecordDateEnd: string | null;
  maxConsecutiveNoRecordDays: number;

  // Metadata
  lastUpdated: Date;
}

// API request/response types
export interface FetchDataRequest {
  idserial: string;
  starttime: string;
  endtime: string;
  pageNumber: number;
  pageSize: number;
  tradetype: string;
}

export interface ApiResponse {
  data: string; // Encrypted data: key(16 chars) + base64(encrypted)
}

export interface DecryptedResponse {
  resultData: {
    rows: RawTransaction[];
    total: number;
  };
}

// Message types for extension communication
export interface FetchDataMessage {
  type: "FETCH_DATA";
  payload: {
    userId: string;
    startDate: string;
    endDate: string;
  };
}

export interface FetchDataResponse {
  type: "FETCH_DATA_RESPONSE";
  success: boolean;
  data?: ReportData;
  error?: string;
}

export type ExtensionMessage = FetchDataMessage | FetchDataResponse;
