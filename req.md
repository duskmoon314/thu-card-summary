# Tsinghua Dining Card Annual Report - Extended Feature Design

## Product Overview
A fun, personalized annual report generator for Tsinghua University students based on their cafeteria card transaction data. The report consists of multiple visual cards highlighting different dining habit statistics with humorous, engaging copywriting.

## Technical Requirements
- All components accept: `{ data: ReportData, fontFamily?: string }`
- Use existing components: `PosterCard`, `NumberHighlight`, `LocationHighlight`
- Extend `ReportData` interface with new statistical fields
- Implement data processing functions for new metrics
- Maintain consistent styling and spacing

## Complete Component List (Existing + New)

### 1. Basic Statistics (Existing)
**Data**: totalAmount, totalMeals, numUniqueCafeterias, numUniqueStalls
**Copy**: 
- "2025年是个值得回味的年份"
- "你一共花了{amount}元"
- "细细品味了{meals}顿美餐"
- "走进{食堂数}个食堂，探寻过{档口数}个档口"

### 2. Favorite Spots (Existing)
**Data**: mostSpentCafeteria, mostSpentCafeteriaAmount, mostSpentStall
**Copy**: 
- "{食堂}是你最慷慨投入的地方"
- "你在那共花费{amount}元"
- "{档口}是不是你心中的华子最佳"

### 3. Average Cost Comparison (Existing)
**Data**: mostCostlyCafeteria, mostCostlyCafeteriaCost, mostCheapCafeteria, mostCheapCafeteriaCost
**Copy**:
- "在{食堂A}你平均每顿花费{amount}元"
- "而{食堂B}则以平均每顿{amount}元成为你的性价比之选"

### 4. Dining Habits (Existing)
**Data**: breakfastMostFrequent, lunchMostFrequent, dinnerMostFrequent
**Copy**:
- "早餐最常在{time}"
- "午餐通常在{time}"
- "晚餐多在{time}"

### 5. New Year First Meal (Existing)
**Data**: newYearFirstMeal
**Copy**:
- "春节后的第一顿"
- "{date}你在{食堂}开启了新学期的美食之旅"

### 6. Earliest & Latest Meals (Existing)
**Data**: earliest, latest
**Copy**:
- "最早的一顿在{time}"
- "最晚的一顿在{time}"
- "无论多早多晚，食堂永远为你亮着灯"

### 7. Most Expensive Meal (Existing)
**Data**: mostExpensiveMealDate, mostExpensiveMealAmount, mostExpensiveMealCafeteria
**Copy**:
- "最贵的一顿"
- "{date}你在{食堂}花费了{amount}元"
- "那一定是值得纪念的美味"

### 8. Most Stalls Meal (Existing)
**Data**: mostNumStallsMealDate, mostNumStallsMealStalls, mostNumStallsCafeteria
**Copy**:
- "最丰富的一顿"
- "{date}你在{食堂}品尝了{stalls}个档口"
- "尝遍百味，不负时光"

### 9. Visited Days (Existing)
**Data**: numVisitedDates
**Copy**:
- "2025年，你有{days}天在食堂留下了足迹"
- "每一天都是与美食相伴的日子"

### 10. Score Card (Existing)
**Data**: totalAmount, totalMeals, numUniqueCafeterias, cafeteriasSpent
**Copy**:
- "我的2025《日肥学导论》成绩单"
- "总消费金额: {amount}"
- "吃食堂顿数: {meals}"
- "打卡食堂数: {cafeterias}"
- "评级: {rank}"

## NEW COMPONENTS - Expanded Set

### 11. Monthly Spending Trends
**Data Needed**: monthlySpending array with {month: number, amount: number}
**Suggested Copy**:
```
## 2025年的美食消费曲线

<NumberHighlight>[最高月份]</NumberHighlight>月是你的"美食狂欢月"
这个月你花了<NumberHighlight>{最高月金额}元</NumberHighlight>
比月均高出<NumberHighlight>{百分比}%</NumberHighlight>

<NumberHighlight>[最低月份]</NumberHighlight>月则相对"克制"
是不是在忙大作业/考试呢？

（底部小字）月光族的另一种定义：每月都把钱"光"在美食上
```

### 12. Achievement Badges
**Data Needed**: Array of badges earned with conditions
**Suggested Copy**:
```
## 2025年收获的吃货勋章

🏆 食堂探险家
  打卡{numCafeterias}个不同食堂，探索精神满分！

🌙 深夜干饭人
  {lateNightCount}次{latestTime}后用餐，真·时间管理大师

☀️ 早餐铁人
  {breakfastDays}天吃了早餐，健康生活典范

💰 食堂VIP
  年度消费{totalAmount}元，食堂该给你分红！

🍜 面食爱好者 / 🍚 米饭党 / 🥗 轻食达人
  （根据消费最多的档口类型显示）

🏃 奔跑的干饭人
  最快用餐间隔{minInterval}分钟，食堂竞速赛冠军？
```

