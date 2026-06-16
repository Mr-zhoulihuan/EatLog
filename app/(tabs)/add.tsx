import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMeals } from "../../src/hooks/useMeals";
import { useSymptoms } from "../../src/hooks/useSymptoms";
import { generateId } from "../../src/types";
import { TemperatureLabels, TasteLabels, OilinessLabels, CookMethodLabels, StapleLabels, DrinkLabels, SymptomTypeLabels } from "../../src/types";
import type { Temperature, Taste, Oiliness, CookMethod, Staple, Drink, SymptomType, Meal, Symptom } from "../../src/types";
import { colors, s } from "../../src/tw";

type Mode = "meal" | "symptom";

const btnActive = (activeColor: string) => ({ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: activeColor, backgroundColor: activeColor });
const btnInactive = { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.gray[200], backgroundColor: "transparent" };
const btnActiveText = { fontSize: 14, color: "#ffffff" };
const btnInactiveText = { fontSize: 14, color: colors.gray[600] };

export default function AddPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode = (params.mode as Mode) || "meal";
  const { addMeal } = useMeals();
  const { addSymptom } = useSymptoms();

  const [foodName, setFoodName] = useState("");
  const [temperature, setTemperature] = useState<Temperature | "">("");
  const [taste, setTaste] = useState<Taste | "">("");
  const [oiliness, setOiliness] = useState<Oiliness | "">("");
  const [cookMethods, setCookMethods] = useState<CookMethod[]>([]);
  const [staple, setStaple] = useState<Staple | "">("");
  const [drink, setDrink] = useState<Drink | "">("");
  const [note, setNote] = useState("");

  const [symptomType, setSymptomType] = useState<SymptomType | "">("");
  const [severity, setSeverity] = useState(3);
  const [symptomNote, setSymptomNote] = useState("");

  const toggleCookMethod = (method: CookMethod) => {
    setCookMethods((prev) => prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]);
  };

  const handleSubmit = async () => {
    if (mode === "meal") {
      if (!foodName.trim()) { Alert.alert("提示", "请输入食物名称"); return; }
      const now = Date.now();
      await addMeal({
        id: generateId(), food_name: foodName.trim(), temperature: temperature || undefined, taste: taste || undefined,
        oiliness: oiliness || undefined, cook_methods: cookMethods.length > 0 ? cookMethods : undefined,
        staple: (staple as Staple) || undefined, drink: (drink as Drink) || undefined, note: note || undefined,
        created_at: now, updated_at: now, synced: 0,
      });
      Alert.alert("成功", "用餐记录已保存");
      router.back();
    } else {
      if (!symptomType) { Alert.alert("提示", "请选择症状类型"); return; }
      await addSymptom({
        id: generateId(), start_time: Date.now(), type: symptomType as SymptomType, severity, note: symptomNote || undefined, created_at: Date.now(), synced: 0,
      });
      Alert.alert("成功", "症状记录已保存");
      router.back();
    }
  };

  const options = (items: { key: string; label: string }[], selected: string, onSelect: (k: string) => void, color = colors.primary[500]) => (
    <View style={[s.row, s.wrap, { gap: 8 }]}>
      {items.map((item) => (
        <TouchableOpacity key={item.key} onPress={() => onSelect(selected === item.key ? "" : item.key)} style={selected === item.key ? btnActive(color) : btnInactive}>
          <Text style={selected === item.key ? btnActiveText : btnInactiveText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const section = (title: string, children: React.ReactNode) => (
    <View style={[s.bgWhite, s.mx4, { marginTop: 12, borderRadius: 12, padding: 16 }]}>
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
              <TextInput style={{ backgroundColor: colors.gray[50], borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.gray[900] }} placeholder="请输入食物名称" placeholderTextColor="#9CA3AF" value={foodName} onChangeText={setFoodName} />
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
                  <TouchableOpacity key={c} onPress={() => toggleCookMethod(c)} style={cookMethods.includes(c) ? btnActive(colors.primary[500]) : btnInactive}>
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
            {section("备注", (
              <TextInput style={{ backgroundColor: colors.gray[50], borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.gray[900], minHeight: 60, textAlignVertical: "top" }} placeholder="今天的状态、吃了药等" placeholderTextColor="#9CA3AF" value={note} onChangeText={setNote} multiline />
            ))}
          </>
        ) : (
          <>
            {section("症状类型", options(
              ["diarrhea", "bloating", "colic", "acid_reflux"].map((k) => ({ key: k, label: SymptomTypeLabels[k as SymptomType] })), symptomType, (k) => setSymptomType(k as SymptomType), colors.red[500]
            ))}
            {section(`严重程度: ${severity}/5`, (
              <View style={[s.row, { gap: 8 }]}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setSeverity(n)} style={[{ flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" }, severity === n ? { backgroundColor: colors.red[500] } : { backgroundColor: colors.gray[100] }]}>
                    <Text style={[{ fontWeight: "700" }, severity === n ? { color: "#fff" } : { color: colors.gray[500] }]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            {section("备注", (
              <TextInput style={{ backgroundColor: colors.gray[50], borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.gray[900], minHeight: 60, textAlignVertical: "top" }} placeholder="补充描述..." placeholderTextColor="#9CA3AF" value={symptomNote} onChangeText={setSymptomNote} multiline />
            ))}
          </>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[{ marginHorizontal: 16, marginTop: 24, paddingVertical: 14, borderRadius: 12, alignItems: "center" }, mode === "meal" ? { backgroundColor: colors.primary[500] } : { backgroundColor: colors.red[500] }]}
        >
          <Text style={[{ color: "#fff", fontSize: 16, fontWeight: "600" }]}>{mode === "meal" ? "保存用餐记录" : "保存症状记录"}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}