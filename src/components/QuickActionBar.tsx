import { View, Text, TouchableOpacity } from "react-native";
import { colors, s, getThemeColors } from "../tw";
import { useSettingsStore } from "../stores/settingsStore";
import { useT } from "../i18n";

type ActionType = "meal" | "drink" | "snack" | "symptom";

interface Action {
  type: ActionType;
  label: string;
  icon: string;
  bgColor: string;
}

const actions: Action[] = [
  { type: "meal", label: "正餐", icon: "\u{1F35A}", bgColor: "#4CAF50" },
  { type: "drink", label: "饮品", icon: "\u{1F964}", bgColor: "#60a5fa" },
  { type: "snack", label: "零食", icon: "\u{1F36A}", bgColor: "#fbbf24" },
  { type: "symptom", label: "症状", icon: "\u{1F623}", bgColor: "#f87171" },
];

interface Props {
  onAction: (type: ActionType) => void;
}

export function QuickActionBar({ onAction }: Props) {
  const { t } = useT();
  const themeColor = useSettingsStore((s) => s.themeColor);
  const themeBg = useSettingsStore((s) => s.themeBackground);
  const tc = getThemeColors(themeColor);
  const cardBorder = themeBg == 'dark' ? '#374151' : colors.gray[100];
  
  const getLabel = (type: ActionType): string => {
    const key = "home.quick" + type.charAt(0).toUpperCase() + type.slice(1);
    return t(key);
  };
  
  return (
    <View style={[s.row, { justifyContent: "space-around", paddingVertical: 20, paddingHorizontal: 24 }, s.bgWhite, { borderTopWidth: 2, borderTopColor: tc[500] + "30" }]}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.type}
          onPress={() => onAction(action.type)}
          activeOpacity={0.7}
          style={{ alignItems: "center" }}
        >
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: action.bgColor, shadowColor: action.bgColor, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }}>
            <Text style={{ fontSize: 22 }}>{action.icon}</Text>
          </View>
          <Text style={[s.textXs, s.textGray600, { marginTop: 6, fontWeight: "600" }]}>{getLabel(action.type)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export type { ActionType };