### 13. Most Consistent Dining Spot
**Data Needed**: cafeteria with highest day frequency, average visits per month
**Suggested Copy**:
```
## 你的"第二食堂"

<LocationHighlight>{cafeteriaName}</LocationHighlight>
是你2025年去得最多的地方

光顾了<NumberHighlight>{totalDays}</NumberHighlight>天
平均每月拜访<NumberHighlight>{avgMonthly}</NumberHighlight>次

这忠诚度，食堂阿姨都记住你了吧！
（也许该考虑办张年卡？）
```

### 14. Price Range Distribution
**Data Needed**: meal count in 4 price ranges
**Suggested Copy**:
```
## 你的消费价格带

💰 <10元: {count1}顿  | 勤俭节约型
🍱 10-20元: {count2}顿 | 经济实惠型
🍛 20-30元: {count3}顿 | 品质生活型
🦞 >30元: {count4}顿  | 豪华享受型

[简单条形图可视化]

"看来你是个{dominantType}选手！"
{根据最多区间显示不同评价}
```

### 15. Weekday vs Weekend Habits
**Data Needed**: weekday/weekend avg cost, meal count
**Suggested Copy**:
```
## 工作日 VS 周末 对比报告

📅 工作日战士
  平均每顿: {weekdayAvg}元
  总顿数: {weekdayCount}顿
  最常去: {weekdayTopCafeteria}

🎉 周末美食家
  平均每顿: {weekendAvg}元  
  总顿数: {weekendCount}顿
  最常去: {weekendTopCafeteria}

{comparisonText}
"周末更舍得犒劳自己呢" / "工作日吃得更好哦" / "相当均衡的生活！"
```

### 16. Special Day Recognition
**Data Needed**: special dining patterns (exams, holidays)
**Suggested Copy**:
```
## 那些特别的日子

📚 考试周模式
  平均消费{examAvg}元 vs 平时{normalAvg}元
  {differenceText}
  "是压力大吃得多，还是太忙随便应付？"

🏮 节假日留校
  {holidayName}你在{location}吃饭
  "食堂阿姨都记住这个不回家的孩子了"

```

### 18. Seasonal Eating Patterns
**Data Needed**: seasonal spending/meal count changes
**Suggested Copy**:
```
## 四季美食地图

🌸 春季（3-5月）
  平均每顿：{springAvg}元
  最常去：{springTop}

☀️ 夏季（6-8月）  
  平均每顿：{summerAvg}元
  最常去：{summerTop}

🍂 秋季（9-11月）
  平均每顿：{fallAvg}元
  最常去：{fallTop}

❄️ 冬季（12-2月）
  平均每顿：{winterAvg}元
  最常去：{winterTop}

"看来{season}是你最舍得吃的季节！"
```

### 19. Payment Pattern Analysis
**Data Needed**: recharge patterns, balance trends
**Suggested Copy**:
```
## 你的饭卡经济学

💳 年度总充值：{totalRecharge}元
💰 最低余额时刻：{minBalance}元
  {date}，差点就要吃土了？

📈 最大单次充值：{maxRecharge}元
  "看来那天发了奖学金/生活费？"

🔄 平均{rechargeInterval}天充一次值
  "很规律的财务管理呢！"
```

### 20. Time Investment Analysis
**Data Needed**: total time spent in cafeterias
**Suggested Copy**:
```
## 你在食堂度过的时光

⏱️ 2025年，你大约在食堂度过了
  <NumberHighlight>{totalHours}</NumberHighlight>小时

📊 相当于：
  {movieCount}部电影的时间
  {courseCount}门课的时间
  {sleepDays}天的睡眠时间

🎯 时间最长的单次用餐：
  {duration}分钟 @ {location}
  "这是吃出了米其林三星的节奏？"
```

### 21. Dietary Diversity Score
**Data Needed**: stall type variety, repeat vs new ratios
**Suggested Copy**:
```
## 你的美食探索指数

🥘 美食多样性：{diversityScore}/100
  尝试了{stallTypes}种不同类型的档口

🔄 最爱回头率：{repeatRate}%
  最常去的档口去了{topStallVisits}次

🌍 探索精神：
  {explorationComment}
  "美食冒险家" / "经典款爱好者" / "均衡型选手"
```

### 23. Budget Management
**Data Needed**: spending consistency, budget adherence
**Suggested Copy**:
```
## 你的干饭经济学

🎯 日均预算：{dailyBudget}元
  实际日均：{actualDaily}元
  {overUnder}预算{amount}元

📅 最"节俭"的一周：{minWeek}元
  最"放纵"的一周：{maxWeek}元

💡 财务管理评价：
  {financeComment}
  "精打细算型" / "随性而为型" / "完美平衡型"
```

### 24. Cafeteria Loyalty Program
**Data Needed**: sequential visit streaks
**Suggested Copy**:
```
## 你的食堂连续打卡记录

🔥 最长连续打卡：
  <NumberHighlight>{maxStreak}</NumberHighlight>天
  在{location}保持记录！

📅 当前连续打卡：{currentStreak}天
  在{currentLocation}

🏆 食堂忠诚度排名：
  1. {cafeteria1} - {days1}天
  2. {cafeteria2} - {days2}天
  3. {cafeteria3} - {days3}天

"真爱粉认证！"
```

