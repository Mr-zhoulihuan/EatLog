import { View, Text, ScrollView, Image, TouchableOpacity, Modal, Dimensions, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getMealById } from "../src/services/mealService";
import { useSettingsStore } from "../src/stores/settingsStore";
import { getThemeColors, getThemeBg, colors, s } from "../src/tw";
import { useT } from "../src/i18n";
import { formatTime, formatDate } from "../src/utils/date";
import type { Meal } from "../src/types";
import { TemperatureLabels, TasteLabels, OilinessLabels, CookMethodLabels, StapleLabels, DrinkLabels } from "../src/types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MOOD_EMOJIS: Record<number, string> = { 1: "\u{1F622}", 2: "\u{1F610}", 3: "\u{1F60A}", 4: "\u{1F604}", 5: "\u{1F929}" };
const MOOD_COLORS: Record<number, string> = { 1: "#EF4444", 2: "#F59E0B", 3: "#10B981", 4: "#3B82F6", 5: "#8B5CF6" };

const tagColorMap: Record<string, string> = {
  ice: "#93C5FD", normal: "#6B7280", warm: "#F97316", hot: "#EF4444",
  light: "#A5D6A7", medium: "#FBBF24", mild_spicy: "#F97316", spicy: "#EF4444", salty: "#8B5CF6", sweet: "#EC4899",
  no_oil: "#A5D6A7", oily: "#F97316", heavy_oil: "#EF4444",
};

