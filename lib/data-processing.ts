/**
 * Data processing and analysis for transaction data
 * Core logic migrated from thu-food-report
 */

import type {
  RawTransaction,
  Transaction,
  Meal,
  ReportData,
  MonthlySpending,
  AchievementBadge,
  PriceRange,
  WeekdayWeekendStats,
  SeasonalPattern,
  CafeteriaLoyalty,
  WaterUtilitiesStats,
  BalanceManagementStats,
  BeyondDiningStats,
  CampusTimelineStats,
} from "./types";

/**
 * Convert raw transactions to processed format
 */
function createTransactions(rows: RawTransaction[]): Transaction[] {
  console.log("[DATA] Converting raw transactions:", rows.length);
  return rows.map((row) => ({
    date: new Date(row.txdate + "+08:00"),
    cafeteria: row.meraddr,
    stall: row.mername,
    amount: row.txamt,
    balance: row.balance,
    code: row.txcode,
  }));
}

/**
 * Filter out non-meal transactions
 */
function cleanTransactions(transactions: Transaction[]): Transaction[] {
  const excludePatterns = /饮水|淋浴|天猫|学生卡|打印|游泳|图书馆/;

  const cleaned = transactions.filter(
    (t) =>
      !excludePatterns.test(t.stall) && !excludePatterns.test(t.cafeteria) && t.code === "1210",
  );

  console.log("[DATA] Cleaned transactions:", cleaned.length, "/", transactions.length);
  return cleaned;
}

/**
 * Group transactions into meals
 * Criteria: same cafeteria, within 60 minutes
 */
function constructMeals(transactions: Transaction[]): Meal[] {
  console.log("[DATA] Constructing meals from transactions...");
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  const meals: Meal[] = [];

  let currentMeal: { date: Date; cafeteria: string; amount: number; stalls: Set<string> } | null =
    null;
  let lastTransaction: Transaction | null = null;

  for (const transaction of sorted) {
    if (currentMeal === null) {
      currentMeal = {
        date: transaction.date,
        cafeteria: transaction.cafeteria,
        amount: transaction.amount,
        stalls: new Set([transaction.stall]),
      };
      lastTransaction = transaction;
      continue;
    }

    const timeDiff = transaction.date.getTime() - lastTransaction!.date.getTime();
    const sameCafeteria = transaction.cafeteria === lastTransaction!.cafeteria;
    const within60Minutes = timeDiff < 60 * 60 * 1000;

    if (sameCafeteria && within60Minutes) {
      currentMeal.amount += transaction.amount;
      currentMeal.stalls.add(transaction.stall);
      lastTransaction = transaction;
    } else {
      meals.push({
        date: currentMeal.date,
        cafeteria: currentMeal.cafeteria,
        amount: currentMeal.amount,
        numStalls: currentMeal.stalls.size,
      });

      currentMeal = {
        date: transaction.date,
        cafeteria: transaction.cafeteria,
        amount: transaction.amount,
        stalls: new Set([transaction.stall]),
      };
      lastTransaction = transaction;
    }
  }

  // Push last meal
  if (currentMeal !== null) {
    meals.push({
      date: currentMeal.date,
      cafeteria: currentMeal.cafeteria,
      amount: currentMeal.amount,
      numStalls: currentMeal.stalls.size,
    });
  }

  console.log("[DATA] Constructed meals:", meals.length);
  return meals;
}

/**
 * Calculate basic statistics
 */
function basicStats(transactions: Transaction[], meals: Meal[]) {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalMeals = meals.length;
  const uniqueCafeterias = new Set(transactions.map((t) => t.cafeteria)).size;
  const uniqueStalls = new Set(transactions.map((t) => t.stall)).size;

  console.log("[STATS] Basic:", { totalAmount, totalMeals, uniqueCafeterias, uniqueStalls });

  return {
    totalAmount,
    totalMeals,
    numUniqueCafeterias: uniqueCafeterias,
    numUniqueStalls: uniqueStalls,
  };
}

