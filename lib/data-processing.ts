/**
 * Data processing and analysis for transaction data
 * Core logic migrated from thu-food-report
 */

import type { RawTransaction, Transaction, Meal, ReportData } from "./types";

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
 * Analyze all transaction data and generate report
 */
export async function analyze(rawData: RawTransaction[]): Promise<ReportData> {
  console.log("[ANALYZE] Starting analysis with", rawData.length, "raw records");

  const transactions = createTransactions(rawData);
  const cleanedTransactions = cleanTransactions(transactions);
  const meals = constructMeals(cleanedTransactions);

  const result: ReportData = {
    ...basicStats(cleanedTransactions, meals),
    ...favorite(cleanedTransactions, meals),
    ...cost(meals),
    ...time(meals),
    ...newYearFirstMeal(meals),
    ...mostExpensiveMeal(meals),
    ...mostNumStallsMeal(meals),
    ...maxConsecutiveNoRecordDates(cleanedTransactions),
    lastUpdated: new Date(),
  };

  console.log("[ANALYZE] Complete! Total amount:", result.totalAmount / 100, "yuan");

  return result;
}
