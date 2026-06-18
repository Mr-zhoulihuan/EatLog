export interface Meal {
  id: string;
  food_name: string;
  photo_uris?: string[];
  temperature?: Temperature;
  taste?: Taste;
  oiliness?: Oiliness;
  cook_methods?: CookMethod[];
  staple?: Staple;
  drink?: Drink;
  drink_custom?: string;
  note?: string;
  mood?: number;
  calorie_intake?: number;
  calorie_burn?: number;
  created_at: number;
  updated_at: number;
  synced: number;
}

export interface Symptom {
  id: string;
  meal_id?: string;
  start_time: number;
  end_time?: number;
  type: SymptomType;
  severity: number;
  note?: string;
  created_at: number;
  synced: number;
}

export interface CustomLabel {
  id: string;
  category: "cook_method" | "taste" | "symptom_type";
  value: string;
  color?: string;
}

export type Temperature = "ice" | "normal" | "warm" | "hot";
export type Taste = "light" | "medium" | "mild_spicy" | "spicy" | "salty" | "sweet";
export type Oiliness = "no_oil" | "light" | "medium" | "oily" | "heavy_oil";
export type CookMethod = "steam" | "boil" | "stir_fry" | "roast" | "deep_fry" | "pan_fry" | "raw" | "stew";
export type Staple = "rice" | "noodles" | "mantou" | "bread" | "meat" | "seafood" | "other";
export type Drink = "milk_tea" | "milk" | "coffee" | "tea" | "ice_water" | "water";
export type SymptomType = "diarrhea" | "bloating" | "colic" | "acid_reflux";

// Labels for display
export const TemperatureLabels: Record<Temperature, string> = {
  ice: "冰镇", normal: "常温", warm: "温热", hot: "烫",
};

export const TasteLabels: Record<Taste, string> = {
  light: "清淡", medium: "适中", mild_spicy: "微辣", spicy: "辛辣", salty: "咸", sweet: "甜",
};

export const OilinessLabels: Record<Oiliness, string> = {
  no_oil: "无油", light: "清淡", medium: "适中", oily: "油腻", heavy_oil: "重油",
};

export const CookMethodLabels: Record<CookMethod, string> = {
  steam: "蒸", boil: "煮", stir_fry: "炒", roast: "烤", deep_fry: "炸", pan_fry: "煎", raw: "生食", stew: "炖",
};

export const StapleLabels: Record<Staple, string> = {
  rice: "米饭", noodles: "面条", mantou: "馒头", bread: "面包", meat: "肉类", seafood: "海鲜", other: "其他",
};

export const DrinkLabels: Record<Drink, string> = {
  milk_tea: "奶茶", milk: "牛奶", coffee: "咖啡", tea: "茶", ice_water: "冰水", water: "白水",
};

export const SymptomTypeLabels: Record<SymptomType, string> = {
  diarrhea: "腹泻", bloating: "胀气", colic: "绞痛", acid_reflux: "反酸",
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