export default function MealDetailPage() {
  const router = useRouter();
  const { mealId } = useLocalSearchParams<{ mealId?: string }>();
  const { t } = useT();
  const themeColor = useSettingsStore((s) => s.themeColor);
  const themeBackground = useSettingsStore((s) => s.themeBackground);
  const themeOpacity = useSettingsStore((s) => s.themeOpacity);
  const tc = getThemeColors(themeColor);
  const homeTheme = getThemeBg(themeBackground, themeOpacity);

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (mealId) {
      getMealById(mealId).then((m) => {
        setMeal(m);
        setLoading(false);
      });
    }
  }, [mealId]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: homeTheme.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={tc[500]} />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={{ flex: 1, backgroundColor: homeTheme.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: homeTheme.textSecondary, fontSize: 16 }}>{t("mealDetail.noData")}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, padding: 12, backgroundColor: tc[500], borderRadius: 8 }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>{t("common.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const photos = meal.photo_uris || [];
  const mood = meal.mood || 3;
  const calorieIntake = meal.calorie_intake;
  const calorieBurn = meal.calorie_burn;

  const tags: { label: string; color: string }[] = [];
  if (meal.temperature) tags.push({ label: TemperatureLabels[meal.temperature], color: tagColorMap[meal.temperature] || colors.gray[400] });
  if (meal.taste) tags.push({ label: TasteLabels[meal.taste], color: tagColorMap[meal.taste] || colors.gray[400] });
  if (meal.oiliness) tags.push({ label: OilinessLabels[meal.oiliness], color: tagColorMap[meal.oiliness] || colors.gray[400] });
  if (meal.staple) tags.push({ label: StapleLabels[meal.staple], color: colors.green[500] });
  if (meal.drink) tags.push({ label: DrinkLabels[meal.drink], color: colors.blue[400] });

  const cardStyle = {
    backgroundColor: homeTheme.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: homeTheme.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  };

  return (
    <View style={{ flex: 1, backgroundColor: homeTheme.bg }}>
      <View style={{ backgroundColor: homeTheme.card, paddingTop: 56, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: homeTheme.border }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: tc[500] + "1A", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 20, color: tc[500] }}>{String.fromCodePoint(0x2190)}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: homeTheme.text }} numberOfLines={1}>{meal.food_name}</Text>
            <Text style={{ fontSize: 13, color: homeTheme.textSecondary, marginTop: 2 }}>
              {formatDate(meal.created_at)} {formatTime(meal.created_at)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Mood & Calories Card */}
        <View style={[cardStyle, { marginTop: 12 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 13, color: homeTheme.textSecondary, marginBottom: 4 }}>{t("mealDetail.mood")}</Text>
              <Text style={{ fontSize: 52 }}>{MOOD_EMOJIS[mood] || MOOD_EMOJIS[3]}</Text>
              <View style={{ width: 80, height: 6, borderRadius: 3, backgroundColor: colors.gray[200], marginTop: 6, overflow: "hidden" }}>
                <View style={{ width: (mood / 5) * 100 + "%", height: 6, borderRadius: 3, backgroundColor: MOOD_COLORS[mood] || MOOD_COLORS[3] }} />
              </View>
            </View>
            <View style={{ width: 1, height: 90, backgroundColor: homeTheme.border, opacity: 0.5 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 13, color: homeTheme.textSecondary, marginBottom: 4 }}>{t("mealDetail.calories")}</Text>
              <View style={{ flexDirection: "row", gap: 20, marginTop: 4 }}>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 11, color: colors.red[500] }}>{t("mealDetail.calorieIntake")}</Text>
                  <Text style={{ fontSize: 22, fontWeight: "700", color: colors.red[500] }}>{calorieIntake ?? "--"}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 11, color: colors.green[500] }}>{t("mealDetail.calorieBurn")}</Text>
                  <Text style={{ fontSize: 22, fontWeight: "700", color: colors.green[500] }}>{calorieBurn ?? "--"}</Text>
                </View>
              </View>
              {(calorieIntake != null || calorieBurn != null) && (
                <View style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 11, color: homeTheme.textSecondary }}>
                    {t("mealDetail.netCalories")}: <Text style={{ fontWeight: "700", color: (calorieIntake ?? 0) - (calorieBurn ?? 0) > 0 ? colors.red[500] : colors.green[500] }}>
                      {(calorieIntake ?? 0) - (calorieBurn ?? 0)}
                    </Text> kcal
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Photos */}
        {photos.length > 0 && (
          <View style={cardStyle}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: homeTheme.text, marginBottom: 8 }}>{t("mealDetail.images")} ({photos.length})</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {photos.map((uri, i) => (
                <TouchableOpacity key={i} onPress={() => setFullscreenImage(uri)} activeOpacity={0.8}>
                  <Image source={{ uri }} style={{ width: (SCREEN_WIDTH - 60) / 3 - 4, height: (SCREEN_WIDTH - 60) / 3 - 4, borderRadius: 10, backgroundColor: colors.gray[100], shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <View style={cardStyle}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: homeTheme.text, marginBottom: 8 }}>{t("mealDetail.tags")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {tags.map((tag, i) => (
                <View key={i} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: tag.color + "20", borderWidth: 1, borderColor: tag.color + "40" }}>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: tag.color }}>{tag.label}</Text>
                </View>
              ))}
            </View>
            {meal.cook_methods && meal.cook_methods.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {meal.cook_methods.map((cm, i) => (
                  <Text key={i} style={{ fontSize: 12, color: homeTheme.textSecondary }}>{i > 0 ? " / " : ""}{CookMethodLabels[cm]}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Note */}
        {meal.note && (
          <View style={cardStyle}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: homeTheme.text, marginBottom: 6 }}>{t("mealDetail.note")}</Text>
            <Text style={{ fontSize: 14, color: homeTheme.textSecondary, lineHeight: 22 }}>{meal.note}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal visible={!!fullscreenImage} transparent animationType="fade" onRequestClose={() => setFullscreenImage(null)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setFullscreenImage(null)} style={{ position: "absolute", top: 60, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 22, color: "#fff" }}>{String.fromCodePoint(0x2716)}</Text>
          </TouchableOpacity>
          {fullscreenImage && (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
              maximumZoomScale={3}
              minimumZoomScale={1}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bouncesZoom
            >
              <Image
                source={{ uri: fullscreenImage }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
                resizeMode="contain"
              />
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}
