import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useT } from "../../src/i18n";
import { useMeals } from "../../src/hooks/useMeals";
import { useSymptoms } from "../../src/hooks/useSymptoms";
import { generateId } from "../../src/types";
import { TemperatureLabels, TasteLabels, OilinessLabels, CookMethodLabels, StapleLabels, DrinkLabels, SymptomTypeLabels } from "../../src/types";
import type { Temperature, Taste, Oiliness, CookMethod, Staple, Drink, SymptomType, Meal, Symptom } from "../../src/types";
import { colors, s, getThemeColors } from "../../src/tw";
import { useSettingsStore } from "../../src/stores/settingsStore";

type Mode = "meal" | "symptom";

const btnActive = (activeColor: string) => ({ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5, borderColor: activeColor, backgroundColor: activeColor });
const btnInactive = { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5, borderColor: colors.gray[200], backgroundColor: "transparent" };
const btnActiveText = { fontSize: 14, color: "#ffffff" };
const btnInactiveText = { fontSize: 14, color: colors.gray[600] };

export default function AddPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode = (params.mode as Mode) || "meal";
  const { addMeal } = useMeals();
  const { addSymptom } = useSymptoms();
  const { t } = useT();
  const themeColor = useSettingsStore((s) => s.themeColor);
  const tc = getThemeColors(themeColor);

  const [foodName, setFoodName] = useState("");
  const [temperature, setTemperature] = useState<Temperature | "">("");
  const [taste, setTaste] = useState<Taste | "">("");
  const [oiliness, setOiliness] = useState<Oiliness | "">("");
  const [cookMethods, setCookMethods] = useState<CookMethod[]>([]);
  const [staple, setStaple] = useState<Staple | "">("");
  const [drink, setDrink] = useState<Drink | "">("");
  const [note, setNote] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [mood, setMood] = useState(3);
  const [calorieIntake, setCalorieIntake] = useState("");
  const [calorieBurn, setCalorieBurn] = useState("");

  const [symptomType, setSymptomType] = useState<SymptomType | "">("");
  const [severity, setSeverity] = useState(3);
  const [symptomNote, setSymptomNote] = useState("");
  const sa = {
    setFoodName, setTemperature, setTaste, setOiliness, setCookMethods,
    setStaple, setDrink, setNote, setPhotoUris, setSymptomType, setSeverity, setSymptomNote
  };
  const clearForm = () => {
    setFoodName(""); setTemperature("" as any); setTaste("" as any); setOiliness("" as any);
    setCookMethods([]); setStaple("" as any); setDrink("" as any); setNote(""); setPhotoUris([]); setMood(3); setCalorieIntake(""); setCalorieBurn("");
    setSymptomType("" as any); setSeverity(3); setSymptomNote("");
  };

  const toggleCookMethod = (method: CookMethod) => {
    setCookMethods((prev) => prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]);
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限不足", "需要相册权限才能选择图片");
      return;
    }
    const remaining = 9 - photoUris.length;
    if (remaining <= 0) { Alert.alert("已达上限", "最多选择 9 张图片"); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setPhotoUris((prev) => [...prev, ...uris].slice(0, 9));
    }
  };

  const removeImage = (index: number) => {
    setPhotoUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (mode === "meal") {
      if (!foodName.trim()) { Alert.alert("提示", "请输入食物名称"); return; }
      const now = Date.now();
      await addMeal({
        id: generateId(),
        food_name: foodName.trim(),
        photo_uris: photoUris.length > 0 ? photoUris : undefined,
        temperature: temperature || undefined,
        taste: taste || undefined,
        oiliness: oiliness || undefined,
        cook_methods: cookMethods.length > 0 ? cookMethods : undefined,
        staple: (staple as Staple) || undefined,
        drink: (drink as Drink) || undefined,
        note: note || undefined,
        mood: mood,
        calorie_intake: calorieIntake ? parseFloat(calorieIntake) : undefined,
        calorie_burn: calorieBurn ? parseFloat(calorieBurn) : undefined,
        created_at: now,
        updated_at: now,
        synced: 0,
      });
      Alert.alert(t("add.success"), t("add.mealSaved"), [
        { text: t("add.clear"), onPress: () => clearForm() },
        { text: t("common.back"), onPress: () => router.back(), style: "default" },
      ]);
    } else {
      if (!symptomType) { Alert.alert("提示", "请选择症状类型"); return; }
      await addSymptom({
        id: generateId(), start_time: Date.now(), type: symptomType as SymptomType, severity,
        note: symptomNote || undefined, created_at: Date.now(), synced: 0,
      });
      Alert.alert(t("add.success"), t("add.symptomSaved"), [
        { text: t("add.clear"), onPress: () => clearForm() },
        { text: t("common.back"), onPress: () => router.back(), style: "default" },
      ]);
    }
  };

  const options = (items: { key: string; label: string }[], selected: string, onSelect: (k: string) => void, color = tc[500]) => (
    <View style={[s.row, s.wrap, { gap: 8 }]}>
      {items.map((item) => (
        <TouchableOpacity key={item.key} onPress={() => onSelect(selected === item.key ? "" : item.key)} style={selected === item.key ? btnActive(color) : btnInactive}>
          <Text style={selected === item.key ? btnActiveText : btnInactiveText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const section = (title: string, children: React.ReactNode) => (
    <View style={[{ backgroundColor: "#ffffff", marginHorizontal: 16, marginTop: 12, borderRadius: 18, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }]}>
      <Text style={[s.textSm, s.fontSemibold, s.textGray700, { marginBottom: 8 }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={[s.flex1, s.bgGray50]}>
      <View style={[s.bgWhite, { paddingTop: 56, paddingBottom: 16 }, s.px4, s.shadowSm, s.rowCenter]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 24, color: colors.gray[600] }}>{String.fromCodePoint(0x2190)}</Text>
        </TouchableOpacity>
        <Text style={[s.textXl, s.fontBold, s.textGray900]}>{mode === "meal" ? "新增用餐记录" : "记录身体反应"}</Text>
      </View>

      <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
        {mode === "meal" ? (
          <>
            {section("食物名称", (
              <TextInput style={{ backgroundColor: colors.gray[50], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.gray[900], borderWidth: 1, borderColor: colors.gray[100] }} placeholder="请输入食物名称" placeholderTextColor="#9CA3AF" value={foodName} onChangeText={setFoodName} />
            ))}

            {/* Photo Section */}
            {section("图片（可选，最多9张）", (
              <>
                <View style={[s.row, s.wrap, { gap: 8 }]}>
                  {photoUris.map((uri, i) => (
                    <View key={i} style={{ position: "relative" }}>
                      <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 8, backgroundColor: colors.gray[200] }} resizeMode="cover" />
                      <TouchableOpacity
                        onPress={() => removeImage(i)}
                        style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.red[500], alignItems: "center", justifyContent: "center" }}
                      >
                        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {photoUris.length < 9 && (
                    <TouchableOpacity
                      onPress={pickImages}
                      style={{ width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: colors.gray[200], borderStyle: "dashed", alignItems: "center", justifyContent: "center", backgroundColor: colors.gray[50] }}
                    >
                      <Text style={{ fontSize: 24, color: colors.gray[400] }}>+</Text>
                      <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>添加</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {photoUris.length > 0 && (
                  <Text style={[s.textXs, s.textGray400, { marginTop: 6 }]}>{photoUris.length}/9 张</Text>
                )}
              </>
            ))}

            {section("温度", options(
              ["ice", "normal", "warm", "hot"].map((k) => ({ key: k, label: TemperatureLabels[k as Temperature] })), temperature, (k) => setTemperature(k as Temperature)
            ))}
            {section("口感", options(
              ["light", "medium", "mild_spicy", "spicy", "salty", "sweet"].map((k) => ({ key: k, label: TasteLabels[k as Taste] })), taste, (k) => setTaste(k as Taste)
            ))}
            {section("油腻度", options(
              ["no_oil", "light", "medium", "oily", "heavy_oil"].map((k) => ({ key: k, label: OilinessLabels[k as Oiliness] })), oiliness, (k) => setOiliness(k as Oiliness)
            ))}
            {section("烹饪方式（可多选）", (
              <View style={[s.row, s.wrap, { gap: 8 }]}>
                {(["steam", "boil", "stir_fry", "roast", "deep_fry", "pan_fry", "raw", "stew"] as CookMethod[]).map((c) => (
                  <TouchableOpacity key={c} onPress={() => toggleCookMethod(c)} style={cookMethods.includes(c) ? btnActive(tc[500]) : btnInactive}>
                    <Text style={cookMethods.includes(c) ? btnActiveText : btnInactiveText}>{CookMethodLabels[c]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            {section("主食类型", options(
              ["rice", "noodles", "mantou", "bread", "meat", "seafood", "other"].map((k) => ({ key: k, label: StapleLabels[k as Staple] })), staple, (k) => setStaple(k as Staple)
            ))}
            {section("饮品", options(
              ["milk_tea", "milk", "coffee", "tea", "ice_water", "water"].map((k) => ({ key: k, label: DrinkLabels[k as Drink] })), drink, (k) => setDrink(k as Drink)
            ))}
            {section(t("add.mood"), (
              <View style={[s.row, { justifyContent: "center", gap: 10 }]}>
                {[1,2,3,4,5].map((v) => (
                  <TouchableOpacity key={v} onPress={() => setMood(v)}
                    style={[{
                      width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center",
                      backgroundColor: mood === v ? tc[100] : colors.gray[50],
                      borderWidth: 3,
                      borderColor: mood === v ? tc[500] : "transparent",
                      transform: mood === v ? [{ scale: 1.08 }] : [{ scale: 1 }],
                    }]}>
                    <Text style={{ fontSize: 28 }}>{[String.fromCodePoint(0x1F622), String.fromCodePoint(0x1F610), String.fromCodePoint(0x1F60A), String.fromCodePoint(0x1F604), String.fromCodePoint(0x1F929)][v-1]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {section(t("add.calorieIntake"), (
              <TextInput
                style={{ backgroundColor: colors.gray[50], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.gray[900], borderWidth: 1, borderColor: colors.gray[100] }}
                placeholder={t("add.caloriePlaceholder")}
                placeholderTextColor="#9CA3AF"
                value={calorieIntake}
                onChangeText={setCalorieIntake}
                keyboardType="numeric"
              />
            ))}

            {section(t("add.calorieBurn"), (
              <TextInput
                style={{ backgroundColor: colors.gray[50], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.gray[900], borderWidth: 1, borderColor: colors.gray[100] }}
                placeholder={t("add.caloriePlaceholder")}
                placeholderTextColor="#9CA3AF"
                value={calorieBurn}
                onChangeText={setCalorieBurn}
                keyboardType="numeric"
              />
            ))}

            {section(t("add.note"), (
              <TextInput style={{ backgroundColor: colors.gray[50], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.gray[900], minHeight: 60, textAlignVertical: "top", borderWidth: 1, borderColor: colors.gray[100] }} placeholder="今天的状态、吃了药等" placeholderTextColor="#9CA3AF" value={note} onChangeText={setNote} multiline />
            ))}
          </>
        ) : (
          <>
            {section("症状类型", options(
              ["diarrhea", "bloating", "colic", "acid_reflux"].map((k) => ({ key: k, label: SymptomTypeLabels[k as SymptomType] })), symptomType, (k) => setSymptomType(k as SymptomType), colors.red[500]
            ))}
            {section("严重程度: " + severity + "/5", (
              <View style={[s.row, { gap: 8 }]}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setSeverity(n)} style={[{ flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" }, severity === n ? { backgroundColor: colors.red[500] } : { backgroundColor: colors.gray[100] }]}>
                    <Text style={[{ fontWeight: "700" }, severity === n ? { color: "#fff" } : { color: colors.gray[500] }]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            {section("备注", (
              <TextInput style={{ backgroundColor: colors.gray[50], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.gray[900], minHeight: 60, textAlignVertical: "top", borderWidth: 1, borderColor: colors.gray[100] }} placeholder="补充描述..." placeholderTextColor="#9CA3AF" value={symptomNote} onChangeText={setSymptomNote} multiline />
            ))}
          </>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[{ marginHorizontal: 16, marginTop: 24, paddingVertical: 14, borderRadius: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4, alignItems: "center" }, mode === "meal" ? { backgroundColor: tc[500] } : { backgroundColor: colors.red[500] }]}
        >
          <Text style={[{ color: "#fff", fontSize: 16, fontWeight: "600" }]}>{mode === "meal" ? "保存用餐记录" : "保存症状记录"}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}