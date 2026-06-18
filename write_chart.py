import sys

# Convert PieChart to a professional stacked bar + legend chart
# Enhance BarChart with professional styling

content = '''import { View, Text, Dimensions } from "react-native";
import { colors, s, getThemeColors } from "../tw";
import { useSettingsStore } from "../stores/settingsStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Professional Stacked Bar + Legend Chart ───
interface PieData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  title?: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const themeColor = useSettingsStore((s) => s.themeColor);
  const tc = getThemeColors(themeColor);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        {title && <Text style={[s.textSm, s.fontSemibold, s.textGray800, { marginBottom: 6 }]}>{title}</Text>}
        <Text style={[s.textSm, s.textGray400]}>暂无数据</Text>
      </View>
    );
  }

  // Sort by value descending for better visual
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <View>
      {title && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 }}>
          <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: tc[500] }} />
          <Text style={[s.textSm, s.fontSemibold, s.textGray800]}>{title}</Text>
        </View>
      )}

      {/* Stacked Bar - visual proportion representation */}
      <View style={{ height: 12, borderRadius: 6, overflow: "hidden", flexDirection: "row", backgroundColor: colors.gray[100] }}>
        {sorted.map((d, i) => (
          <View
            key={i}
            style={{ flex: d.value / total, backgroundColor: d.color }}
          />
        ))}
      </View>

      {/* Percentage values inside the bar */}
      <View style={{ flexDirection: "row", marginTop: 4, marginBottom: 12 }}>
        {sorted.map((d, i) => {
          const pct = Math.round((d.value / total) * 100);
          if (pct < 8) return null;
          return (
            <Text key={i} style={{ fontSize: 11, fontWeight: "700", flex: d.value / total, textAlign: "left" }}>
            </Text>
          );
        })}
      </View>

      {/* Legend - clean business-style layout */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {sorted.map((d, i) => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: d.color + "12",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
                gap: 6,
              }}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: d.color }} />
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.gray[700] }}>
                {d.label}
              </Text>
              <View style={{
                backgroundColor: d.color + "25",
                paddingHorizontal: 5,
                paddingVertical: 1,
                borderRadius: 4,
              }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: d.color }}>{pct}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Total count */}
      <Text style={{ fontSize: 11, color: colors.gray[400], textAlign: "center", marginTop: 8 }}>
        {total} 项总计
      </Text>
    </View>
  );
}

// ─── Professional Bar Chart with Grid ───
interface BarData {
  label: string;
  value: number;
  barColor?: string;
}

interface BarChartProps {
  data: BarData[];
  title?: string;
  maxValue?: number;
  height?: number;
}

export function BarChart({ data, title, maxValue, height = 180 }: BarChartProps) {
  const themeColor = useSettingsStore((s) => s.themeColor);
  const tc = getThemeColors(themeColor);
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - 40;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View style={{
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    }}>
      {title && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 }}>
          <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: tc[500] }} />
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.gray[800] }}>{title}</Text>
        </View>
      )}

      <View style={{ height }}>
        {/* Grid lines */}
        {gridLines.map((line) => (
          <View
            key={line}
            style={{
              position: "absolute",
              bottom: 24 + line * (chartHeight - 10),
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: colors.gray[50],
            }}
          />
        ))}

        {/* Bars */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", marginBottom: 4 }}>
          {data.map((item, i) => {
            const barHeight = Math.max((item.value / max) * (chartHeight - 10), 6);
            const barColor = item.barColor || tc[400];

            return (
              <View key={i} style={{ flex: 1, alignItems: "center" }}>
                {/* Value label */}
                <Text style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: colors.gray[700],
                  marginBottom: 6,
                }}>
                  {item.value}
                </Text>

                {/* Bar with gradient-like effect */}
                <View style={{
                  width: 36,
                  height: barHeight,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  backgroundColor: barColor,
                  shadowColor: barColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                  overflow: "hidden",
                }}>
                  {/* Gradient overlay - lighter top */}
                  <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: barHeight * 0.4,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  }} />
                </View>

                {/* Label */}
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.gray[500],
                    marginTop: 6,
                    maxWidth: 52,
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
'''

with open("src/components/Chart.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Chart.tsx rewritten professionally")
