/**
 * Report poster components
 * Migrated from thu-food-report with Ant Design styling
 */

import { Cell, Pie, PieChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { ReportData } from "@/lib/types";

const PosterCard = ({
  children,
  color,
  fontFamily,
}: {
  children: React.ReactNode;
  color: string;
  fontFamily?: string;
}) => (
  <div
    style={{
      width: "300px",
      height: "300px",
      background: color,
      borderRadius: "16px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#333",
      fontFamily: fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}
  >
    {children}
  </div>
);

const NumberHighlight = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      fontSize: "30px",
      fontWeight: "bold",
      color: "#623CEA",
      margin: "0 2px",
    }}
  >
    {children}
  </span>
);

const LocationHighlight = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      fontSize: "20px",
      fontWeight: "bold",
      color: "#623CEA",
      margin: "0 2px",
    }}
  >
    {children}
  </span>
);

export function PosterBasicStats({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { totalAmount, totalMeals, numUniqueCafeterias, numUniqueStalls } = data;

  return (
    <PosterCard color="#E7DFC6" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <div>
            <NumberHighlight>2025</NumberHighlight>
            年是个值得回味的年份
          </div>
          <div style={{ marginTop: "10px", fontSize: "12px" }}>在这一年里:</div>
          <div>
            你一共花了
            <NumberHighlight>{(totalAmount / 100).toFixed(2)}</NumberHighlight>元
          </div>
          <div>
            细细品味了<NumberHighlight>{totalMeals}</NumberHighlight>
            顿美餐
          </div>
          <div>
            你走进
            <NumberHighlight>{numUniqueCafeterias}</NumberHighlight>
            个食堂
          </div>
          <div>
            探寻过<NumberHighlight>{numUniqueStalls}</NumberHighlight>
            个档口
          </div>
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "#666", textAlign: "center" }}>
        <div>有哪些特别的美食味道</div>
        <div>让你特别认可呢？</div>
      </div>
    </PosterCard>
  );
}

