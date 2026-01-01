import { useState, useRef, useEffect } from "react";
import { Button, Carousel, Space, Flex, Select } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import type { CarouselRef } from "antd/es/carousel";
import type { ReportData } from "@/lib/types";
import {
  PosterBasicStats,
  PosterFavorite,
  PosterMeanCost,
  PosterHabit,
  PosterFirstMeal,
  PosterEarliestLatest,
  PosterMostExpensive,
  PosterMostStalls,
  PosterVisitedDays,
  PosterScore,
  PosterMonthlyTrends,
  PosterAchievements,
  PosterConsistentSpot,
  PosterPriceDistribution,
  PosterWeekdayWeekend,
  PosterSeasonalPatterns,
  PosterLoyalty,
  PosterThankYou,
  PosterWaterUtilities,
  PosterBalanceManagement,
  PosterBeyondDining,
  PosterCampusTimeline,
} from "./report/posters";
import { downloadPosterImage } from "@/lib/image-export";

// Fallback fonts if API not available
const FALLBACK_FONTS = [
  { label: "默认字体", value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: "苹方 (PingFang SC)", value: "PingFang SC, -apple-system, sans-serif" },
  { label: "微软雅黑 (Microsoft YaHei)", value: "Microsoft YaHei, sans-serif" },
  { label: "思源黑体 (Source Han Sans)", value: "Source Han Sans SC, sans-serif" },
  { label: "思源宋体 (Source Han Serif)", value: "Source Han Serif SC, serif" },
  { label: "楷体 (KaiTi)", value: "KaiTi, serif" },
  { label: "宋体 (SimSun)", value: "SimSun, serif" },
  { label: "黑体 (SimHei)", value: "SimHei, sans-serif" },
];

/**
 * Query available fonts using Local Font Access API
 */
