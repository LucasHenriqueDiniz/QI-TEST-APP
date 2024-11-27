import { useMemo } from "react";
import { calculateIQ, getIQClassification, getIQDescription } from "@/utils/iqCalculator";
import { Answer } from "@/types";

export function useIQCalculation(answers: Answer[], age: number) {
  const score = useMemo(() => calculateIQ(answers, age), [answers, age]);

  const classification = useMemo(() => getIQClassification(score), [score]);

  const description = useMemo(() => getIQDescription(score), [score]);

  return {
    score,
    classification,
    description,
  };
}
