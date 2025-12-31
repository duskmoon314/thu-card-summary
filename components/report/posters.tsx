/**
 * Report poster components
 * Migrated from thu-food-report with Ant Design styling
 */

import { Cell, Pie, PieChart } from "recharts";
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
      fontFamily:
        fontFamily ||
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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

export function PosterBasicStats({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { totalAmount, totalMeals, numUniqueCafeterias, numUniqueStalls } =
    data;

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
            <NumberHighlight>{(totalAmount / 100).toFixed(2)}</NumberHighlight>
            元
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

export function PosterFavorite({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
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
          <NumberHighlight>
            {(mostSpentCafeteriaAmount / 100).toFixed(2)}
          </NumberHighlight>
          元
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

export function PosterMeanCost({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
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
          <NumberHighlight>
            {(mostCostlyCafeteriaCost / 100).toFixed(2)}
          </NumberHighlight>
          元
        </div>
        <div style={{ marginTop: "40px" }}>
          而<LocationHighlight>{mostCheapCafeteria}</LocationHighlight>
        </div>
        <div>
          则以平均每顿
          <NumberHighlight>
            {(mostCheapCafeteriaCost / 100).toFixed(2)}
          </NumberHighlight>
          元
        </div>
        <div>成为你的性价比之选</div>
      </div>
    </PosterCard>
  );
}

export function PosterHabit({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { breakfastMostFrequent, lunchMostFrequent, dinnerMostFrequent } = data;

  const formatTime = (h: number, m: number) =>
    `${h}:${String(m).padStart(2, "0")}`;

  return (
    <PosterCard color="#E9F1F7" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>
          你的用餐习惯
        </div>
        <div>
          早餐最常在
          <NumberHighlight>
            {formatTime(
              breakfastMostFrequent.hour,
              breakfastMostFrequent.minute
            )}
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

export function PosterFirstMeal({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { newYearFirstMeal } = data;
  const date = new Date(newYearFirstMeal.date);

  return (
    <PosterCard color="#FDCBD3" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>
          春节后的第一顿
        </div>
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
  const formatTime = (d: Date) =>
    `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;

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
  const {
    mostExpensiveMealDate,
    mostExpensiveMealAmount,
    mostExpensiveMealCafeteria,
  } = data;
  const date = new Date(mostExpensiveMealDate);

  return (
    <PosterCard color="#DAF76F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>
          最贵的一顿
        </div>
        <div>
          {date.getMonth() + 1}月{date.getDate()}日
        </div>
        <div>
          你在
          <LocationHighlight>{mostExpensiveMealCafeteria}</LocationHighlight>
        </div>
        <div>
          花费了
          <NumberHighlight>
            {(mostExpensiveMealAmount / 100).toFixed(2)}
          </NumberHighlight>
          元
        </div>
        <div style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}>
          那一定是值得纪念的美味
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterMostStalls({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const {
    mostNumStallsMealDate,
    mostNumStallsMealStalls,
    mostNumStallsCafeteria,
  } = data;
  const date = new Date(mostNumStallsMealDate);

  return (
    <PosterCard color="#F9E98F" fontFamily={fontFamily}>
      <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>
          最丰富的一顿
        </div>
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
        <div style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}>
          尝遍百味，不负时光
        </div>
      </div>
    </PosterCard>
  );
}

export function PosterVisitedDays({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
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

export function PosterScore({
  data,
  fontFamily,
}: {
  data: ReportData;
  fontFamily?: string;
}) {
  const { totalAmount, totalMeals, numUniqueCafeterias, cafeteriasSpent } =
    data;

  // Calculate score using original formula
  const score =
    totalAmount * 0.00003 + totalMeals * 0.01 + numUniqueCafeterias * 6;

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
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }: any) => {
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
            <NumberHighlight>
              {score > 100 ? 100 : score.toFixed(1)}
            </NumberHighlight>
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
