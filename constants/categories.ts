import { Ionicons } from "@expo/vector-icons";
import { QuestionCategory } from "@/types";

/** Ícone de cada área avaliada — o mesmo na home, no perfil do resultado e onde mais ela aparecer. */
export const CATEGORY_ICONS: Record<QuestionCategory, keyof typeof Ionicons.glyphMap> = {
  patterns: "grid-outline",
  matrix: "calculator-outline",
  similarities: "git-compare-outline",
  vocabulary: "book-outline",
  comprehension: "bulb-outline",
};

/** Ordem em que as áreas aparecem quando nada as ordena (a home, por exemplo). */
export const CATEGORY_ORDER: QuestionCategory[] = ["patterns", "matrix", "similarities", "vocabulary", "comprehension"];
