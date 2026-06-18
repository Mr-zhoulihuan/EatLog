import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { colors, s } from "../src/tw";

interface Version {
  version: string;
  date: string;
  title: string;
  details: string[];
}

const versions: Version[] = [
  {
    version: "v1.0.0",
    date: "2026-06-16",
    title: "EatLog MVP 框架搭建",
    details: [
      "Expo SDK 56 + expo-router 项目初始化",
      "4 个 Tab 页面：首页、新增记录、统计、个人中心",
      "SQLite 本地数据库（meal / symptom / custom_label / correlation_cache）",
      "Zustand 状态管理 + TanStack Query",
      "关联度算法（不适指数 = log(count+1) x 平均严重度 x 近期因子）",
      "结构化饮食记录表单（温度/口感/油腻度/烹饪方式/主食/饮品）",
      "数据导出、提醒设置、敏感食物预警列表",
      "支持多张图片上传（最多9张）",
      "版本历史记录页面",
    ],
  },
  {
    version: "初审版本",
    date: "2026-06-16",
    title: "提交文件 & 需求文档整理",
    details: [
      "项目初始化",
      "产品需求文档编写",
      "技术框架设计文档",
    ],
  },
];

export default function VersionPage() {
  const router = useRouter();

  return (
    <View style={[s.flex1, s.bgGray50]}>
      <View style={[s.bgWhite, { paddingTop: 56, paddingBottom: 16 }, s.px4, s.shadowSm, s.rowCenter]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
          <Text style={{ fontSize: 24, color: colors.gray[600] }}>{String.fromCodePoint(0x2190)}</Text>
        </TouchableOpacity>
        <Text style={[s.textXl, s.fontBold, s.textGray900]}>版本记录</Text>
      </View>

      <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <Text style={[s.text2xl, s.fontBold, s.textGray900]}>EatLog</Text>
          <Text style={[s.textSm, s.textGray400, s.mt1]}>结构化饮食记录与身体反应追踪</Text>
        </View>

        {versions.map((ver, vi) => (
          <TouchableOpacity key={vi} activeOpacity={0.8} style={[s.bgWhite, s.mx4, { marginBottom: 12, borderRadius: 12, padding: 16 }, s.shadowSm]}>
            <View style={[s.rowCenter, s.between]}>
              <View style={[s.rowCenter]}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: vi === 0 ? colors.primary[500] : colors.gray[300], alignItems: "center", justifyContent: "center" }}>
                  <Text style={[s.textSm, s.fontBold, { color: "#fff" }]}>{versions.length - vi}</Text>
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[s.textBase, s.fontSemibold, s.textGray900]}>{ver.version}</Text>
                  <Text style={[s.textXs, s.textGray400, { marginTop: 2 }]}>{ver.date}</Text>
                </View>
              </View>
            </View>

            <Text style={[s.textSm, s.textGray700, s.fontMedium, { marginTop: 12, marginBottom: 8 }]}>{ver.title}</Text>

            {ver.details.map((detail, di) => (
              <View key={di} style={[s.row, { marginBottom: 4 }]}>
                <Text style={[s.textSm, s.textGray400, { marginRight: 8 }]}>-</Text>
                <Text style={[s.textSm, s.textGray600, s.flex1]}>{detail}</Text>
              </View>
            ))}
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}