/**
 * Find favorite places
 */
function favorite(transactions: Transaction[], meals: Meal[]) {
  // Most visited cafeteria
  const cafeteriaVisits = new Map<string, number>();
  meals.forEach((meal) => {
    cafeteriaVisits.set(meal.cafeteria, (cafeteriaVisits.get(meal.cafeteria) || 0) + 1);
  });

  const [mostVisitedCafeteria, mostVisitedCafeteriaCount] = Array.from(
    cafeteriaVisits.entries(),
  ).reduce((max, entry) => (entry[1] > max[1] ? entry : max), ["", 0]);

  // Most spent cafeteria
  const cafeteriaSpent = new Map<string, number>();
  transactions.forEach((t) => {
    cafeteriaSpent.set(t.cafeteria, (cafeteriaSpent.get(t.cafeteria) || 0) + t.amount);
  });

  const cafeteriasSpentArray = Array.from(cafeteriaSpent.entries())
    .map(([cafeteria, amount]) => ({ cafeteria, amount }))
    .sort((a, b) => b.amount - a.amount);

  const mostSpentCafeteria = cafeteriasSpentArray[0]?.cafeteria || "";
  const mostSpentCafeteriaAmount = cafeteriasSpentArray[0]?.amount || 0;

  // Most spent stall
  const stallSpent = new Map<string, number>();
  transactions.forEach((t) => {
    stallSpent.set(t.stall, (stallSpent.get(t.stall) || 0) + t.amount);
  });

  const [mostSpentStall, mostSpentStallAmount] = Array.from(stallSpent.entries()).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["", 0],
  );

  console.log("[STATS] Favorite:", { mostVisitedCafeteria, mostSpentCafeteria, mostSpentStall });

  return {
    mostVisitedCafeteria,
    mostVisitedCafeteriaCount,
    mostSpentCafeteria,
    mostSpentCafeteriaAmount,
    mostSpentStall,
    mostSpentStallAmount,
    cafeteriasSpent: cafeteriasSpentArray,
  };
}

/**
 * Analyze cost patterns
 */
function cost(meals: Meal[]) {
  const cafeteriaAvgCost = new Map<string, { total: number; count: number }>();

  meals.forEach((meal) => {
    const current = cafeteriaAvgCost.get(meal.cafeteria) || { total: 0, count: 0 };
    cafeteriaAvgCost.set(meal.cafeteria, {
      total: current.total + meal.amount,
      count: current.count + 1,
    });
  });

  const avgCosts = Array.from(cafeteriaAvgCost.entries()).map(([cafeteria, { total, count }]) => ({
    cafeteria,
    avgCost: total / count,
  }));

  avgCosts.sort((a, b) => b.avgCost - a.avgCost);

  return {
    mostCostlyCafeteria: avgCosts[0]?.cafeteria || "",
    mostCostlyCafeteriaCost: avgCosts[0]?.avgCost || 0,
    mostCheapCafeteria: avgCosts[avgCosts.length - 1]?.cafeteria || "",
    mostCheapCafeteriaCost: avgCosts[avgCosts.length - 1]?.avgCost || 0,
  };
}

/**
 * Analyze time patterns
 */
