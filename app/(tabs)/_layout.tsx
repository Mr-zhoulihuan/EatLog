import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { colors } from "../../src/tw";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = { index: "\u{1F4CB}", add: "\u{270F}\u{FE0F}", stats: "\u{1F4CA}", profile: "\u{1F464}" };
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[name] || "\u{1F4C4}"}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          paddingTop: 6,
          height: Platform.OS === "ios" ? 88 : 60,
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500", marginBottom: 4 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "首页", tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} /> }} />
      <Tabs.Screen name="add" options={{ title: "记录", tabBarIcon: ({ focused }) => <TabIcon name="add" focused={focused} /> }} />
      <Tabs.Screen name="stats" options={{ title: "统计", tabBarIcon: ({ focused }) => <TabIcon name="stats" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: "我的", tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} /> }} />
    </Tabs>
  );
}