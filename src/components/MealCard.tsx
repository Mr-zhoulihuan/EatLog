import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import type { Meal } from "../types";
import { formatTime, formatDate } from "../utils/date";
import { TemperatureLabels, TasteLabels, OilinessLabels, CookMethodLabels, StapleLabels, DrinkLabels } from "../types";
import { colors, s, chip, chipText, pill } from "../tw";

interface Props {
  meal: Meal;
  onPress?: (meal: Meal) => void;
}

export function MealCard({ meal, onPress }: Props) {
  const tags: string[] = [];
  if (meal.temperature) tags.push(TemperatureLabels[meal.temperature]);
  if (meal.taste) tags.push(TasteLabels[meal.taste]);
  if (meal.oiliness) tags.push(OilinessLabels[meal.oiliness]);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(meal)}
      style={[s.bgWhite, s.roundedXl, s.p4, { marginBottom: 12 }, s.mx4, s.shadowSm, border(colors.gray[50])]}
    >
      <View style={s.row}>
        {meal.photo_uri && (
          <Image
            source={{ uri: meal.photo_uri }}
            style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12, backgroundColor: colors.gray[100] }}
          />
        )}
        <View style={s.flex1}>
          <View style={[s.rowCenter, s.between]}>
            <Text style={[s.textLg, s.fontSemibold, s.textGray900]}>{meal.food_name}</Text>
            <Text style={[s.textSm, s.textGray400]}>{formatTime(meal.created_at)}</Text>
          </View>

          <View style={[s.row, s.wrap, { marginTop: 8, gap: 6 }]}>
            {tags.map((tag, i) => (
              <View key={i} style={[pill(tags.length, i), { backgroundColor: colors.gray[100] }]}>
                <Text style={[s.textXs, s.textGray600]}>{tag}</Text>
              </View>
            ))}
            {meal.staple && (
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.green[50] }}>
                <Text style={[s.textXs, { color: colors.green[600] }]}>{StapleLabels[meal.staple]}</Text>
              </View>
            )}
          </View>

          {meal.drink && (
            <Text style={[s.textSm, s.textGray500, s.mt1]}>饮品: {DrinkLabels[meal.drink]}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
