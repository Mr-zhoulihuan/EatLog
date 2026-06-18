import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { BarChart } from "../../src/components/Chart";
import { getAllMeals } from "../../src/services/mealService";
import { calculateCorrelations, getCorrelationResults } from "../../src/services/correlationService";
import { SymptomTypeLabels } from "../../src/types";
import { colors, s, getThemeColors } from "../../src/tw";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { useT } from "../../src/i18n";

interface DiscomfortItem {
  food_name: string;
  symptom_type: string;
  count: number;
  avg_severity: number;
  discomfort_index: number;
}

export default function StatsPage() {
  const { t } = useT();
  const themeColor = useSettingsStore((s) => s.themeColor);
  const tc = getThemeColors(themeColor);

  const [frequency, setFrequency] = useState<{ label: string; value: number; barColor?: string }[]>([]);
  const [warnings, setWarnings] = useState<DiscomfortItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    const meals = await getAllMeals();
    const freqMap = new Map<string, number>();
    meals.forEach((m) => freqMap.set(m.food_name, (freqMap.get(m.food_name) || 0) + 1));
    const sorted = [...freqMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7).map(([label, value]) => ({ label, value, barColor: tc[500] }));
    setFrequency(sorted);

    await calculateCorrelations();
    const correlations = await getCorrelationResults();
    setWarnings(correlations.slice(0, 10));
    setLoading(false);
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <View style={[s.flex1, s.bgGray50]}>
      <View style={[s.bgWhite, { paddingTop: 56, paddingBottom: 16 }, s.px4, s.shadowSm]}>
        <Text style={[s.text2xl, s.fontBold, s.textGray900]}>{t("stats.title")}</Text>
      </View>

      {loading ? (
        <View style={[s.flex1, s.center]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
          <View style={s.mt3}>
            <BarChart data={frequency.length > 0 ? frequency : [{ label: t("stats.noData") + "", value: 0 }]} title={t("stats.freqRank")} />
          </View>

          <View style={[s.bgWhite, s.mx4, s.roundedXl, s.p4, { marginBottom: 24 }]}>
            <Text style={[s.textBase, s.fontSemibold, s.textGray800, { marginBottom: 12 }]}>{t("stats.sensitiveFoods")}</Text>
            {warnings.length === 0 ? (
              <Text style={[s.textSm, s.textGray400]}>{t("stats.noWarnings")}</Text>
            ) : (
              warnings.map((w, i) => (
                <View key={`${w.food_name}-${w.symptom_type}`} style={[s.rowCenter, { paddingVertical: 10 }, i < warnings.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.gray[50] } : {}]}>
                  <View style={[{ width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" }, i < 3 ? { backgroundColor: colors.red[100] } : { backgroundColor: colors.gray[100] }]}>
                    <Text style={[{ fontSize: 12, fontWeight: "700" }, i < 3 ? { color: colors.red[600] } : { color: colors.gray[500] }]}>{i + 1}</Text>
                  </View>
                  <View style={[s.flex1, { marginLeft: 12 }]}>
                    <Text style={[s.textSm, s.fontMedium, s.textGray900]}>{w.food_name}</Text>
                    <Text style={[s.textXs, s.textGray400]}>
                      {SymptomTypeLabels[w.symptom_type as keyof typeof SymptomTypeLabels] || w.symptom_type} &middot; {w.count} {t("stats.times").replace("{n}", String(w.count))}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: colors.red[50], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                    <Text style={[s.textXs, s.fontSemibold, { color: colors.red[600] }]}>{w.discomfort_index.toFixed(1)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}