function time(meals: Meal[]) {
  const timeSlots = {
    breakfast: new Map<string, number>(),
    lunch: new Map<string, number>(),
    dinner: new Map<string, number>(),
  };

  let earliest = meals[0]?.date || new Date();
  let latest = meals[0]?.date || new Date();

  meals.forEach((meal) => {
    const hour = meal.date.getHours();
    const minute = meal.date.getMinutes();
    const timeKey = `${hour}:${minute}`;

    if (hour >= 0 && hour < 10) {
      timeSlots.breakfast.set(timeKey, (timeSlots.breakfast.get(timeKey) || 0) + 1);
    } else if (hour >= 10 && hour < 15) {
      timeSlots.lunch.set(timeKey, (timeSlots.lunch.get(timeKey) || 0) + 1);
    } else if (hour >= 15 && hour < 24) {
      timeSlots.dinner.set(timeKey, (timeSlots.dinner.get(timeKey) || 0) + 1);
    }

    // Compare by time of day (hours * 60 + minutes), not by full date
    const mealTime = meal.date.getHours() * 60 + meal.date.getMinutes();
    const earliestTime = earliest.getHours() * 60 + earliest.getMinutes();
    const latestTime = latest.getHours() * 60 + latest.getMinutes();

    if (mealTime < earliestTime) earliest = meal.date;
    if (mealTime > latestTime) latest = meal.date;
  });

  const getMostFrequent = (map: Map<string, number>) => {
    const [timeStr, count] = Array.from(map.entries()).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["0:0", 0],
    );
    const [hour, minute] = timeStr.split(":").map(Number);
    return { hour, minute, count };
  };

  return {
    breakfastMostFrequent: getMostFrequent(timeSlots.breakfast),
    lunchMostFrequent: getMostFrequent(timeSlots.lunch),
    dinnerMostFrequent: getMostFrequent(timeSlots.dinner),
    earliest,
    latest,
  };
}

/**
 * Find first meal after Spring Festival 2025 (January 29, 2025)
 */
function newYearFirstMeal(meals: Meal[]) {
  const springFestival = new Date("2025-01-29T00:00:00+08:00");
  const firstMealAfter = meals.find((meal) => meal.date > springFestival);

  return {
    newYearFirstMeal: {
      date: firstMealAfter?.date || new Date(),
      cafeteria: firstMealAfter?.cafeteria || "",
    },
  };
}

/**
 * Find most expensive meal
 */
function mostExpensiveMeal(meals: Meal[]) {
  const expensiveMeal = meals.reduce(
    (max, meal) => (meal.amount > max.amount ? meal : max),
    meals[0] || { date: new Date(), amount: 0, cafeteria: "" },
  );

  return {
    mostExpensiveMealDate: expensiveMeal.date,
    mostExpensiveMealAmount: expensiveMeal.amount,
    mostExpensiveMealCafeteria: expensiveMeal.cafeteria,
  };
}

/**
 * Find meal with most stalls
 */
function mostNumStallsMeal(meals: Meal[]) {
  const varietyMeal = meals.reduce(
    (max, meal) => (meal.numStalls > max.numStalls ? meal : max),
    meals[0] || { date: new Date(), numStalls: 0, cafeteria: "" },
  );

  return {
    mostNumStallsMealDate: varietyMeal.date,
    mostNumStallsMealStalls: varietyMeal.numStalls,
    mostNumStallsCafeteria: varietyMeal.cafeteria,
  };
}

/**
 * Calculate visit patterns
 */
