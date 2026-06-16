import { View, Text } from "react-native";
import { colors, s } from "../tw";

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

export function BarChart({ data, title, maxValue, height = 160 }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={[s.bgWhite, s.roundedXl, s.p4, s.mx4, { marginBottom: 12 }]}>
      {title && <Text style={[s.textBase, s.fontSemibold, s.textGray800, s.mb3]}>{title}</Text>}
      <View style={[s.row, { alignItems: "flex-end", justifyContent: "space-around", height }]}>
        {data.map((item, i) => {
          const barHeight = (item.value / max) * (height - 20);
          return (
            <View key={i} style={[s.center, s.flex1]}>
              <Text style={[s.textXs, s.textGray500, { marginBottom: 4 }]}>{item.value}</Text>
              <View
                style={{ height: Math.max(barHeight, 4), width: 32, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: item.barColor || colors.primary[400] }}
              />
              <Text style={[s.textXs, s.textGray500, { marginTop: 4, maxWidth: 48 }]} numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

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
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <View style={[s.center, { paddingVertical: 16 }]}>
        {title && <Text style={[s.textBase, s.fontSemibold, s.textGray800, s.mb2]}>{title}</Text>}
        <Text style={[s.textSm, s.textGray400]}>暂无数据</Text>
      </View>
    );
  }
  return (
    <View style={[s.center, { paddingVertical: 8 }]}>
      {title && <Text style={[s.textBase, s.fontSemibold, s.textGray800, s.mb2]}>{title}</Text>}
      <View style={[s.row, { flexWrap: "wrap", justifyContent: "center", gap: 8 }]}>
        {data.map((d, i) => (
          <View key={i} style={s.rowCenter}>
            <View style={{ width: 12, height: 12, borderRadius: 6, marginRight: 4, backgroundColor: d.color }} />
            <Text style={[s.textXs, s.textGray600]}>{d.label} {Math.round((d.value / total) * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}