### 25. Meal Skip Detection
**Data Needed**: skipped meal patterns, longest skip
**Suggested Copy**:
```
## 那些被跳过的饭点

⏸️ 最长无食堂记录：
  <NumberHighlight>{maxSkip}</NumberHighlight>小时
  从{startTime}到{endTime}

📊 跳过早餐：{breakfastSkips}次
  跳过午餐：{lunchSkips}次  
  跳过晚餐：{dinnerSkips}次

💡 可能的原因：
  {reasonHint}
  "睡过头了？" / "外出聚餐？" / "在忙大作业？"
```

### 26. Spontaneous vs Planned
**Data Needed**: regularity of dining times
**Suggested Copy**:
```
## 你的用餐随机性

🎲 用餐时间标准差：{stdDev}分钟
  早餐规律性：{breakfastReg}%
  午餐规律性：{lunchReg}%
  晚餐规律性：{dinnerReg}%

🧠 用餐风格：
  {styleType}
  "精准的瑞士手表" / "随性的艺术家" / "有计划的指挥官"
```

### 27. Food Journey Timeline
**Data Needed**: monthly highlights, memorable meals
**Suggested Copy**:
```
## 2025美食时间轴

📅 1月：寒假前的最后狂欢
  最贵一餐{amount}元 @ {location}

🍂 9月：新学期的探索
  尝试了{newStalls}个新档口

❄️ 12月：年末的温暖
  最常去{location}寻找温暖

"每一个月份，都有独特的食堂记忆"
```

### 29. Future Predictions
**Data Needed**: trend analysis, predictions
**Suggested Copy**:
```
## 2026年美食预言

🔮 基于2025年数据，预测2026：

💰 年度总消费：{predictedAmount}元
  比今年{change}%

🍽️ 最可能的新宠食堂：{predictedCafeteria}
  基于你的探索模式

⏰ 用餐时间将更加{predictedTimeTrend}
  {reasoning}

🎯 给你的建议：
  {suggestion}
  "多尝试新食堂！" / "注意饮食均衡" / "继续保持！"
```

### 30. Personalized "Thank You" Card
**Data Needed**: all summary statistics
**Suggested Copy**:
```
## 致2025年的你

亲爱的{可能可以自定义名字}：

感谢你在2025年认真对待每一顿饭，
在{numCafeterias}个食堂留下了足迹，
品味了{totalMeals}次美味时光。

记得{mostExpensiveDate}那顿{amount}元的大餐吗？
还有连续{streak}天去{location}的坚持？

2026年，愿食堂的灯光继续温暖你的求学路，
愿每一餐都成为美好的记忆。

—— 你的《日肥学导论》年度报告
```

## Data Interface Extension
```typescript
interface ReportData {
  // Existing fields...
  
  // New fields for extended components:
  monthlySpending: Array<{month: number, amount: number, mealCount: number}>;
  achievementBadges: Array<{
    id: string;
    name: string;
    description: string;
    earned: boolean;
    value?: number;
  }>;
  mostFrequentCafeteria: {
    name: string;
    totalDays: number;
    avgMonthly: number;
    streak: number;
  };
  priceDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  weekdayWeekendStats: {
    weekday: {
      avgCost: number;
      mealCount: number;
      topCafeteria: string;
      topStall: string;
    };
    weekend: {
      avgCost: number;
      mealCount: number;
      topCafeteria: string;
      topStall: string;
    };
    difference: {
      costDiff: number;
      countDiff: number;
      comment: string;
    };
  };
  specialDays: Array<{
    type: 'birthday' | 'exam' | 'holiday' | 'graduation';
    date: string;
    location: string;
    amount: number;
    observation: string;
  }>;
  seasonalPatterns: {
    spring: {avgCost: number; topCafeteria: string; mealCount: number};
    summer: {avgCost: number; topCafeteria: string; mealCount: number};
    fall: {avgCost: number; topCafeteria: string; mealCount: number};
    winter: {avgCost: number; topCafeteria: string; mealCount: number};
  };
  paymentPatterns: {
    totalRecharge: number;
    minBalance: number;
    minBalanceDate: string;
    maxRecharge: number;
    avgRechargeInterval: number;
    rechargeCount: number;
  };
  timeAnalysis: {
    totalHours: number;
    avgMealDuration: number;
    fastestMeal: {duration: number; date: string; location: string};
    slowestMeal: {duration: number; date: string; location: string};
  };
  dietaryDiversity: {
    score: number;
    stallTypes: number;
    repeatRate: number;
    topStallVisits: number;
    comment: string;
  };
  // ...更多字段根据实现需要添加
}
```

## Implementation Strategy
1. **数据预处理层**: 创建单独的数据处理模块，从原始交易数据计算所有统计指标
2. **组件工厂模式**: 使用配置化的方式生成卡片，便于扩展
3. **文案模板系统**: 将文案与逻辑分离，支持动态内容填充
4. **响应式设计**: 确保在不同屏幕尺寸上的良好显示
5. **性能优化**: 对大量数据处理进行缓存和懒加载

## Delivery Format
Each component will be implemented as a separate React component file following the existing pattern, with all copywriting in Chinese and component logic in TypeScript/React.