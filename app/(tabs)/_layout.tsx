import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { colors } from "../../src/tw";
import { useT } from "../../src/i18n";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = { 
    index: "\u{1F4CB}", add: "\u{270F}\u{FE0F}", 
    stats: "\u{1F4CA}", profile: "\u{1F464}" 
  };
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[name] || "\u{1F4C4}"}</Text>
    </View>
  );
}

function TabLabel({ name, focused }: { name: string; focused: boolean }) {
  const { t } = useT();
  const labels: Record<string, string> = { 
    index: t("tabs.home"), add: t("tabs.add"), 
    stats: t("tabs.stats"), profile: t("tabs.profile") 
  };
  return (
    <Text style={{ fontSize: 11, fontWeight: "500", color: focused ? "#4CAF50" : "#9CA3AF", marginBottom: 4 }}>
      {labels[name] || name}
    </Text>
  );
}

export default function TabLayout() {
  const { t } = useT();

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
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "", 
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel name="index" focused={focused} />, 
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon name="index" focused={focused} /> 
        }} 
      />
      <Tabs.Screen 
        name="add" 
        options={{ 
          title: "", 
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel name="add" focused={focused} />, 
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon name="add" focused={focused} /> 
        }} 
      />
      <Tabs.Screen 
        name="stats" 
        options={{ 
          title: "", 
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel name="stats" focused={focused} />, 
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon name="stats" focused={focused} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "", 
          tabBarLabel: ({ focused }: { focused: boolean }) => <TabLabel name="profile" focused={focused} />, 
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon name="profile" focused={focused} /> 
        }} 
      />
    </Tabs>
  );
}