function maxConsecutiveNoRecordDates(transactions: Transaction[]) {
  const uniqueDates = new Set(
    transactions.map((t) => {
      const d = new Date(t.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
    }),
  );

  return {
    numVisitedDates: uniqueDates.size,
    maxConsecutiveNoRecordDateBegin: null,
    maxConsecutiveNoRecordDateEnd: null,
    maxConsecutiveNoRecordDays: 0,
  };
}

/**
 * Calculate monthly spending trends
 */
function monthlyTrends(meals: Meal[]): {
  monthlySpending: MonthlySpending[];
  peakMonth: { month: number; amount: number };
  lowMonth: { month: number; amount: number };
  monthlyAverage: number;
} {
  const monthlyData = new Map<number, { amount: number; count: number }>();

  meals.forEach((meal) => {
    const month = meal.date.getMonth() + 1;
    const current = monthlyData.get(month) || { amount: 0, count: 0 };
    monthlyData.set(month, {
      amount: current.amount + meal.amount,
      count: current.count + 1,
    });
  });

  const monthlySpending: MonthlySpending[] = [];
  for (let m = 1; m <= 12; m++) {
    const data = monthlyData.get(m) || { amount: 0, count: 0 };
    monthlySpending.push({ month: m, amount: data.amount, mealCount: data.count });
  }

  const nonZeroMonths = monthlySpending.filter((m) => m.amount > 0);
  const peakMonth = nonZeroMonths.reduce(
    (max, m) => (m.amount > max.amount ? { month: m.month, amount: m.amount } : max),
    { month: 1, amount: 0 },
  );
  const lowMonth = nonZeroMonths.reduce(
    (min, m) => (m.amount < min.amount ? { month: m.month, amount: m.amount } : min),
    { month: 1, amount: Infinity },
  );

  const totalAmount = monthlySpending.reduce((sum, m) => sum + m.amount, 0);
  const monthlyAverage = nonZeroMonths.length > 0 ? totalAmount / nonZeroMonths.length : 0;

  return {
    monthlySpending,
    peakMonth,
    lowMonth: lowMonth.amount === Infinity ? { month: 1, amount: 0 } : lowMonth,
    monthlyAverage,
  };
}

/**
 * Calculate price distribution
 */
function priceDistributionStats(meals: Meal[]): {
  priceDistribution: PriceRange[];
  dominantPriceType: string;
} {
  const ranges: PriceRange[] = [
    { range: "<10元", min: 0, max: 1000, count: 0, percentage: 0 },
    { range: "10-20元", min: 1000, max: 2000, count: 0, percentage: 0 },
    { range: "20-30元", min: 2000, max: 3000, count: 0, percentage: 0 },
    { range: ">30元", min: 3000, max: Infinity, count: 0, percentage: 0 },
  ];

  const typeNames = ["勤俭节约型", "经济实惠型", "品质生活型", "豪华享受型"];

  meals.forEach((meal) => {
    for (const range of ranges) {
      if (meal.amount >= range.min && meal.amount < range.max) {
        range.count++;
        break;
      }
    }
  });

  const total = meals.length;
  ranges.forEach((range) => {
    range.percentage = total > 0 ? (range.count / total) * 100 : 0;
  });

  const maxIdx = ranges.reduce((maxI, r, i, arr) => (r.count > arr[maxI].count ? i : maxI), 0);

  return {
    priceDistribution: ranges,
    dominantPriceType: typeNames[maxIdx],
  };
}

/**
 * Calculate weekday vs weekend stats
 */
function weekdayWeekendAnalysis(meals: Meal[]): { weekdayWeekendStats: WeekdayWeekendStats } {
  const weekdayMeals: Meal[] = [];
  const weekendMeals: Meal[] = [];

  meals.forEach((meal) => {
    const day = meal.date.getDay();
    if (day === 0 || day === 6) {
      weekendMeals.push(meal);
    } else {
      weekdayMeals.push(meal);
    }
  });

  const getTopCafeteria = (mealList: Meal[]) => {
    const counts = new Map<string, number>();
    mealList.forEach((m) => counts.set(m.cafeteria, (counts.get(m.cafeteria) || 0) + 1));
    return (
      Array.from(counts.entries()).reduce((max, e) => (e[1] > max[1] ? e : max), ["", 0])[0] || ""
    );
  };

  const weekdayTotal = weekdayMeals.reduce((sum, m) => sum + m.amount, 0);
  const weekendTotal = weekendMeals.reduce((sum, m) => sum + m.amount, 0);
  const weekdayAvg = weekdayMeals.length > 0 ? weekdayTotal / weekdayMeals.length : 0;
  const weekendAvg = weekendMeals.length > 0 ? weekendTotal / weekendMeals.length : 0;

  let comparison: string;
  if (weekendAvg > weekdayAvg * 1.1) {
    comparison = "周末更舍得犒劳自己呢";
  } else if (weekdayAvg > weekendAvg * 1.1) {
    comparison = "工作日吃得更好哦";
  } else {
    comparison = "相当均衡的生活！";
  }

  return {
    weekdayWeekendStats: {
      weekday: {
        avgCost: weekdayAvg,
        mealCount: weekdayMeals.length,
        topCafeteria: getTopCafeteria(weekdayMeals),
      },
      weekend: {
        avgCost: weekendAvg,
        mealCount: weekendMeals.length,
        topCafeteria: getTopCafeteria(weekendMeals),
      },
      comparison,
    },
  };
}

/**
 * Calculate seasonal patterns
 */
function seasonalAnalysis(meals: Meal[]): {
  seasonalPatterns: SeasonalPattern[];
  bestSeason: string;
} {
  const seasons: { [key: string]: { season: SeasonalPattern["season"]; months: number[] } } = {
    spring: { season: "spring", months: [3, 4, 5] },
    summer: { season: "summer", months: [6, 7, 8] },
    fall: { season: "fall", months: [9, 10, 11] },
    winter: { season: "winter", months: [12, 1, 2] },
  };

  const seasonNames = { spring: "春季", summer: "夏季", fall: "秋季", winter: "冬季" };

  const seasonalPatterns: SeasonalPattern[] = [];

  for (const [, { season, months }] of Object.entries(seasons)) {
    const seasonMeals = meals.filter((m) => months.includes(m.date.getMonth() + 1));
    const total = seasonMeals.reduce((sum, m) => sum + m.amount, 0);
    const avgCost = seasonMeals.length > 0 ? total / seasonMeals.length : 0;

    const cafeteriaCounts = new Map<string, number>();
    seasonMeals.forEach((m) =>
      cafeteriaCounts.set(m.cafeteria, (cafeteriaCounts.get(m.cafeteria) || 0) + 1),
    );
    const topCafeteria =
      Array.from(cafeteriaCounts.entries()).reduce((max, e) => (e[1] > max[1] ? e : max), [
        "",
        0,
      ])[0] || "";

    seasonalPatterns.push({
      season,
      avgCost,
      mealCount: seasonMeals.length,
      topCafeteria,
    });
  }

  const bestSeasonData = seasonalPatterns.reduce((max, s) =>
    s.avgCost > max.avgCost ? s : max,
  );

  return {
    seasonalPatterns,
    bestSeason: seasonNames[bestSeasonData.season],
  };
}

/**
 * Calculate cafeteria loyalty stats
 */
function cafeteriaLoyaltyStats(meals: Meal[]): {
  mostFrequentCafeteria: CafeteriaLoyalty;
  cafeteriaLoyaltyRanking: CafeteriaLoyalty[];
} {
  const cafeteriaData = new Map<string, { days: Set<string>; dates: Date[] }>();

  meals.forEach((meal) => {
    const dateStr = meal.date.toISOString().split("T")[0];
    const current = cafeteriaData.get(meal.cafeteria) || { days: new Set(), dates: [] };
    current.days.add(dateStr);
    current.dates.push(meal.date);
    cafeteriaData.set(meal.cafeteria, current);
  });

  const calculateStreak = (dates: Date[]): number => {
    if (dates.length === 0) return 0;
    const sortedDates = [...new Set(dates.map((d) => d.toISOString().split("T")[0]))].sort();
    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    return maxStreak;
  };

  const loyaltyData: CafeteriaLoyalty[] = Array.from(cafeteriaData.entries()).map(
    ([cafeteria, { days, dates }]) => ({
      cafeteria,
      totalDays: days.size,
      avgMonthly: days.size / 12,
      maxStreak: calculateStreak(dates),
    }),
  );

  loyaltyData.sort((a, b) => b.totalDays - a.totalDays);

  return {
    mostFrequentCafeteria: loyaltyData[0] || {
      cafeteria: "",
      totalDays: 0,
      avgMonthly: 0,
      maxStreak: 0,
    },
    cafeteriaLoyaltyRanking: loyaltyData.slice(0, 5),
  };
}

/**
 * Calculate late night and breakfast stats
 */
function mealTimeStats(meals: Meal[]): {
  lateNightMealsCount: number;
  breakfastDaysCount: number;
} {
  const lateNightMeals = meals.filter((m) => m.date.getHours() >= 20);
  const breakfastDays = new Set(
    meals
      .filter((m) => m.date.getHours() >= 6 && m.date.getHours() < 10)
      .map((m) => m.date.toISOString().split("T")[0]),
  );

  return {
    lateNightMealsCount: lateNightMeals.length,
    breakfastDaysCount: breakfastDays.size,
  };
}

/**
 * Generate achievement badges
 */
function generateAchievements(
  meals: Meal[],
  stats: {
    numUniqueCafeterias: number;
    totalAmount: number;
    lateNightMealsCount: number;
    breakfastDaysCount: number;
  },
): { achievementBadges: AchievementBadge[] } {
  const badges: AchievementBadge[] = [
    {
      id: "explorer",
      name: "食堂探险家",
      emoji: "🏆",
      description: `打卡${stats.numUniqueCafeterias}个不同食堂，探索精神满分！`,
      earned: stats.numUniqueCafeterias >= 3,
      value: stats.numUniqueCafeterias,
    },
    {
      id: "night-owl",
      name: "深夜干饭人",
      emoji: "🌙",
      description: `${stats.lateNightMealsCount}次20:00后用餐，真·时间管理大师`,
      earned: stats.lateNightMealsCount >= 5,
      value: stats.lateNightMealsCount,
    },
    {
      id: "breakfast-hero",
      name: "早餐铁人",
      emoji: "☀️",
      description: `${stats.breakfastDaysCount}天吃了早餐，健康生活典范`,
      earned: stats.breakfastDaysCount >= 30,
      value: stats.breakfastDaysCount,
    },
    {
      id: "vip",
      name: "食堂VIP",
      emoji: "💰",
      description: `年度消费${(stats.totalAmount / 100).toFixed(0)}元，食堂该给你分红！`,
      earned: stats.totalAmount >= 500000,
      value: stats.totalAmount,
    },
    {
      id: "regular",
      name: "常客认证",
      emoji: "🍜",
      description: `${meals.length}顿饭的坚持，食堂阿姨都认识你了`,
      earned: meals.length >= 100,
      value: meals.length,
    },
  ];

  return { achievementBadges: badges };
}

/**
 * Analyze water and utilities usage
 */
function analyzeWaterUtilities(rawData: RawTransaction[]): { waterUtilitiesStats: WaterUtilitiesStats } {
  const waterTransactions = rawData.filter(
    (tx) =>
      tx.summary === "水控POS消费流水" || tx.meraddr?.includes("淋浴") || tx.mername?.includes("淋浴"),
  );

  if (waterTransactions.length === 0) {
    return {
      waterUtilitiesStats: {
        totalTransactions: 0,
        totalAmount: 0,
        avgCost: 0,
        totalDays: 0,
        mostFrequentHour: 0,
      },
    };
  }

  const totalAmount = waterTransactions.reduce((sum, tx) => sum + tx.txamt, 0);
  const avgCost = totalAmount / waterTransactions.length;

  // Count unique days
  const uniqueDays = new Set(
    waterTransactions.map((tx) => new Date(tx.txdate).toISOString().split("T")[0]),
  );

  // Find most frequent hour
  const hourCounts = new Map<number, number>();
  waterTransactions.forEach((tx) => {
    const hour = new Date(tx.txdate).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });

  const mostFrequentHour =
    Array.from(hourCounts.entries()).reduce((max, [hour, count]) =>
      count > max[1] ? [hour, count] : max,
    )[0] || 0;

  return {
    waterUtilitiesStats: {
      totalTransactions: waterTransactions.length,
      totalAmount,
      avgCost,
      totalDays: uniqueDays.size,
      mostFrequentHour,
    },
  };
}

/**
 * Analyze balance management patterns
 */
function analyzeBalanceManagement(rawData: RawTransaction[]): { balanceManagementStats: BalanceManagementStats } {
  const topUpTransactions = rawData.filter((tx) => tx.summary === "中行圈存" || tx.txname === "中行圈存");

  const topUpCount = topUpTransactions.length;
  const totalTopUpAmount = topUpTransactions.reduce((sum, tx) => sum + tx.txamt, 0);

  // Find starting and ending balance
  const sortedByDate = [...rawData].sort(
    (a, b) => new Date(a.txdate).getTime() - new Date(b.txdate).getTime(),
  );
  const startingBalance = sortedByDate[0]?.balance || 0;
  const endingBalance = sortedByDate[sortedByDate.length - 1]?.balance || 0;

  // Find lowest balance
  const lowestBalance = Math.min(...rawData.map((tx) => tx.balance));

  // Determine management type based on top-up patterns
  let managementType = "佛系管理型";
  if (topUpCount === 0) {
    managementType = "一卡通富豪";
  } else if (topUpCount >= 10) {
    managementType = "临时抱佛脚型";
  } else if (lowestBalance > 5000) {
    managementType = "未雨绸缪型";
  }

  return {
    balanceManagementStats: {
      topUpCount,
      totalTopUpAmount,
      startingBalance,
      endingBalance,
      lowestBalance,
      managementType,
    },
  };
}

/**
 * Analyze beyond dining transactions
 */
function analyzeBeyondDining(rawData: RawTransaction[]): { beyondDiningStats: BeyondDiningStats } {
  // Define meal-related patterns
  const mealPatterns = [
    "大伙",
    "主食",
    "烤肉",
    "风味",
    "点菜",
    "拌饭",
    "面食",
    "川渝",
    "湘菜",
    "粤",
    "河南",
    "朝鲜",
    "日式",
    "韩式",
    "套餐",
    "自选",
  ];

  const nonMealTransactions = rawData.filter((tx) => {
    // Skip top-ups and water
    if (tx.summary === "中行圈存" || tx.summary === "水控POS消费流水") return false;

    const mername = tx.mername || "";

    // Check if it's likely a non-meal transaction
    return (
      mername.includes("冷饮") ||
      mername.includes("水吧") ||
      mername.includes("冷荤") ||
      mername.includes("糕点") ||
      mername.includes("西饼") ||
      mername.includes("游泳") ||
      (!mealPatterns.some((pattern) => mername.includes(pattern)) && tx.meraddr !== "在线充值")
    );
  });

  const nonMealAmount = nonMealTransactions.reduce((sum, tx) => sum + tx.txamt, 0);

  // Categorize non-meal transactions
  const categories = new Map<string, { count: number; amount: number }>();

  nonMealTransactions.forEach((tx) => {
    const mername = tx.mername || "";
    let category = "其他";

    if (mername.includes("冷饮") || mername.includes("水吧")) category = "冷饮饮品";
    else if (mername.includes("糕点") || mername.includes("西饼")) category = "糕点甜品";
    else if (mername.includes("冷荤")) category = "冷荤熟食";
    else if (mername.includes("游泳")) category = "体育健身";

    const current = categories.get(category) || { count: 0, amount: 0 };
    categories.set(category, {
      count: current.count + 1,
      amount: current.amount + tx.txamt,
    });
  });

  const categoriesArray = Array.from(categories.entries()).map(([category, data]) => ({
    category,
    ...data,
  }));

  // Find most unique place
  const placeCounts = new Map<string, number>();
  nonMealTransactions.forEach((tx) => {
    placeCounts.set(tx.meraddr, (placeCounts.get(tx.meraddr) || 0) + 1);
  });

  const mostUniquePlace =
    Array.from(placeCounts.entries()).reduce((max, [place, count]) =>
      count > max[1] ? [place, count] : max,
    )[0] || "";

  return {
    beyondDiningStats: {
      nonMealTransactions: nonMealTransactions.length,
      nonMealAmount,
      categories: categoriesArray,
      mostUniquePlace,
    },
  };
}

/**
 * Analyze campus life timeline
 */
function analyzeCampusTimeline(rawData: RawTransaction[]): { campusTimelineStats: CampusTimelineStats } {
  const sortedByDate = [...rawData].sort(
    (a, b) => new Date(a.txdate).getTime() - new Date(b.txdate).getTime(),
  );

  const first = sortedByDate[0];
  const last = sortedByDate[sortedByDate.length - 1];

  // Calculate longest streak
  const dates = sortedByDate.map((tx) => new Date(tx.txdate).toISOString().split("T")[0]);
  const uniqueDates = [...new Set(dates)].sort();

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Find most active month
  const monthCounts = new Map<number, number>();
  rawData.forEach((tx) => {
    const month = new Date(tx.txdate).getMonth() + 1;
    monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
  });

  const mostActiveMonth =
    Array.from(monthCounts.entries()).reduce((max, [month, count]) =>
      count > max[1] ? [month, count] : max,
    )[0] || 1;

  return {
    campusTimelineStats: {
      firstTransaction: {
        date: new Date(first.txdate),
        location: first.meraddr,
        type: first.summary || first.txname || "消费",
      },
      lastTransaction: {
        date: new Date(last.txdate),
        location: last.meraddr,
        type: last.summary || last.txname || "消费",
      },
      longestStreak,
      mostActiveMonth,
      totalActiveDays: uniqueDates.length,
    },
  };
}

/**
 * Analyze all transaction data and generate report
 */
export async function analyze(rawData: RawTransaction[]): Promise<ReportData> {
  console.log("[ANALYZE] Starting analysis with", rawData.length, "raw records");

  const transactions = createTransactions(rawData);
  const cleanedTransactions = cleanTransactions(transactions);
  const meals = constructMeals(cleanedTransactions);

  // Basic stats
  const basicStatsData = basicStats(cleanedTransactions, meals);

  // Meal time stats for achievements
  const mealTimeData = mealTimeStats(meals);

  // Achievements need some pre-computed stats
  const achievementsData = generateAchievements(meals, {
    numUniqueCafeterias: basicStatsData.numUniqueCafeterias,
    totalAmount: basicStatsData.totalAmount,
    lateNightMealsCount: mealTimeData.lateNightMealsCount,
    breakfastDaysCount: mealTimeData.breakfastDaysCount,
  });

  const result: ReportData = {
    ...basicStatsData,
    ...favorite(cleanedTransactions, meals),
    ...cost(meals),
    ...time(meals),
    ...newYearFirstMeal(meals),
    ...mostExpensiveMeal(meals),
    ...mostNumStallsMeal(meals),
    ...maxConsecutiveNoRecordDates(cleanedTransactions),
    ...monthlyTrends(meals),
    ...priceDistributionStats(meals),
    ...weekdayWeekendAnalysis(meals),
    ...seasonalAnalysis(meals),
    ...cafeteriaLoyaltyStats(meals),
    ...mealTimeData,
    ...achievementsData,
    ...analyzeWaterUtilities(rawData),
    ...analyzeBalanceManagement(rawData),
    ...analyzeBeyondDining(rawData),
    ...analyzeCampusTimeline(rawData),
    lastUpdated: new Date(),
    rawTransactions: rawData, // Include raw data for export
  };

  console.log("[ANALYZE] Complete! Total amount:", result.totalAmount / 100, "yuan");

  return result;
}
