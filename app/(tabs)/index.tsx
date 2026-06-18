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
import { formatDate, formatDateShort } from "../../src/utils/date";
import type { Staple } from "../../src/types";
import { StapleLabels, SymptomTypeLabels } from "../../src/types";
import { colors, s, getThemeColors, getThemeBg } from "../../src/tw";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { useT } from "../../src/i18n";
import type { Meal } from "../../src/types";

const stapleColors: Record<string, string> = {
  rice: "#4CAF50", noodles: "#FF9800", mantou: "#9E9E9E", bread: "#795548",
  meat: "#F44336", seafood: "#2196F3", other: "#607D8B",
};

interface WarningItem {
  food_name: string;
  symptom_type: string;
  discomfort_index: number;
}

function getDateRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(start.getTime() + 86400000);
  return { start: start.getTime(), end: end.getTime() };
}

function getWeekRange(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.getFullYear(), date.getMonth(), diff);
  const nextMonday = new Date(monday.getTime() + 7 * 86400000);
  return { start: monday.getTime(), end: nextMonday.getTime() };
}

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start: start.getTime(), end: end.getTime() };
}

export default function HomePage() {
  const router = useRouter();
  const { todayMeals, setTodayMeals, recentSymptoms, setRecentSymptoms } = useMealStore();
  const themeColor = useSettingsStore((s) => s.themeColor);
  const themeBackground = useSettingsStore((s) => s.themeBackground);
  const themeOpacity = useSettingsStore((s) => s.themeOpacity);
  const tc = getThemeColors(themeColor);
  const homeTheme = getThemeBg(themeBackground, themeOpacity);
  const { t } = useT();

  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateMode, setDateMode] = useState<"day" | "week" | "month">("day");

  const getSelectedRange = useCallback(() => {
    if (dateMode === "week") return getWeekRange(selectedDate);
    if (dateMode === "month") return getMonthRange(selectedDate);
    return getDateRange(selectedDate);
  }, [selectedDate, dateMode]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const range = getSelectedRange();
    const [meals, symptoms, correlations] = await Promise.all([
      getMealsByRange(range.start, range.end),
      getSymptomsByRange(range.start, range.end),
      getCorrelationResults(),
    ]);
    setTodayMeals(meals);
    setRecentSymptoms(symptoms);
    setWarnings(correlations.slice(0, 3));
    setLoading(false);
  }, [setTodayMeals, setRecentSymptoms, getSelectedRange]);

  useEffect(() => { loadData(); }, [loadData]);

  const changeDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    if (dateMode === "day") newDate.setDate(newDate.getDate() + direction);
    else if (dateMode === "week") newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const quickJump = (target: "today" | "yesterday" | "week" | "month") => {
    if (target === "today") { setSelectedDate(new Date()); setDateMode("day"); }
    else if (target === "yesterday") {
      const d = new Date(); d.setDate(d.getDate() - 1);
      setSelectedDate(d); setDateMode("day");
    } else if (target === "week") { setSelectedDate(new Date()); setDateMode("week"); }
    else { setSelectedDate(new Date()); setDateMode("month"); }
  };

  const range = getSelectedRange();
  const rangeLabel = dateMode === "day" ?
    formatDate(range.start) :
    dateMode === "week" ?
      formatDateShort(range.start) + " - " + formatDateShort(range.end - 1) :
      formatDate(range.start) + " - " + formatDate(range.end - 1);

  const stapleCount: Record<string, number> = {};
  todayMeals.forEach((m) => { if (m.staple) stapleCount[m.staple] = (stapleCount[m.staple] || 0) + 1; });
  const pieData = Object.entries(stapleCount).map(([key, val]) => ({
    label: StapleLabels[key as Staple] || key,
    value: val,
    color: stapleColors[key] || "#9E9E9E",
  }));

  const handleMealPress = (meal: Meal) => {
    router.push({ pathname: "/meal-detail", params: { mealId: meal.id } });
  };

  const handleAction = (type: ActionType) => {
    router.push({ pathname: "/add", params: { mode: type === "symptom" ? "symptom" : "meal" } });
  };

  const isToday = formatDate(Date.now()) === formatDate(selectedDate.getTime());

  return (
    <View style={[s.flex1, { backgroundColor: homeTheme.bg }]}>
      <View style={[{
        backgroundColor: homeTheme.card,
        paddingTop: 56, paddingBottom: 8, borderBottomWidth: 1,
        borderBottomColor: homeTheme.border,
      }]}>
        <View style={[s.rowCenter, s.between, s.px4]}>
          <View>
            <Text style={[{ fontSize: 22, fontWeight: "700", color: homeTheme.text }]}>{t("home.title")}</Text>
            <Text style={[{ fontSize: 13, color: homeTheme.textSecondary, marginTop: 2 }]}>
              {todayMeals.length > 0 || recentSymptoms.length > 0
                ? t("home.mealsCount").replace("{count}", String(todayMeals.length)).replace("{symptomCount}", String(recentSymptoms.length))
                : ""}
            </Text>
          </View>
          <View style={[s.row, { gap: 6 }]}>
            {(["today", "yesterday", "week", "month"] as const).map((key) => (
              <TouchableOpacity key={key} onPress={() => quickJump(key)}
                style={[{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
                  backgroundColor: (key === "today" && isToday && dateMode === "day") || (key === "week" && dateMode === "week") || (key === "month" && dateMode === "month") || (key === "yesterday" && !isToday && dateMode === "day") ? tc[500] : homeTheme.border,
                }]}>
                <Text style={[{ fontSize: 12, fontWeight: "500", color: ((key === "today" && isToday && dateMode === "day") || (key === "week" && dateMode === "week") || (key === "month" && dateMode === "month") || (key === "yesterday" && !isToday && dateMode === "day")) ? "#fff" : homeTheme.textSecondary }]}>
                  {t("home." + key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[s.rowCenter, s.between, s.px4, { marginTop: 8, paddingVertical: 4 }]}>
          <TouchableOpacity onPress={() => changeDate(-1)}
            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: tc[500] + "1A", alignItems: "center", justifyContent: "center" }}>
            <Text style={[{ fontSize: 18, color: tc[500] }]}>{String.fromCodePoint(0x25C0)}</Text>
          </TouchableOpacity>
          <Text style={[{ fontSize: 14, fontWeight: "500", color: homeTheme.text }]}>{rangeLabel}</Text>
          <TouchableOpacity onPress={() => changeDate(1)}
            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: tc[500] + "1A", alignItems: "center", justifyContent: "center" }}>
            <Text style={[{ fontSize: 18, color: tc[500] }]}>{String.fromCodePoint(0x25B6)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
        {warnings.length > 0 && isToday && (
          <View style={[{
            marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 18,
            backgroundColor: colors.red[50], borderWidth: 1, borderColor: colors.red[100],
            borderLeftWidth: 4, borderLeftColor: colors.red[500],
          }]}>
            <Text style={[{ fontSize: 13, fontWeight: "600", color: colors.red[700], marginBottom: 6 }]}>
              {String.fromCodePoint(0x26A0)} {t("home.todayWarnings")}
            </Text>
            {warnings.map((w, i) => (
              <Text key={i} style={[{ fontSize: 13, color: colors.red[600], marginBottom: 2 }]}>
                {String.fromCodePoint(0x2022)} {w.food_name} ({SymptomTypeLabels[w.symptom_type as keyof typeof SymptomTypeLabels] || w.symptom_type}) - {w.discomfort_index.toFixed(1)}
              </Text>
            ))}
            <Text style={[{ fontSize: 11, color: colors.red[400], marginTop: 4 }]}>{t("home.warningSuggestion")}</Text>
          </View>
        )}

        {loading ? (
          <View style={[s.center, { marginHorizontal: 16, marginTop: 12, padding: 24, borderRadius: 18, backgroundColor: homeTheme.card, borderWidth: 1, borderColor: homeTheme.border }]}>
            <Text style={[{ fontSize: 14, color: homeTheme.textSecondary }]}>{t("home.loading")}</Text>
          </View>
        ) : todayMeals.length === 0 && recentSymptoms.length === 0 ? (
          <View style={[s.center, { marginHorizontal: 16, marginTop: 12, padding: 24, borderRadius: 18, backgroundColor: homeTheme.card, borderWidth: 1, borderColor: homeTheme.border }]}>
            <Text style={{ fontSize: 64, marginBottom: 12 }}>{String.fromCodePoint(0x1F37D)}</Text>
            <Text style={[{ fontSize: 15, color: homeTheme.textSecondary, marginBottom: 4 }]}>{t("home.noRecords")}</Text>
            <Text style={[{ fontSize: 13, color: homeTheme.textSecondary }]}>{t("home.startRecording")}</Text>
          </View>
        ) : (
          <>
            {pieData.length > 0 && (
              <View style={[{
                marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 14,
                backgroundColor: homeTheme.card, borderWidth: 1, borderColor: homeTheme.border,
              }]}>
                <Text style={[{ fontSize: 15, fontWeight: "600", color: homeTheme.text, marginBottom: 4 }]}>{t("home.stapleRatio")}</Text>
                <PieChart data={pieData} />
              </View>
            )}

            {todayMeals.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <View style={[s.rowCenter, { paddingHorizontal: 16, marginBottom: 8, marginTop: 4 }]}>
                    <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: tc[500], marginRight: 8 }} />
                    <Text style={[{ fontSize: 16, fontWeight: "600", color: homeTheme.text }]}>
                      {t("home.meals")} ({todayMeals.length})
                    </Text>
                  </View>
                {todayMeals.map((meal) => <MealCard key={meal.id} meal={meal} onPress={handleMealPress} />)}
              </View>
            )}

            {recentSymptoms.length > 0 && (
              <View style={{ marginTop: 4, marginBottom: 16 }}>
                <View style={[s.rowCenter, { paddingHorizontal: 16, marginBottom: 8 }]}>
                    <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: tc[500], marginRight: 8 }} />
                    <Text style={[{ fontSize: 16, fontWeight: "600", color: homeTheme.text }]}>
                      {t("home.symptoms")} ({recentSymptoms.length})
                    </Text>
                  </View>
                {recentSymptoms.map((sx) => (
                  <View key={sx.id} style={[{
                    marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 14,
                    backgroundColor: homeTheme.card, borderWidth: 1, borderColor: homeTheme.border,
                  }]}>
                    <View style={[s.rowCenter, s.between]}>
                      <View style={[s.rowCenter]}>
                        <View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red[500], marginRight: 8 }]} />
                        <Text style={[{ fontSize: 15, fontWeight: "500", color: homeTheme.text }]}>
                          {SymptomTypeLabels[sx.type as keyof typeof SymptomTypeLabels] || sx.type}
                        </Text>
                      </View>
                      <View style={[{
                        backgroundColor: colors.red[50], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
                      }]}>
                        <Text style={[{ fontSize: 12, fontWeight: "600", color: colors.red[600] }]}>
                          {t("home.severity").replace("{n}", String(sx.severity))}
                        </Text>
                      </View>
                    </View>
                    {sx.note && (
                      <Text style={[{ fontSize: 13, color: homeTheme.textSecondary, marginTop: 6, lineHeight: 18 }]}>{sx.note}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <QuickActionBar onAction={handleAction} />
    </View>
  );
}
