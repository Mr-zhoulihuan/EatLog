import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSettingsStore } from "../../src/stores/settingsStore";
import type { ThemeColor } from "../../src/stores/settingsStore";
import { THEME_COLORS } from "../../src/stores/settingsStore";
import { getThemeColors } from "../../src/tw";
import * as ImagePicker from "expo-image-picker";
import { useT } from "../../src/i18n"
import { syncPending } from "../../src/services/syncService";
import { colors, s } from "../../src/tw";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useT();
  const { 
    reminderEnabled, reminderDelay, toggleReminder, setReminderDelay,
    themeColor, themeBackground, themeOpacity, locale, avatarUri,
    setThemeColor, setThemeBackground, setThemeOpacity,
    setLocale, setAvatarUri, resetSettings
  } = useSettingsStore();
  const tc = getThemeColors(themeColor);

  const section = (title: string, children: React.ReactNode) => (
    <View style={[{ backgroundColor: "#ffffff", marginHorizontal: 16, marginTop: 12, borderRadius: 18, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }]}>
      <Text style={[s.textBase, s.fontSemibold, s.textGray800, { marginBottom: 12 }]}>{title}</Text>
      {children}
    </View>
  );

  const themeColorOptions: { key: ThemeColor; label: string; color: string }[] = [
    { key: "green", label: t("profile.green"), color: "#4CAF50" },
    { key: "blue", label: t("profile.blue"), color: "#3B82F6" },
    { key: "orange", label: t("profile.orange"), color: "#F97316" },
    { key: "purple", label: t("profile.purple"), color: "#A855F7" },
    { key: "pink", label: t("profile.pink"), color: "#EC4899" },
  ];

  const langOptions: { key: Locale; label: string }[] = [
    { key: "zh", label: t("profile.chinese") },
    { key: "en", label: t("profile.english") },
  ];

  const bgOptions: { key: ThemeBackground; label: string }[] = [
    { key: "light", label: t("profile.light") },
    { key: "dark", label: t("profile.dark") },
  ];

  const handleExport = async () => {
    try {
      const { getAllMeals } = await import("../../src/services/mealService");
      const meals = await getAllMeals();
      Alert.alert(t("profile.exportData"), t("profile.exportHint") + "\n" + t("stats.times").replace("{n}", String(meals.length)));
    } catch (e) {
      Alert.alert(t("profile.exportFailed"), String(e));
    }
  };

  const handleSync = async () => {
    try { await syncPending(); Alert.alert(t("profile.syncComplete"), t("profile.syncCompleteText")); }
    catch (e) { Alert.alert(t("profile.syncFailed"), String(e)); }
  };

  const handleClearData = () => {
    Alert.alert(t("profile.clearConfirm"), t("profile.clearConfirmText"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.clearConfirm"), style: "destructive",
        onPress: async () => {
          const { getDb } = await import("../../src/db/database");
          const db = await getDb();
          await db.runAsync("DELETE FROM meal");
          await db.runAsync("DELETE FROM symptom");
          await db.runAsync("DELETE FROM correlation_cache");
          Alert.alert(t("profile.cleared"), t("profile.clearedText"));
        },
      },
    ]);
  };

  return (
    <View style={[s.flex1, s.bgGray50]}>
      <View style={[s.bgWhite, { paddingTop: 56, paddingBottom: 16 }, s.px4, s.shadowSm]}>
        <Text style={[s.text2xl, s.fontBold, s.textGray900]}>{t("profile.title")}</Text>
      </View>

      <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
        {section(t("profile.avatar"), (
          <View style={{ alignItems: "center", paddingVertical: 8 }}>
            <TouchableOpacity onPress={async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status === "granted") {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ["images"],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets[0]) {
                  setAvatarUri(result.assets[0].uri);
                }
              }
            }} style={{ alignItems: "center" }}>
              <View style={{
                width: 90, height: 90, borderRadius: 45,
                backgroundColor: avatarUri ? "transparent" : tc[100],
                alignItems: "center", justifyContent: "center",
                borderWidth: 4, borderColor: tc[500],
                shadowColor: tc[500], shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
                overflow: "hidden",
              }}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={{ width: 90, height: 90 }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 28, fontWeight: "700", color: tc[500] }}>
                    {String.fromCodePoint(0x1F464)}
                  </Text>
                )}
              </View>
              <Text style={[s.textSm, { color: tc[500], marginTop: 8, fontWeight: "500" }]}>{t("profile.avatarChange")}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {section(t("profile.theme"), (
          <>
            <Text style={[s.textSm, s.textGray500, { marginBottom: 6 }]}>{t("profile.themeColor")}</Text>
            <View style={[s.row, s.wrap, { gap: 10 }]}>
              {themeColorOptions.map((opt) => (
                <TouchableOpacity key={opt.key} onPress={() => setThemeColor(opt.key)}
                  style={[{
                    width: 50, height: 50, borderRadius: 25,
                    backgroundColor: opt.color,
                    alignItems: "center", justifyContent: "center",
                    borderWidth: themeColor === opt.key ? 3 : 0,
                    borderColor: "#fff",
                    shadowColor: opt.color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: themeColor === opt.key ? 0.4 : 0.1,
                    shadowRadius: 4,
                    elevation: themeColor === opt.key ? 4 : 1,
                  }]}>
                  {themeColor === opt.key && (
                    <Text style={{ fontSize: 22, color: "#fff", fontWeight: "700" }}>{String.fromCodePoint(0x2713)}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.textSm, s.textGray500, { marginTop: 12, marginBottom: 6 }]}>{t("profile.themeBackground")}</Text>
            <View style={[s.row, { gap: 8 }]}>
              {bgOptions.map((opt) => (
                <TouchableOpacity key={opt.key} onPress={() => setThemeBackground(opt.key)}
                  style={[{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
                    themeBackground === opt.key ? { backgroundColor: tc[500] } : { backgroundColor: colors.gray[100] }]}>
                  <Text style={[{ fontSize: 14, fontWeight: "500" },
                    themeBackground === opt.key ? { color: "#fff" } : { color: colors.gray[600] }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.textSm, s.textGray500, { marginTop: 12, marginBottom: 6 }]}>{t("profile.themeOpacity")}: {themeOpacity}%</Text>
            <View style={[s.row, { gap: 4 }]}>
              {[20, 40, 60, 80, 100].map((val) => (
                <TouchableOpacity key={val} onPress={() => setThemeOpacity(val)}
                  style={[{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
                    themeOpacity === val ? { backgroundColor: tc[500] } : { backgroundColor: colors.gray[100] }]}>
                  <Text style={[{ fontSize: 12, fontWeight: "500" },
                    themeOpacity === val ? { color: "#fff" } : { color: colors.gray[600] }]}>{val}%</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.textSm, s.textGray500, { marginTop: 12, marginBottom: 6 }]}>{t("profile.language")}</Text>
            <View style={[s.row, { gap: 8 }]}>
              {langOptions.map((opt) => (
                <TouchableOpacity key={opt.key} onPress={() => setLocale(opt.key)}
                  style={[{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
                    locale === opt.key ? { backgroundColor: tc[500] } : { backgroundColor: colors.gray[100] }]}>
                  <Text style={[{ fontSize: 14, fontWeight: "500" },
                    locale === opt.key ? { color: "#fff" } : { color: colors.gray[600] }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ))}

        {section(t("profile.reminder"), (
          <>
            <View style={[s.rowCenter, s.between, { paddingVertical: 8 }]}>
              <Text style={[s.textSm, s.textGray700]}>{t("profile.reminderLabel")}</Text>
              <Switch value={reminderEnabled} onValueChange={toggleReminder} trackColor={{ false: "#D1D5DB", true: "#A5D6A7" }} thumbColor={reminderEnabled ? "#4CAF50" : "#F9FAFB"} />
            </View>
            {reminderEnabled && (
              <View style={{ marginTop: 8 }}>
                <Text style={[s.textSm, s.textGray500, { marginBottom: 8 }]}>提醒时间：饭后 " + reminderDelay + " 小时</Text>
                <View style={[s.row, { gap: 8 }]}>
                  {[1, 2, 3, 4].map((h) => (
                    <TouchableOpacity key={h} onPress={() => setReminderDelay(h)} style={[{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" }, reminderDelay === h ? { backgroundColor: tc[500] } : { backgroundColor: colors.gray[100] }]}>
                      <Text style={[s.textSm, s.fontMedium, reminderDelay === h ? { color: "#fff" } : { color: colors.gray[600] }]}>{h}h</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        ))}

        {section(t("profile.dataManagement"), (
          <>
            <TouchableOpacity onPress={handleExport} style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray[100] }}>
              <Text style={[s.textSm, s.textGray700]}>{t("profile.exportData")}</Text>
              <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>{t("profile.exportHint")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSync} style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.gray[100] }}>
              <Text style={[s.textSm, s.textGray700]}>{t("profile.syncData")}</Text>
              <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>{t("profile.syncHint")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearData} style={{ paddingVertical: 14 }}>
              <Text style={[s.textSm, { color: colors.red[500] }]}>{t("profile.clearData")}</Text>
              <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>{t("profile.clearHint")}</Text>
            </TouchableOpacity>
          </>
        ))}

        {section(t("profile.about"), (
          <>
            <TouchableOpacity onPress={() => router.push("/version")} style={{ paddingVertical: 4 }}>
              <View style={[s.rowCenter, s.between]}>
                <View>
                  <Text style={[s.textSm, s.textGray700]}>EatLog v1.0.0</Text>
                  <Text style={[s.textSm, s.textGray400, { marginTop: 4 }]}>{t("profile.description")}</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.gray[400] }}>{String.fromCodePoint(0x276F)}</Text>
              </View>
              <Text style={[s.textXs, s.textPrimary500, { marginTop: 8 }]}>{t("profile.version")}</Text>
            </TouchableOpacity>
          </>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}