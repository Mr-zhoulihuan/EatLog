import { View, Text, Image, TouchableOpacity } from "react-native";
import type { Meal } from "../types";
import { formatTime } from "../utils/date";
import { TemperatureLabels, TasteLabels, OilinessLabels, StapleLabels, DrinkLabels, CookMethodLabels } from "../types";
import { colors, s, getThemeColors } from "../tw";
import { useSettingsStore } from "../stores/settingsStore";
import { useT } from "../i18n";

interface Props {
  meal: Meal;
  onPress?: (meal: Meal) => void;
}

const colorMap: Record<string, string> = {
  ice: "#93C5FD", normal: "#6B7280", warm: "#F97316", hot: "#EF4444",
  light: "#A5D6A7", medium: "#FBBF24", mild_spicy: "#F97316", spicy: "#EF4444", salty: "#8B5CF6", sweet: "#EC4899",
  no_oil: "#A5D6A7", oily: "#F97316", heavy_oil: "#EF4444",
};

export function MealCard({ meal, onPress }: Props) {
  const themeColor = useSettingsStore((s) => s.themeColor);
  const themeOpacity = useSettingsStore((s) => s.themeOpacity);
  const themeBg = useSettingsStore((s) => s.themeBackground);
  const tc = getThemeColors(themeColor);
  const { t } = useT();

  const tags: { label: string; color: string }[] = [];
  if (meal.temperature) tags.push({ label: TemperatureLabels[meal.temperature], color: colorMap[meal.temperature] || colors.gray[400] });
  if (meal.taste) tags.push({ label: TasteLabels[meal.taste], color: colorMap[meal.taste] || colors.gray[400] });
  if (meal.oiliness) tags.push({ label: OilinessLabels[meal.oiliness], color: colorMap[meal.oiliness] || colors.gray[400] });
  if (meal.staple) tags.push({ label: StapleLabels[meal.staple], color: colors.green[500] });
  if (meal.drink) tags.push({ label: DrinkLabels[meal.drink], color: colors.blue[400] });

  const photos = meal.photo_uris || [];

  const cardBg = themeBg === "dark" ? "#1F2937" : "#FFFFFF";
  const cardBorder = themeBg === "dark" ? "#374151" : colors.gray[100];
  const timeColor = themeBg === "dark" ? "#9CA3AF" : colors.gray[400];

  return (
    <TouchableOpacity
      onPress={() => onPress?.(meal)}
      activeOpacity={0.7}
      style={[{
        backgroundColor: cardBg,
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: cardBorder,
                borderTopWidth: 2,
                borderTopColor: tc[500],
        shadowColor: tc[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
        elevation: 4,
      }]}
    >
      <View style={[s.rowCenter, s.between]}>
        <View style={[s.rowCenter, s.flex1]}>
          <View style={[{ width: 5, height: 28, borderRadius: 3, backgroundColor: tc[500], marginRight: 12 }]} />
          <Text style={[{ fontSize: 17, fontWeight: "600", color: themeBg === "dark" ? "#F9FAFB" : "#111827" }]} numberOfLines={1}>{meal.food_name}</Text>
        </View>
        <Text style={[{ fontSize: 12, color: timeColor }]}>{formatTime(meal.created_at)}</Text>
      </View>

      <View style={{ height: 2, backgroundColor: tc[500], opacity: 0.25 }} />

      {tags.length > 0 && (
        <View style={[s.row, s.wrap, { marginTop: 12, gap: 8 }]}>
          {tags.map((tag, i) => (
            <View key={i} style={[{
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
              backgroundColor: tag.color + "20",
              borderWidth: 1, borderColor: tag.color + "40",
            }]}>
              <Text style={[{ fontSize: 12, fontWeight: "500", color: tag.color }]}>{tag.label}</Text>
            </View>
          ))}
        </View>
      )}

      {meal.cook_methods && meal.cook_methods.length > 0 && (
        <View style={[s.row, s.wrap, { gap: 4, marginTop: 8 }]}>
          {meal.cook_methods.map((cm, i) => (
            <Text key={i} style={[{ fontSize: 11, color: themeBg === "dark" ? "#9CA3AF" : "#9CA3AF" }]}>
              {i > 0 ? " " : ""}{CookMethodLabels[cm]}
            </Text>
          ))}
        </View>
      )}

      {meal.note && (
        <View style={[{
          marginTop: 10, paddingHorizontal: 12, paddingVertical: 8,
          backgroundColor: themeBg === "dark" ? "#374151" : colors.gray[50],
          borderRadius: 8,
        }]}>
          <Text style={[{ fontSize: 13, color: themeBg === "dark" ? "#D1D5DB" : "#6B7280", lineHeight: 18 }]}>{meal.note}</Text>
        </View>
      )}

      {photos.length > 0 && (
        <View style={[s.row, { gap: 8, marginTop: 12 }]}>
          {photos.slice(0, 4).map((uri, i) => (
            <Image key={i} source={{ uri }}
              style={{ width: (photos.length === 1 ? 160 : (photos.length === 2 ? 120 : 72)), height: 72, borderRadius: 12, backgroundColor: colors.gray[100] }}
              resizeMode="cover" />
          ))}
          {photos.length > 4 && (
            <View style={{ width: 72, height: 72, borderRadius: 12, backgroundColor: tc[50], alignItems: "center", justifyContent: "center" }}>
              <Text style={[{ fontSize: 16, fontWeight: "600", color: tc[600] }]}>+{photos.length - 4}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
