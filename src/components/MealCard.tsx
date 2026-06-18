import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import type { Meal } from "../types";
import { formatTime } from "../utils/date";
import { TemperatureLabels, TasteLabels, OilinessLabels, StapleLabels, DrinkLabels } from "../types";
import { colors, s, pill } from "../tw";

interface Props {
  meal: Meal;
  onPress?: (meal: Meal) => void;
}

function border(c: string) { return { borderWidth: 1, borderColor: c }; }

export function MealCard({ meal, onPress }: Props) {
  const tags: string[] = [];
  if (meal.temperature) tags.push(TemperatureLabels[meal.temperature]);
  if (meal.taste) tags.push(TasteLabels[meal.taste]);
  if (meal.oiliness) tags.push(OilinessLabels[meal.oiliness]);

  const photos = meal.photo_uris || [];

  return (
    <TouchableOpacity
      onPress={() => onPress?.(meal)}
      style={[s.bgWhite, s.roundedXl, s.p4, { marginBottom: 12 }, s.mx4, s.shadowSm, border(colors.gray[50])]}
    >
      <View style={s.row}>
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

          {/* Photo Grid */}
          {photos.length > 0 && (
            <View style={[s.row, s.wrap, { gap: 4, marginTop: 8 }]}>
              {photos.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={{ width: i === 0 && photos.length === 1 ? 200 : 80, height: i === 0 && photos.length === 1 ? 150 : 80, borderRadius: 8, backgroundColor: colors.gray[100] }}
                  resizeMode="cover"
                />
              ))}
              {photos.length > 4 && (
                <View style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: colors.gray[100], alignItems: "center", justifyContent: "center" }}>
                  <Text style={[s.textSm, s.fontMedium, s.textGray500]}>+{photos.length - 4}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
          {/* Photo Grid */}
          {photos.length > 0 && (
            <View style={[s.row, s.wrap, { gap: 4, marginTop: 8 }]}>
              {photos.slice(0, 4).map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: colors.gray[100] }}
                  resizeMode="cover"
                />
              ))}
              {photos.length > 4 && (
                <View style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: colors.gray[100], alignItems: "center", justifyContent: "center" }}>
                  <Text style={[s.textSm, s.fontMedium, s.textGray500]}>+{photos.length - 4}</Text>
                </View>
              )}
            </View>
          )}
