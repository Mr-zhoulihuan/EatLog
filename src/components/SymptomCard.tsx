import { View, Text, StyleSheet } from "react-native";
import type { Symptom } from "../types";
import { SymptomTypeLabels } from "../types";
import { formatTime } from "../utils/date";
import { colors, s } from "../tw";

interface Props {
  symptom: Symptom;
}

const severityBg = ["#dcfce7", "#ecfccb", "#fef9c3", "#ffedd5", "#fee2e2"];
const severityTxt = ["#15803d", "#65a30d", "#a16207", "#c2410c", "#b91c1c"];
const typeBg: Record<string, string> = {
  diarrhea: "#fffbeb", bloating: "#faf5ff", colic: "#fef2f2", acid_reflux: "#fff7ed",
};
const typeBorder: Record<string, string> = {
  diarrhea: "#fde68a", bloating: "#e9d5ff", colic: "#fecaca", acid_reflux: "#fed7aa",
};

export function SymptomCard({ symptom }: Props) {
  return (
    <View style={[s.roundedXl, { padding: 12, marginBottom: 8 }, s.mx4, { borderWidth: 1, backgroundColor: typeBg[symptom.type] || colors.gray[50], borderColor: typeBorder[symptom.type] || colors.gray[200] }]}>
      <View style={[s.rowCenter, s.between]}>
        <Text style={[s.textBase, s.fontMedium, s.textGray900]}>
          {SymptomTypeLabels[symptom.type]}
        </Text>
        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: severityBg[Math.min(symptom.severity - 1, 4)] }}>
          <Text style={[s.textXs, s.fontMedium, { color: severityTxt[Math.min(symptom.severity - 1, 4)] }]}>{symptom.severity}/5</Text>
        </View>
      </View>
      <View style={[s.rowCenter, s.mt1]}>
        <Text style={[s.textXs, s.textGray400]}>{formatTime(symptom.start_time)}</Text>
        {symptom.end_time && (
          <Text style={[s.textXs, s.textGray400, { marginLeft: 8 }]}>→ {formatTime(symptom.end_time)}</Text>
        )}
      </View>
      {symptom.note && (
        <Text style={[s.textSm, s.textGray500, s.mt1]}>{symptom.note}</Text>
      )}
    </View>
  );
}
