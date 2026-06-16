import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { MealCard } from "../../src/components/MealCard";
import { PieChart } from "../../src/components/Chart";
import { QuickActionBar } from "../../src/components/QuickActionBar";
import type { ActionType } from "../../src/components/QuickActionBar";
import { useMealStore } from "../../src/stores/mealStore";
import { getMealsByRange } from "../../src/services/mealService";
import { getSymptomsByRange } from "../../src/services/symptomService";
import { getCorrelationResults } from "../../src/services/correlationService";
import { today } from "../../src/utils/date";
import type { Staple } from "../../src/types";
import { StapleLabels } from "../../src/types";
import { colors, s } from "../../src/tw";

const stapleColors: Record<string, string> = {
  rice: "#4CAF50", noodles: "#FF9800", mantou: "#9E9E9E", bread: "#795548", meat: "#F44336", seafood: "#2196F3", other: "#607D8B",
};

interface WarningItem {
  food_name: string;
  symptom_type: string;
  discomfort_index: number;
}

export default function HomePage() {
  const router = useRouter();
  const { todayMeals, setTodayMeals, recentSymptoms, setRecentSymptoms } = useMealStore();
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { start, end } = today();
    const [meals, symptoms, correlations] = await Promise.all([
      getMealsByRange(start, end),
      getSymptomsByRange(start, end),
      getCorrelationResults(),
    ]);
    setTodayMeals(meals);
    setRecentSymptoms(symptoms);
    setWarnings(correlations.slice(0, 3));
    setLoading(false);
  }, [setTodayMeals, setRecentSymptoms]);

  useEffect(() => { loadData(); }, [loadData]);

  const stapleCount: Record<string, number> = {};
  todayMeals.forEach((m) => { if (m.staple) stapleCount[m.staple] = (stapleCount[m.staple] || 0) + 1; });
  const pieData = Object.entries(stapleCount).map(([key, val]) => ({
    label: StapleLabels[key as Staple] || key,
    value: val,
    color: stapleColors[key] || "#9E9E9E",
  }));

  const handleAction = (type: ActionType) => {
    router.push({ pathname: "/add", params: { mode: type === "symptom" ? "symptom" : "meal" } });
  };

  return (
    <View style={[s.flex1, s.bgGray50]}>
      <View style={[s.bgWhite, { paddingTop: 56, paddingBottom: 16 }, s.px4, s.shadowSm]}>
        <Text style={[s.text2xl, s.fontBold, s.textGray900]}>今日记录</Text>
        <Text style={[s.textSm, s.textGray400, s.mt1]}>
          已记录 {todayMeals.length} 餐 &middot; {recentSymptoms.length} 项反应
        </Text>
      </View>

      <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
        {pieData.length > 0 && <View style={s.mt3}><PieChart data={pieData} title="主食占比" /></View>}

        {warnings.length > 0 && (
          <View style={[{ backgroundColor: colors.red[50], marginHorizontal: 16, padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.red[100] }]}>
            <Text style={[s.textSm, s.fontSemibold, { color: colors.red[700], marginBottom: 4 }]}>&#x26A0;&#xFE0F; 今日预警</Text>
            {warnings.map((w, i) => (
              <Text key={i} style={[s.textSm, { color: colors.red[600] }]}>
                &middot; {w.food_name}（{w.symptom_type}，不适指数 {w.discomfort_index.toFixed(1)}）
              </Text>
            ))}
            <Text style={[s.textXs, { color: colors.red[400], marginTop: 4 }]}>建议避免高不适指数食物的组合</Text>
          </View>
        )}

        {loading ? (
          <View style={[s.center, { paddingVertical: 40 }]}>
            <Text style={s.textGray400}>加载中...</Text>
          </View>
        ) : todayMeals.length === 0 ? (
          <View style={[s.center, { paddingVertical: 40 }]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>{String.fromCodePoint(0x1F37D)}</Text>
            <Text style={[s.textGray400, { marginBottom: 4 }]}>今天还没有记录</Text>
            <Text style={[s.textGray400, s.textSm]}>点击下方按钮开始记录</Text>
          </View>
        ) : (
          <View style={[{ marginTop: 8, paddingBottom: 16 }]}>
            {todayMeals.map((meal) => <MealCard key={meal.id} meal={meal} />)}
          </View>
        )}

        {recentSymptoms.length > 0 && (
          <View style={[{ marginTop: 8, marginBottom: 16 }]}>
            <Text style={[s.textBase, s.fontSemibold, s.textGray800, { paddingHorizontal: 16, marginBottom: 8 }]}>今日身体反应</Text>
            {recentSymptoms.map((sx) => (
              <View key={sx.id} style={[s.bgWhite, s.roundedXl, { padding: 12, marginBottom: 8 }, s.mx4, { borderWidth: 1, borderColor: colors.gray[100] }]}>
                <View style={[s.rowCenter, s.between]}>
                  <Text style={[s.textGray900, s.fontMedium]}>{sx.type}</Text>
                  <Text style={[s.textGray400, s.textSm]}>严重度: {sx.severity}/5</Text>
                </View>
                {sx.note && <Text style={[s.textGray500, s.textSm, s.mt1]}>{sx.note}</Text>}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <QuickActionBar onAction={handleAction} />
    </View>
  );
}