async function queryAvailableFonts(): Promise<{ label: string; value: string }[]> {
  // Check if Local Font Access API is available
  if (!("queryLocalFonts" in window)) {
    console.log("[FONTS] Local Font Access API not available, using fallback");
    return FALLBACK_FONTS;
  }

  try {
    console.log("[FONTS] Requesting font access permission...");

    // Query local fonts (requires user permission)
    const fonts = await (window as any).queryLocalFonts();
    console.log("[FONTS] Found", fonts.length, "fonts");

    // Group fonts by family, preferring Regular style
    const fontsByFamily = new Map<string, any>();

    for (const font of fonts) {
      const family = font.family;

      // Prioritize Chinese fonts
      const isChinese =
        /[\u4e00-\u9fa5]/.test(family) ||
        family.includes("SC") ||
        family.includes("TC") ||
        family.includes("Chinese") ||
        family.includes("Hei") ||
        family.includes("Song") ||
        family.includes("Kai") ||
        family.includes("PingFang") ||
        family.includes("YaHei") ||
        family.includes("SimSun") ||
        family.includes("SimHei");

      if (!isChinese) continue;

      const existing = fontsByFamily.get(family);

      // If no font for this family yet, or current font is Regular, use it
      if (!existing) {
        fontsByFamily.set(family, font);
      } else {
        // Prefer Regular style over other styles
        const currentStyle = (font.style || "").toLowerCase();
        const existingStyle = (existing.style || "").toLowerCase();

        // Priority: Regular > Medium > Normal > others
        const isCurrentRegular =
          currentStyle.includes("regular") || currentStyle === "normal" || currentStyle === "";
        const isExistingRegular =
          existingStyle.includes("regular") || existingStyle === "normal" || existingStyle === "";
        const isCurrentMedium = currentStyle.includes("medium");
        const isExistingMedium = existingStyle.includes("medium");

        if (isCurrentRegular && !isExistingRegular) {
          fontsByFamily.set(family, font);
        } else if (!isExistingRegular && isCurrentMedium && !isExistingMedium) {
          fontsByFamily.set(family, font);
        }
      }
    }

    // Build font list from preferred variants
    const chineseFonts: { label: string; value: string }[] = [
      {
        label: "默认字体",
        value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    ];

    for (const [family, font] of fontsByFamily) {
      // Use fullName for display if available, fallback to postscriptName or family
      const displayName = font.fullName || font.postscriptName || family;
      chineseFonts.push({
        label: displayName,
        value: family, // Use family for CSS font-family
      });
    }

    // Sort alphabetically (except default at top)
    const sortedFonts = [
      chineseFonts[0],
      ...chineseFonts.slice(1).sort((a, b) => a.label.localeCompare(b.label)),
    ];

    console.log("[FONTS] Available Chinese fonts:", sortedFonts.length - 1);
    return sortedFonts.length > 1 ? sortedFonts : FALLBACK_FONTS;
  } catch (error) {
    console.error("[FONTS] Error querying fonts:", error);
    return FALLBACK_FONTS;
  }
}

interface ReportViewProps {
  data: ReportData;
  onBack: () => void;
}

export default function ReportView({ data, onBack }: ReportViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FALLBACK_FONTS[0].value);
  const [availableFonts, setAvailableFonts] = useState(FALLBACK_FONTS);
  const [loadingFonts, setLoadingFonts] = useState(true);
  const carouselRef = useRef<CarouselRef>(null);
  const posterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Query available fonts on mount
  useEffect(() => {
    queryAvailableFonts()
      .then((fonts) => {
        setAvailableFonts(fonts);
        setLoadingFonts(false);
      })
      .catch(() => {
        setAvailableFonts(FALLBACK_FONTS);
        setLoadingFonts(false);
      });
  }, []);

  const posters = [
    <PosterBasicStats key="basic" data={data} fontFamily={selectedFont} />,
    <PosterFavorite key="favorite" data={data} fontFamily={selectedFont} />,
    <PosterMeanCost key="cost" data={data} fontFamily={selectedFont} />,
    <PosterHabit key="habit" data={data} fontFamily={selectedFont} />,
    <PosterFirstMeal key="first" data={data} fontFamily={selectedFont} />,
    <PosterEarliestLatest key="earliest" data={data} fontFamily={selectedFont} />,
    <PosterMostExpensive key="expensive" data={data} fontFamily={selectedFont} />,
    <PosterMostStalls key="stalls" data={data} fontFamily={selectedFont} />,
    <PosterVisitedDays key="visited" data={data} fontFamily={selectedFont} />,
    <PosterScore key="score" data={data} fontFamily={selectedFont} />,
    <PosterMonthlyTrends key="monthly" data={data} fontFamily={selectedFont} />,
    <PosterAchievements key="achievements" data={data} fontFamily={selectedFont} />,
    <PosterConsistentSpot key="consistent" data={data} fontFamily={selectedFont} />,
    <PosterPriceDistribution key="price" data={data} fontFamily={selectedFont} />,
    <PosterWeekdayWeekend key="weekday" data={data} fontFamily={selectedFont} />,
    <PosterSeasonalPatterns key="seasonal" data={data} fontFamily={selectedFont} />,
    <PosterLoyalty key="loyalty" data={data} fontFamily={selectedFont} />,
    <PosterWaterUtilities key="water" data={data} fontFamily={selectedFont} />,
    <PosterBalanceManagement key="balance" data={data} fontFamily={selectedFont} />,
    <PosterBeyondDining key="beyond" data={data} fontFamily={selectedFont} />,
    <PosterCampusTimeline key="timeline" data={data} fontFamily={selectedFont} />,
    <PosterThankYou key="thankyou" data={data} fontFamily={selectedFont} />,
  ].filter((poster) => poster !== null);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = posterRefs.current[currentSlide];
      if (!element) {
        throw new Error("Poster element not found");
      }

      console.log("[DOWNLOAD] Starting image generation for slide:", currentSlide);
      await downloadPosterImage(element, currentSlide);
      console.log("[DOWNLOAD] Image downloaded successfully");
    } catch (error) {
      console.error("[DOWNLOAD] Error:", error);
      alert("下载失败：" + (error instanceof Error ? error.message : "未知错误"));
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadRawData = () => {
    try {
      if (!data.rawTransactions || data.rawTransactions.length === 0) {
        alert("没有可导出的原始交易数据");
        return;
      }

      // Convert to JSONL format (one JSON object per line)
      const jsonl = data.rawTransactions.map((tx) => JSON.stringify(tx)).join("\n");

      // Create blob and download
      const blob = new Blob([jsonl], { type: "application/x-ndjson" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thu-card-transactions-${new Date().toISOString().split("T")[0]}.jsonl`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("[DOWNLOAD] Raw data downloaded:", data.rawTransactions.length, "transactions");
    } catch (error) {
      console.error("[DOWNLOAD] Error downloading raw data:", error);
      alert("下载失败：" + (error instanceof Error ? error.message : "未知错误"));
    }
  };

  return (
    <Flex vertical gap="middle" style={{ height: "100%" }}>
      {/* Toolbar */}
      <Space>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          返回
        </Button>
        <Select
          value={selectedFont}
          onChange={setSelectedFont}
          options={availableFonts}
          style={{ width: 200 }}
          placeholder="选择字体"
          loading={loadingFonts}
        />
        <Button
          icon={<DownloadOutlined />}
          type="primary"
          loading={downloading}
          onClick={handleDownload}
        >
          下载当前图片
        </Button>
        <Button
          icon={<FileTextOutlined />}
          onClick={handleDownloadRawData}
          disabled={!data.rawTransactions || data.rawTransactions.length === 0}
        >
          导出原始数据
        </Button>
      </Space>

      {/* Carousel */}
      <Flex vertical align="center" flex={1}>
        <Carousel
          ref={carouselRef}
          style={{ width: "100%", maxWidth: "350px" }}
          beforeChange={(_, next) => setCurrentSlide(next)}
          arrows
        >
          {posters.map((poster, index) => (
            <div
              key={index}
              ref={(el) => {
                posterRefs.current[index] = el;
              }}
            >
              {poster}
            </div>
          ))}
        </Carousel>

        {/* Indicators */}
        <Flex gap="small" style={{ marginTop: "16px" }}>
          {posters.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentSlide ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: index === currentSlide ? "#667eea" : "#d9d9d9",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onClick={() => carouselRef.current?.goTo(index)}
            />
          ))}
        </Flex>

        <div style={{ marginTop: "8px", fontSize: "13px", color: "#999" }}>
          {currentSlide + 1} / {posters.length}
        </div>
      </Flex>
    </Flex>
  );
}
