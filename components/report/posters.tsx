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
      justifyContent: "space-around",
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
      fontSize: "24px",
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
            <NumberHighlight>2025</NumberHighlight>年是个值得回味的年份
          </div>
          <div style={{ marginTop: "10px", fontSize: "12px" }}>在这一年里:</div>
          <div>
            你为<NumberHighlight>{(totalAmount / 100).toFixed(2)}</NumberHighlight>元的美好时光买单
          </div>
          <div>
            细细品味了<NumberHighlight>{totalMeals}</NumberHighlight>顿美餐
          </div>
          <div>
            走进<NumberHighlight>{numUniqueCafeterias}</NumberHighlight>个食堂
          </div>
          <div>
            遇见<NumberHighlight>{numUniqueStalls}</NumberHighlight>种不同的惊喜
          </div>
        </div>
      </div>
      <div style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
        <div>哪一口温暖，曾照亮你的一天？</div>
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
          是你最安心的归处
        </div>
        <div>
          在这里，你留下了
          <NumberHighlight>{(mostSpentCafeteriaAmount / 100).toFixed(2)}</NumberHighlight>
          元的时光印记
        </div>
        <div style={{ textAlign: "right", marginTop: "40px" }}>
          <div>而那个让你一次次回头的</div>
          <div style={{ marginTop: "8px" }}>
            <LocationHighlight>{stall}</LocationHighlight>
          </div>
          <div>大概就是华子味道里最治愈的一口</div>
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
          你从不吝啬：
          <NumberHighlight>{(mostCostlyCafeteriaCost / 100).toFixed(2)}</NumberHighlight>元/顿
        </div>
        <div style={{ marginTop: "40px" }}>
          而<LocationHighlight>{mostCheapCafeteria}</LocationHighlight>总用每顿
          <NumberHighlight>{(mostCheapCafeteriaCost / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div>告诉你：简单的幸福，最长久</div>
        <div style={{ marginTop: "40px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          <div>每一元，都是对自己的温柔</div>
        </div>
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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>你的三餐时钟</div>
        <div style={{ textAlign: "left" }}>
          <NumberHighlight>
            {formatTime(breakfastMostFrequent.hour, breakfastMostFrequent.minute)}
          </NumberHighlight>
          的朝阳，陪你吃早餐
        </div>
        <div style={{ textAlign: "right" }}>
          <NumberHighlight>
            {formatTime(lunchMostFrequent.hour, lunchMostFrequent.minute)}
          </NumberHighlight>
          的午后，你在食堂充电
        </div>
        <div style={{ textAlign: "left" }}>
          <NumberHighlight>
            {formatTime(dinnerMostFrequent.hour, dinnerMostFrequent.minute)}
          </NumberHighlight>
          的晚风，见证你的放松时刻
        </div>
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          时间记住了你的规律，也记住了你的努力
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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>新年的第一口温暖</div>
        <div>
          {date.getMonth() + 1}月{date.getDate()}日
        </div>
        <div>
          食堂的灯光，在
          <LocationHighlight>{newYearFirstMeal.cafeteria}</LocationHighlight>
        </div>
        <div>等来了离家返校的你</div>
        <div style={{ marginTop: "40px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          新学期，从这一口热乎的饭开始
        </div>
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
        <div style={{ textAlign: "left" }}>
          <NumberHighlight>{formatTime(new Date(earliest))}</NumberHighlight>
          你已开始新的一天
        </div>
        <div style={{ textAlign: "right" }}>
          <NumberHighlight>{formatTime(new Date(latest))}</NumberHighlight>
          你还在为生活充电
        </div>
        <div style={{ marginTop: "40px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          早出晚归的日子，食堂是你温暖的港湾
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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>最舍得犒劳自己的一餐</div>
        <div>
          {date.getMonth() + 1}月{date.getDate()}日， 在
          <LocationHighlight>{mostExpensiveMealCafeteria}</LocationHighlight>
        </div>
        <div>
          你花了
          <NumberHighlight>{(mostExpensiveMealAmount / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          那天的疲惫或喜悦，都被美食温柔以待
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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>味蕾的狂欢日</div>
        <div>
          {date.getMonth() + 1}月{date.getDate()}日， 你在
          <LocationHighlight>{mostNumStallsCafeteria}</LocationHighlight>
        </div>
        <div>
          尝遍了<NumberHighlight>{mostNumStallsMealStalls}</NumberHighlight>
          个档口的滋味
        </div>
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          胃和心，都是满满的幸福
        </div>
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
          2025年的
          <NumberHighlight>{numVisitedDates}</NumberHighlight>天
        </div>
        <div>食堂的灯光，都为你亮着</div>
        <div style={{ marginTop: "40px", fontSize: "14px", color: "#666", textAlign: "center" }}>
          无论晴天雨天，总有温暖在等你
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
    return "F";
  };

  const rank = getRank(score);

  // Get personalized comment based on rank
  const getComment = (rank: string) => {
    const comments: Record<string, string> = {
      "A+": "不愧是清华美食家！",
      A: "你对食堂的爱，我们都看到了",
      "A-": "温暖的三餐，充实的一年",
      "B+": "认真吃饭的人，运气不会差",
      B: "每一餐，都是对生活的热爱",
      "B-": "吃饱了，才有力气追梦",
      "C+": "简单的三餐，不简单的坚持",
      C: "平凡的烟火气，最抚凡人心",
      D: "偶尔也要记得，好好吃饭",
      F: "明年，记得多来食堂看看",
    };
    return comments[rank] || "继续加油哦！";
  };

  const comment = getComment(rank);

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
            <div>为美好投入: {(totalAmount / 100).toFixed(2)} 元</div>
            <div>认真吃饭: {totalMeals} 顿</div>
            <div>探索温暖: {numUniqueCafeterias} 处</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <NumberHighlight>{score > 100 ? 100 : score.toFixed(1)}</NumberHighlight>
            <div style={{ fontSize: "14px", marginTop: "8px" }}>
              <NumberHighlight>{rank}</NumberHighlight>
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
        <div style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "8px" }}>
          {comment}
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

  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  return (
    <PosterCard color="#E7DFC6" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>时光里的美食曲线</div>
        <div>
          <NumberHighlight>{monthNames[peakMonth.month - 1]}</NumberHighlight>
          的你最懂生活
        </div>
        <div style={{ textAlign: "right" }}>
          用<NumberHighlight>{(peakMonth.amount / 100).toFixed(2)}</NumberHighlight>
          元装点美好
        </div>
        <div style={{ marginTop: "20px" }}>
          而<NumberHighlight>{monthNames[lowMonth.month - 1]}</NumberHighlight>的简朴
        </div>
        <div style={{ textAlign: "right" }}>也是另一种从从容容</div>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "20px", textAlign: "center" }}>
          {monthlySpending.filter((m) => m.amount > 0).length}个月的烟火气
        </div>
      </div>
    </PosterCard>
  );
}

// export function PosterAchievements({
//   data,
//   fontFamily,
// }: {
//   data: ReportData;
//   fontFamily?: string;
// }) {
//   const { achievementBadges } = data;
//   const earnedBadges = achievementBadges.filter((b) => b.earned);

//   return (
//     <PosterCard color="#DAF76F" fontFamily={fontFamily}>
//       <div>
//         <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
//           年度成就 {earnedBadges.length}/{achievementBadges.length}
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {earnedBadges.slice(0, 4).map((badge) => (
//             <div key={badge.id} style={{ fontSize: "14px", lineHeight: "1.5" }}>
//               <span style={{ fontSize: "20px", marginRight: "8px" }}>{badge.emoji}</span>
//               <span style={{ fontWeight: "bold" }}>{badge.name}</span>
//               <div style={{ fontSize: "12px", color: "#666", marginLeft: "28px" }}>
//                 {badge.description}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div style={{ fontSize: "10px", color: "#666", textAlign: "center" }}>
//         你已解锁这些专属成就！
//       </div>
//     </PosterCard>
//   );
// }

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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>你的安心角落</div>
        <div>
          无论世界多么喧嚣，你总回到
          <LocationHighlight>{mostFrequentCafeteria.cafeteria}</LocationHighlight>
        </div>
        <div style={{ marginTop: "20px" }}>
          <NumberHighlight>{mostFrequentCafeteria.totalDays}</NumberHighlight>天的时光里
        </div>
        <div style={{ textAlign: "right" }}>这里是你的充电站、避风港</div>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          最长<NumberHighlight>{mostFrequentCafeteria.maxStreak}</NumberHighlight>天的坚守
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

  // Get personalized comment based on price type
  const getPriceComment = (type: string) => {
    const comments: Record<string, string> = {
      勤俭节约型: "简单的幸福，最纯粹",
      经济实惠型: "懂得生活的智慧",
      品质生活型: "你值得更好的",
      豪华享受型: "对美好从不将就",
    };
    return comments[type] || "每一餐都是对自己负责";
  };

  const priceComment = getPriceComment(dominantPriceType);

  return (
    <PosterCard color="#E9F1F7" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>消费的温度</div>
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "8px",
          }}
        > */}
        <BarChart width={"100%"} height={150} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} width={"auto"} />
          <Tooltip contentStyle={{ fontSize: "12px" }} />
          <Bar dataKey="percentage" fill="#623CEA" radius={[4, 4, 0, 0]} />
        </BarChart>
        {/* </div> */}
      </div>
      <div style={{ fontSize: "18px", textAlign: "center" }}>
        你是<span style={{ fontWeight: "bold", color: "#623CEA" }}>{dominantPriceType}</span>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>{priceComment}</div>
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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>奋斗与休憩的时光</div>
        <div>
          工作日，你用
          <NumberHighlight>
            {(weekdayWeekendStats.weekday.avgCost / 100).toFixed(2)}
          </NumberHighlight>
          元为自己加油
        </div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          {weekdayWeekendStats.weekday.topCafeteria}记得你拼搏的样子
        </div>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          周末，你用
          <NumberHighlight>
            {(weekdayWeekendStats.weekend.avgCost / 100).toFixed(2)}
          </NumberHighlight>
          元犒劳自己
        </div>
        <div style={{ fontSize: "14px", color: "#666", textAlign: "right" }}>
          {weekdayWeekendStats.weekend.topCafeteria}见证你放松的时刻
        </div>
      </div>
      <div style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
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

  // Get seasonal comment
  const getSeasonComment = (season: string) => {
    const comments: Record<string, string> = {
      春天: "新芽和美食一起生长",
      夏天: "炎炎夏日里的清凉慰藉",
      秋天: "丰收的季节，胃口也丰收",
      冬天: "寒冷的日子里，热腾腾的温暖",
    };
    return comments[season] || "每个季节都有独特的味道";
  };

  const seasonComment = getSeasonComment(bestSeason);

  return (
    <PosterCard color="#E7DFC6" fontFamily={fontFamily}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
          四季的味觉记忆
        </div>
        <BarChart width={"100%"} height={150} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} width={"auto"} />
          <Tooltip contentStyle={{ fontSize: "12px" }} />
          <Bar dataKey="avgCost" fill="#623CEA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </div>
      <div style={{ fontSize: "18px", textAlign: "center" }}>
        <NumberHighlight>{bestSeason}</NumberHighlight>的你最懂生活
        <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>{seasonComment}</div>
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
          最熟悉的温暖
        </div>
        <BarChart width={"100%"} height={160} data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={"auto"} />
          <Tooltip contentStyle={{ fontSize: "12px" }} />
          <Bar dataKey="days" fill="#623CEA" radius={[0, 4, 4, 0]} />
        </BarChart>
        <div style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
          这些地方，都有你温暖的足迹
        </div>
      </div>
    </PosterCard>
  );
}

// export function PosterThankYou({ data, fontFamily }: { data: ReportData; fontFamily?: string }) {
//   const { totalMeals, numUniqueCafeterias } = data;

//   return (
//     <PosterCard color="#F9E98F" fontFamily={fontFamily}>
//       <div style={{ fontSize: "16px", lineHeight: "1.8", textAlign: "center" }}>
//         <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "30px" }}>感谢有你</div>
//         <div style={{ marginBottom: "20px" }}>
//           <NumberHighlight>{totalMeals}</NumberHighlight>顿饭
//         </div>
//         <div style={{ marginBottom: "20px" }}>
//           <NumberHighlight>{numUniqueCafeterias}</NumberHighlight>个食堂
//         </div>
//         <div style={{ fontSize: "14px", color: "#666", marginTop: "30px" }}>
//           2025，感谢清华食堂的陪伴
//         </div>
//         <div style={{ fontSize: "14px", color: "#666" }}>期待2026的美食之旅</div>
//       </div>
//     </PosterCard>
//   );
// }

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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>💧 冲刷疲惫都时刻</div>
        <div>
          <NumberHighlight>{waterUtilitiesStats.totalTransactions}</NumberHighlight>次热水
        </div>
        <div style={{ textAlign: "right" }}>
          洗去了
          <NumberHighlight>{(waterUtilitiesStats.totalAmount / 100).toFixed(2)}</NumberHighlight>
          元的疲惫
        </div>
        <div style={{ marginTop: "10px" }}>
          每次
          <NumberHighlight>{(waterUtilitiesStats.avgCost / 100).toFixed(2)}</NumberHighlight>元
          换来一身清爽
        </div>
        <div style={{ marginTop: "10px" }}>
          最常在
          <NumberHighlight>{formatHour(waterUtilitiesStats.mostFrequentHour)}</NumberHighlight>
          让温暖包围自己
        </div>
      </div>
      <div style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
        {waterUtilitiesStats.totalDays}天的清爽，{waterUtilitiesStats.totalDays}次的新生
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
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>💰 生活的节奏</div>
        <div>
          <NumberHighlight>{balanceManagementStats.topUpCount}</NumberHighlight>次充值
        </div>
        <div style={{ fontSize: "14px", color: "#666", textAlign: "right" }}>
          为生活注入{(balanceManagementStats.totalTopUpAmount / 100).toFixed(2)}元的能量
        </div>
        <div style={{ marginTop: "10px" }}>
          最低
          <NumberHighlight>
            {(balanceManagementStats.lowestBalance / 100).toFixed(2)}
          </NumberHighlight>
          元，也没让生活失色
        </div>
        <div style={{ marginTop: "10px" }}>
          年末还有
          <NumberHighlight>
            {(balanceManagementStats.endingBalance / 100).toFixed(2)}
          </NumberHighlight>
          元温暖在手
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
          🎨 生活的调色板
        </div>
        <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
          除了三餐，还有
          <NumberHighlight>{beyondDiningStats.nonMealTransactions}</NumberHighlight>笔
        </div>
        <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
          为生活添彩，共
          <NumberHighlight>{(beyondDiningStats.nonMealAmount / 100).toFixed(2)}</NumberHighlight>元
        </div>
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
          {topCategories.map((cat) => (
            <div key={cat.category} style={{ marginBottom: "4px" }}>
              {cat.category}: {cat.count}次的小确幸
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
        华子的生活，多姿多彩
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
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  return (
    <PosterCard color="#D4F1F4" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>📅 时光印记</div>
        <div style={{ fontSize: "16px" }}>
          <NumberHighlight>{formatDate(campusTimelineStats.firstTransaction.date)}</NumberHighlight>
          你开始了这一年的旅程
        </div>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "4px", textAlign: "right" }}>
          在{campusTimelineStats.firstTransaction.location}点亮第一笔温暖
        </div>
        <div style={{ fontSize: "16px", marginTop: "10px" }}>
          连续
          <NumberHighlight>{campusTimelineStats.longestStreak}</NumberHighlight>天都有你的足迹
        </div>
        <div style={{ fontSize: "16px", marginTop: "10px" }}>
          <NumberHighlight>{monthNames[campusTimelineStats.mostActiveMonth - 1]}</NumberHighlight>
          的你最鲜活
        </div>
      </div>
      <div style={{ fontSize: "16px", color: "#666", textAlign: "center" }}>
        {campusTimelineStats.totalActiveDays}天，每天都在认真生活
      </div>
    </PosterCard>
  );
}