export function PosterFavorite({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { mostSpentCafeteria, mostSpentCafeteriaAmount, mostSpentStall } = data;
  const stall = mostSpentStall.split("_").slice(1).join("/") || mostSpentStall;

  return (
    <PosterCard color="#DAF76F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div>
          <LocationHighlight>{mostSpentCafeteria}</LocationHighlight>
          是你最慷慨投入的地方
        </div>
        <div>
          你在那共花费
          <NumberHighlight>{(mostSpentCafeteriaAmount / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ textAlign: "right", marginTop: "40px" }}>
          <div>其中，让你情有独钟的</div>
          <div style={{ marginTop: "8px" }}>
            <LocationHighlight>{stall}</LocationHighlight>
            档口
          </div>
          <div>是不是你心中的华子最佳</div>
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterMeanCost({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const {
    mostCostlyCafeteria,
    mostCostlyCafeteriaCost,
    mostCheapCafeteria,
    mostCheapCafeteriaCost,
  } = data;

  return (
    <PosterCard color="#F9E98F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div>
          在<LocationHighlight>{mostCostlyCafeteria}</LocationHighlight>
        </div>
        <div>
          你平均每顿花费
          <NumberHighlight>{(mostCostlyCafeteriaCost / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "40px" }}>
          而<LocationHighlight>{mostCheapCafeteria}</LocationHighlight>
        </div>
        <div>
          则以平均每顿
          <NumberHighlight>{(mostCheapCafeteriaCost / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div>成为你的性价比之选</div>
      </div>
    </PosterCard>
  );
}

export function PosterHabit({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { breakfastMostFrequent, lunchMostFrequent, dinnerMostFrequent } = data;

  const formatTime = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;

  return (
    <PosterCard color="#E9F1F7" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>你的用餐习惯</div>
        <div>
          早餐最常在
          <NumberHighlight>
            {formatTime(breakfastMostFrequent.hour, breakfastMostFrequent.minute)}
          </NumberHighlight>
        </div>
        <div>
          午餐通常在
          <NumberHighlight>
            {formatTime(lunchMostFrequent.hour, lunchMostFrequent.minute)}
          </NumberHighlight>
        </div>
        <div>
          晚餐多在
          <NumberHighlight>
            {formatTime(dinnerMostFrequent.hour, dinnerMostFrequent.minute)}
          </NumberHighlight>
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterFirstMeal({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { newYearFirstMeal } = data;
  const date = new Date(newYearFirstMeal.date);

  return (
    <PosterCard color="#FDCBD3" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>春节后的第一顿</div>
        <div>
          {date.getMonth() + 1}月{date.getDate()}日
        </div>
        <div>
          你在
          <LocationHighlight>{newYearFirstMeal.cafeteria}</LocationHighlight>
        </div>
        <div>开启了新学期的美食之旅</div>
      </div>
    </PosterCard>
  );
}

export function PosterEarliestLatest({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { earliest, latest } = data;
  const formatTime = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;

  return (
    <PosterCard color="#E7DFC6" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div>
          最早的一顿在
          <NumberHighlight>{formatTime(new Date(earliest))}</NumberHighlight>
        </div>
        <div>
          最晚的一顿在
          <NumberHighlight>{formatTime(new Date(latest))}</NumberHighlight>
        </div>
        <div style={{ marginTop: "40px", fontSize: "10px", color: "#666" }}>
          无论多早多晚，食堂永远为你亮着灯
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterMostExpensive({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { mostExpensiveMealDate, mostExpensiveMealAmount, mostExpensiveMealCafeteria } = data;
  const date = new Date(mostExpensiveMealDate);

  return (
    <PosterCard color="#DAF76F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>最贵的一顿</div>
        <div>
          {date.getMonth() + 1}月{date.getDate()}日
        </div>
        <div>
          你在
          <LocationHighlight>{mostExpensiveMealCafeteria}</LocationHighlight>
        </div>
        <div>
          花费了
          <NumberHighlight>{(mostExpensiveMealAmount / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}>
          那一定是值得纪念的美味
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterMostStalls({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { mostNumStallsMealDate, mostNumStallsMealStalls, mostNumStallsCafeteria } = data;
  const date = new Date(mostNumStallsMealDate);

  return (
    <PosterCard color="#F9E98F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>最丰富的一顿</div>
        <div>
          {date.getMonth() + 1}月{date.getDate()}日
        </div>
        <div>
          你在<LocationHighlight>{mostNumStallsCafeteria}</LocationHighlight>
        </div>
        <div>
          品尝了<NumberHighlight>{mostNumStallsMealStalls}</NumberHighlight>
          个档口
        </div>
        <div style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}>尝遍百味，不负时光</div>
      </div>
    </PosterCard>
  );
}

export function PosterVisitedDays({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { numVisitedDates } = data;

  return (
    <PosterCard color="#E9F1F7" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div>
          2025年，你有
          <NumberHighlight>{numVisitedDates}</NumberHighlight>天
        </div>
        <div>在食堂留下了足迹</div>
        <div style={{ marginTop: "40px", fontSize: "10px", color: "#666" }}>
          每一天都是与美食相伴的日子
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterScore({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { totalAmount, totalMeals, numUniqueCafeterias, cafeteriasSpent } = data;

  // Calculate score using original formula
  const score = totalAmount * 0.00003 + totalMeals * 0.01 + numUniqueCafeterias * 6;

  // Determine rank based on score
  const getRank = (score: number) => {
    if (score >= 100) return "A+";
    if (score >= 95) return "A";
    if (score >= 90) return "A-";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 77) return "B-";
    if (score >= 73) return "C+";
    if (score >= 70) return "C";
    if (score >= 67) return "C-";
    if (score >= 63) return "D+";
    if (score >= 60) return "D";
    return "?";
  };

  const rank = getRank(score);

  // Custom label render function matching original implementation
  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }: any) => {
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return percent > 0.1 ? (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "10px" }}
      >
        {cafeteriasSpent[index].cafeteria}
      </text>
    ) : null;
  };

  return (
    <PosterCard color="#FDCBD3" fontFamily={fontFamily}>
      <div style={{ width: "100%" }}>
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          我的 2025 《日肥学导论》成绩单
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        >
          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "160px",
              fontSize: "14px",
            }}
          >
            <div>总消费金额: {(totalAmount / 100).toFixed(2)}</div>
            <div>吃食堂顿数: {totalMeals}</div>
            <div>打卡食堂数: {numUniqueCafeterias}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <NumberHighlight>{score > 100 ? 100 : score.toFixed(1)}</NumberHighlight>
            <div style={{ fontSize: "14px", marginTop: "8px" }}>
              评级:<NumberHighlight>{rank}</NumberHighlight>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <PieChart width={200} height={120}>
            <Pie
              data={cafeteriasSpent.map((item) => ({
                cafeteria: item.cafeteria,
                amount: item.amount / totalAmount,
              }))}
              dataKey="amount"
              nameKey="cafeteria"
              cx="50%"
              cy="50%"
              outerRadius={50}
              label={renderLabel}
              labelLine={false}
              isAnimationActive={false}
            >
              {cafeteriasSpent.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    [
                      "#fbb4ae",
                      "#b3cde3",
                      "#ccebc5",
                      "#decbe4",
                      "#fed9a6",
                      "#ffffcc",
                      "#e5d8bd",
                      "#fddaec",
                      "#f2f2f2",
                    ][index % 9]
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterMonthlyTrends({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { monthlySpending, peakMonth, lowMonth } = data;

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  return (
    <PosterCard color="#E7DFC6" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>月度消费趋势</div>
        <div>
          <NumberHighlight>{monthNames[peakMonth.month - 1]}</NumberHighlight>
          是你消费最高的月份
        </div>
        <div>
          共花费
          <NumberHighlight>{(peakMonth.amount / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "20px" }}>
          而<NumberHighlight>{monthNames[lowMonth.month - 1]}</NumberHighlight>
          则相对节俭
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
          {monthlySpending.filter((m) => m.amount > 0).length}个月的食堂生活
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterAchievements({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { achievementBadges } = data;
  const earnedBadges = achievementBadges.filter((b) => b.earned);

  return (
    <PosterCard color="#DAF76F" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          年度成就 {earnedBadges.length}/{achievementBadges.length}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {earnedBadges.slice(0, 4).map((badge) => (
            <div key={badge.id} style={{ fontSize: "14px", lineHeight: "1.5" }}>
              <span style={{ fontSize: "20px", marginRight: "8px" }}>{badge.emoji}</span>
              <span style={{ fontWeight: "bold" }}>{badge.name}</span>
              <div style={{ fontSize: "12px", color: "#666", marginLeft: "28px" }}>
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "#666", textAlign: "center" }}>
        你已解锁这些专属成就！
      </div>
    </PosterCard>
  );
}

export function PosterConsistentSpot({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { mostFrequentCafeteria } = data;

  return (
    <PosterCard color="#F9E98F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>固定据点</div>
        <div>
          <LocationHighlight>{mostFrequentCafeteria.cafeteria}</LocationHighlight>
        </div>
        <div>
          是你最常光顾的地方
        </div>
        <div style={{ marginTop: "20px" }}>
          在<NumberHighlight>{mostFrequentCafeteria.totalDays}</NumberHighlight>天里
        </div>
        <div>你都选择了这里</div>
        <div style={{ marginTop: "20px" }}>
          最长连续打卡
          <NumberHighlight>{mostFrequentCafeteria.maxStreak}</NumberHighlight>天
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterPriceDistribution({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { priceDistribution, dominantPriceType } = data;

  const chartData = priceDistribution.map((range) => ({
    name: range.range,
    percentage: Number(range.percentage.toFixed(1)),
  }));

  return (
    <PosterCard color="#E9F1F7" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
          消费分布
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          <BarChart width={250} height={150} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: "12px" }} />
            <Bar dataKey="percentage" fill="#623CEA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </div>
      <div style={{ fontSize: "14px", textAlign: "center" }}>
        你是<span style={{ fontWeight: "bold", color: "#623CEA" }}>{dominantPriceType}</span>
      </div>
    </PosterCard>
  );
}

export function PosterWeekdayWeekend({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { weekdayWeekendStats } = data;

  return (
    <PosterCard color="#FDCBD3" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>工作日 vs 周末</div>
        <div>
          工作日平均每顿
          <NumberHighlight>
            {(weekdayWeekendStats.weekday.avgCost / 100).toFixed(2)}
          </NumberHighlight>
          元
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
          最爱去{weekdayWeekendStats.weekday.topCafeteria}
        </div>
        <div style={{ marginTop: "20px" }}>
          周末平均每顿
          <NumberHighlight>
            {(weekdayWeekendStats.weekend.avgCost / 100).toFixed(2)}
          </NumberHighlight>
          元
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
          最爱去{weekdayWeekendStats.weekend.topCafeteria}
        </div>
      </div>
      <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
        {weekdayWeekendStats.comparison}
      </div>
    </PosterCard>
  );
}

export function PosterSeasonalPatterns({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { seasonalPatterns, bestSeason } = data;

  const seasonNames = {
    spring: "春季",
    summer: "夏季",
    fall: "秋季",
    winter: "冬季",
  };

  const chartData = seasonalPatterns.map((season) => ({
    name: seasonNames[season.season],
    avgCost: Number((season.avgCost / 100).toFixed(2)),
  }));

  return (
    <PosterCard color="#E7DFC6" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
          四季消费
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          <BarChart width={250} height={150} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: "12px" }} />
            <Bar dataKey="avgCost" fill="#623CEA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </div>
      <div style={{ fontSize: "14px", textAlign: "center" }}>
        <NumberHighlight>{bestSeason}</NumberHighlight>吃得最丰盛
      </div>
    </PosterCard>
  );
}

export function PosterLoyalty({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { cafeteriaLoyaltyRanking } = data;

  const chartData = cafeteriaLoyaltyRanking.slice(0, 5).map((item, index) => ({
    name: `${index + 1}. ${item.cafeteria.length > 6 ? item.cafeteria.slice(0, 6) + "..." : item.cafeteria}`,
    days: item.totalDays,
    fullName: item.cafeteria,
  }));

  return (
    <PosterCard color="#DAF76F" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
          忠诚度排行榜
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          <BarChart width={250} height={160} data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} />
            <Tooltip contentStyle={{ fontSize: "12px" }} />
            <Bar dataKey="days" fill="#623CEA" radius={[0, 4, 4, 0]} />
          </BarChart>
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterThankYou({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
  const { totalMeals, numUniqueCafeterias } = data;

  return (
    <PosterCard color="#F9E98F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8", textAlign: "center" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "30px" }}>
          感谢有你
        </div>
        <div style={{ marginBottom: "20px" }}>
          <NumberHighlight>{totalMeals}</NumberHighlight>顿饭
        </div>
        <div style={{ marginBottom: "20px" }}>
          <NumberHighlight>{numUniqueCafeterias}</NumberHighlight>个食堂
        </div>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "30px" }}>
          2025，感谢清华食堂的陪伴
        </div>
        <div style={{ fontSize: "14px", color: "#666" }}>期待2026的美食之旅</div>
      </div>
    </PosterCard>
  );
}

export function PosterWaterUtilities({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { waterUtilitiesStats } = data;

  if (waterUtilitiesStats.totalTransactions === 0) {
    return null; // Don't show if no water transactions
  }

  const formatHour = (hour: number) => {
    if (hour >= 6 && hour < 12) return `早上${hour}点`;
    if (hour >= 12 && hour < 18) return `下午${hour - 12 === 0 ? 12 : hour - 12}点`;
    if (hour >= 18 && hour < 24) return `晚上${hour - 12}点`;
    return `凌晨${hour}点`;
  };

  return (
    <PosterCard color="#B8E6F5" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>💧 水电生活</div>
        <div>
          洗澡<NumberHighlight>{waterUtilitiesStats.totalTransactions}</NumberHighlight>次
        </div>
        <div>
          共花费<NumberHighlight>{(waterUtilitiesStats.totalAmount / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "20px" }}>
          平均每次
          <NumberHighlight>{(waterUtilitiesStats.avgCost / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "20px" }}>
          最常在
          <NumberHighlight>{formatHour(waterUtilitiesStats.mostFrequentHour)}</NumberHighlight>
          洗澡
        </div>
      </div>
      <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
        {waterUtilitiesStats.totalDays}天的清爽时光
      </div>
    </PosterCard>
  );
}

export function PosterBalanceManagement({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { balanceManagementStats } = data;

  return (
    <PosterCard color="#FFE5B4" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>💰 余额管理</div>
        <div>
          充值<NumberHighlight>{balanceManagementStats.topUpCount}</NumberHighlight>次
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
          共{(balanceManagementStats.totalTopUpAmount / 100).toFixed(2)}元
        </div>
        <div style={{ marginTop: "20px" }}>
          最低余额
          <NumberHighlight>{(balanceManagementStats.lowestBalance / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "20px" }}>
          期末余额
          <NumberHighlight>{(balanceManagementStats.endingBalance / 100).toFixed(2)}</NumberHighlight>元
        </div>
      </div>
      <div style={{ fontSize: "14px", textAlign: "center", fontWeight: "bold", color: "#623CEA" }}>
        {balanceManagementStats.managementType}
      </div>
    </PosterCard>
  );
}

export function PosterBeyondDining({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { beyondDiningStats } = data;

  if (beyondDiningStats.nonMealTransactions === 0) {
    return null; // Don't show if no non-meal transactions
  }

  const topCategories = beyondDiningStats.categories.slice(0, 3);

  return (
    <PosterCard color="#E9D5FF" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>
          🎨 丰富生活
        </div>
        <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
          除了吃饭，还有
          <NumberHighlight>{beyondDiningStats.nonMealTransactions}</NumberHighlight>笔
        </div>
        <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
          其他消费，共
          <NumberHighlight>{(beyondDiningStats.nonMealAmount / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
          {topCategories.map((cat) => (
            <div key={cat.category} style={{ marginBottom: "4px" }}>
              {cat.category}: {cat.count}次
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
        多彩的校园生活
      </div>
    </PosterCard>
  );
}

export function PosterCampusTimeline({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { campusTimelineStats } = data;

  const formatDate = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  return (
    <PosterCard color="#D4F1F4" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>📅 时光轨迹</div>
        <div style={{ fontSize: "14px" }}>
          <NumberHighlight>{formatDate(campusTimelineStats.firstTransaction.date)}</NumberHighlight>
          开启2025
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginLeft: "8px", marginTop: "4px" }}>
          首笔：{campusTimelineStats.firstTransaction.location}
        </div>
        <div style={{ fontSize: "14px", marginTop: "20px" }}>
          最长连续使用
          <NumberHighlight>{campusTimelineStats.longestStreak}</NumberHighlight>天
        </div>
        <div style={{ fontSize: "14px", marginTop: "20px" }}>
          <NumberHighlight>{monthNames[campusTimelineStats.mostActiveMonth - 1]}</NumberHighlight>
          最活跃
        </div>
      </div>
      <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
        {campusTimelineStats.totalActiveDays}天的一卡通生活
      </div>
    </PosterCard>
  );
}

