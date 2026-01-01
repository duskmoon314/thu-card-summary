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
  summary?: string; // Transaction summary (持卡人消费, 水控POS消费流水, etc.)
  txname?: string; // Transaction name
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

// Monthly spending data
export interface MonthlySpending {
  month: number;
  amount: number;
  mealCount: number;
}

// Achievement badge
export interface AchievementBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  value?: number;
}

// Price distribution range
export interface PriceRange {
  range: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

// Weekday/Weekend statistics
export interface WeekdayWeekendStats {
  weekday: {
    avgCost: number;
    mealCount: number;
    topCafeteria: string;
  };
  weekend: {
    avgCost: number;
    mealCount: number;
    topCafeteria: string;
  };
  comparison: string;
}

// Seasonal patterns
export interface SeasonalPattern {
  season: "spring" | "summer" | "fall" | "winter";
  avgCost: number;
  mealCount: number;
  topCafeteria: string;
}

// Cafeteria loyalty data
export interface CafeteriaLoyalty {
  cafeteria: string;
  totalDays: number;
  avgMonthly: number;
  maxStreak: number;
}

// Water/utilities usage stats
export interface WaterUtilitiesStats {
  totalTransactions: number;
  totalAmount: number;
  avgCost: number;
  totalDays: number;
  mostFrequentHour: number;
}

// Balance management stats
export interface BalanceManagementStats {
  topUpCount: number;
  totalTopUpAmount: number;
  startingBalance: number;
  endingBalance: number;
  lowestBalance: number;
  managementType: string; // "未雨绸缪型" | "临时抱佛脚型" | "佛系管理型"
}

// Beyond dining stats
export interface BeyondDiningStats {
  nonMealTransactions: number;
  nonMealAmount: number;
  categories: Array<{ category: string; count: number; amount: number }>;
  mostUniquePlace: string;
}

// Campus life timeline
export interface CampusTimelineStats {
  firstTransaction: { date: Date; location: string; type: string };
  lastTransaction: { date: Date; location: string; type: string };
  longestStreak: number;
  mostActiveMonth: number;
  totalActiveDays: number;
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

  // Extended stats - Monthly trends
  monthlySpending: MonthlySpending[];
  peakMonth: { month: number; amount: number };
  lowMonth: { month: number; amount: number };
  monthlyAverage: number;

  // Extended stats - Achievement badges
  achievementBadges: AchievementBadge[];

  // Extended stats - Most consistent dining spot
  mostFrequentCafeteria: CafeteriaLoyalty;
  cafeteriaLoyaltyRanking: CafeteriaLoyalty[];

  // Extended stats - Price distribution
  priceDistribution: PriceRange[];
  dominantPriceType: string;

  // Extended stats - Weekday vs Weekend
  weekdayWeekendStats: WeekdayWeekendStats;

  // Extended stats - Seasonal patterns
  seasonalPatterns: SeasonalPattern[];
  bestSeason: string;

  // Extended stats - Late night meals count
  lateNightMealsCount: number;

  // Extended stats - Breakfast days count
  breakfastDaysCount: number;

  // Comprehensive card usage stats
  waterUtilitiesStats: WaterUtilitiesStats;
  balanceManagementStats: BalanceManagementStats;
  beyondDiningStats: BeyondDiningStats;
  campusTimelineStats: CampusTimelineStats;

  // Metadata
  lastUpdated: Date;

  // Raw transaction data (for export)
  rawTransactions?: RawTransaction[];
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
