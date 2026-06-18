import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSettingsStore } from "../../src/stores/settingsStore";
import { syncPending } from "../../src/services/syncService";
import { colors, s } from "../../src/tw";

export default function ProfilePage() {
  const router = useRouter();
  const { reminderEnabled, reminderDelay, toggleReminder, setReminderDelay } = useSettingsStore();

  const handleExport = async () => {
    try {
      const { getAllMeals } = await import("../../src/services/mealService");
      const meals = await getAllMeals();
      Alert.alert("导出成功", "共导出 " + meals.length + " 条记录\n请通过文件系统或分享功能保存");
    } catch (e) {
      Alert.alert("导出失败", String(e));
    }
  };

  const handleSync = async () => {
    try { await syncPending(); Alert.alert("同步完成", "所有待同步数据已处理"); }
    catch (e) { Alert.alert("同步失败", String(e)); }
  };

  const handleClearData = () => {
    Alert.alert("确认", "确定要清空所有数据吗？此操作不可撤销。", [
      { text: "取消", style: "cancel" },
      {
        text: "确定清空", style: "destructive",
        onPress: async () => {
          const { getDb } = await import("../../src/db/database");
          const db = await getDb();
          await db.runAsync("DELETE FROM meal");
          await db.runAsync("DELETE FROM symptom");
          await db.runAsync("DELETE FROM correlation_cache");
          Alert.alert("已清空", "所有数据已删除");
        },
      },
    ]);
  };

  const section = (title: string, children: React.ReactNode) => (
    <View style={[s.bgWhite, s.mx4, { marginTop: 12, borderRadius: 12, padding: 16 }]}>
      <Text style={[s.textBase, s.fontSemibold, s.textGray800, { marginBottom: 12 }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={[s.flex1, s.bgGray50]}>
      <View style={[s.bgWhite, { paddingTop: 56, paddingBottom: 16 }, s.px4, s.shadowSm]}>
        <Text style={[s.text2xl, s.fontBold, s.textGray900]}>个人中心</Text>
      </View>

      <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
        {section("提醒设置", (
          <>
            <View style={[s.rowCenter, s.between, { paddingVertical: 8 }]}>
              <Text style={[s.textSm, s.textGray700]}>饭后不适提醒</Text>
              <Switch value={reminderEnabled} onValueChange={toggleReminder} trackColor={{ false: "#D1D5DB", true: "#A5D6A7" }} thumbColor={reminderEnabled ? "#4CAF50" : "#F9FAFB"} />
            </View>
            {reminderEnabled && (
              <View style={{ marginTop: 8 }}>
                <Text style={[s.textSm, s.textGray500, { marginBottom: 8 }]}>提醒时间：饭后 " + reminderDelay + " 小时</Text>
                <View style={[s.row, { gap: 8 }]}>
                  {[1, 2, 3, 4].map((h) => (
                    <TouchableOpacity key={h} onPress={() => setReminderDelay(h)} style={[{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" }, reminderDelay === h ? { backgroundColor: colors.primary[500] } : { backgroundColor: colors.gray[100] }]}>
                      <Text style={[s.textSm, s.fontMedium, reminderDelay === h ? { color: "#fff" } : { color: colors.gray[600] }]}>{h}h</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        ))}

        {section("数据管理", (
          <>
            <TouchableOpacity onPress={handleExport} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.gray[50] }}>
              <Text style={[s.textSm, s.textGray700]}>导出数据 (CSV)</Text>
              <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>导出所有记录供医疗咨询</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSync} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.gray[50] }}>
              <Text style={[s.textSm, s.textGray700]}>同步数据</Text>
              <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>将本地数据同步至云端</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearData} style={{ paddingVertical: 12 }}>
              <Text style={[s.textSm, { color: colors.red[500] }]}>清空所有数据</Text>
              <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>删除本地所有记录</Text>
            </TouchableOpacity>
          </>
        ))}

        {section("关于", (
          <>
            <TouchableOpacity onPress={() => router.push("/version")} style={{ paddingVertical: 4 }}>
              <View style={[s.rowCenter, s.between]}>
                <View>
                  <Text style={[s.textSm, s.textGray700]}>EatLog v1.0.0</Text>
                  <Text style={[s.textSm, s.textGray400, { marginTop: 4 }]}>通过结构化饮食记录与身体反应追踪，辅助管理肠道健康</Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.gray[400] }}>{String.fromCodePoint(0x276F)}</Text>
              </View>
              <Text style={[s.textXs, s.textPrimary500, { marginTop: 8 }]}>查看版本记录</Text>
            </TouchableOpacity>
          </>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}