import { View, Text, TouchableOpacity } from "react-native";
import { colors, s } from "../tw";

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
  return (
    <View style={[s.row, { justifyContent: "space-around", paddingVertical: 16, paddingHorizontal: 16 }, s.bgWhite, { borderTopWidth: 1, borderTopColor: colors.gray[100] }]}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.type}
          onPress={() => onAction(action.type)}
          style={{ alignItems: "center" }}
        >
          <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: action.bgColor, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
            <Text style={{ fontSize: 20 }}>{action.icon}</Text>
          </View>
          <Text style={[s.textXs, s.textGray600, { marginTop: 4 }]}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export type { ActionType };
