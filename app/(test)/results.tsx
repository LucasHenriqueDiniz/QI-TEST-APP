import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { useIQCalculation } from "@/hooks/useIQCalculation";
import { CommonActions } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";

// IQ distribution data (approximate)
const iqDistribution = {
  labels: ["70", "85", "100", "115", "130"],
  datasets: [
    {
      data: [2, 14, 68, 14, 2],
    },
  ],
};

export default function Results() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();

  const answers = JSON.parse(params.answers as string);
  const age = Number(params.age);
  const navigation = useNavigation();

  const { score, classification, description } = useIQCalculation(answers, age);

  // Calculate position for score indicator (simplified mapping)
  const getScorePosition = (score: number) => {
    if (score <= 70) return "2%";
    if (score <= 85) return "25%";
    if (score <= 100) return "50%";
    if (score <= 115) return "75%";
    return "98%";
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: t("test.shareMessage", {
          score,
          classification: t(classification),
        }),
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "index" }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 122, 255, 0.15)", "rgba(255, 255, 255, 0)", "rgba(0, 122, 255, 0.08)"]}
        style={styles.gradient}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0.8 }}
      />
      <View style={styles.contentContainer}>
        <View style={styles.scoreCard}>
          <ThemedText style={styles.scoreLabel}>{t("test.yourScore")}</ThemedText>
          <ThemedText style={styles.score}>{score}</ThemedText>
          <ThemedText style={styles.classification}>{t(classification)}</ThemedText>
        </View>

        <View style={styles.chartSection}>
          <ThemedText style={styles.chartTitle}>{t("test.distributionChart")}</ThemedText>
          <View style={styles.chartContainer}>
            <LineChart
              data={iqDistribution}
              width={300}
              height={200}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                strokeWidth: 2,
                fillShadowGradientFrom: "#007AFF",
                fillShadowGradientTo: "#ffffff",
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              withDots={false}
              withInnerLines={false}
              style={styles.chart}
            />
            <View style={[styles.scoreIndicator, { left: getScorePosition(score) }]} />
          </View>
        </View>

        <View style={styles.buttonSection}>
          <Button
            title={t("common.share")}
            onPress={handleShare}
            style={styles.button}
          />
          <Button
            title={t("common.back")}
            onPress={handleBack}
            style={styles.button}
            variant="outline"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    marginBottom: 50,
  },
  scoreCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  congratulations: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 15,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2c3e50",
    lineHeight: 48,
  },
  classification: {
    fontSize: 22,
    color: "#34495e",
    fontWeight: "600",
  },
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 15,
    textAlign: "center",
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  scoreIndicator: {
    position: "absolute",
    bottom: 30,
    width: 3,
    height: 140,
    backgroundColor: "#FF3B30",
    borderRadius: 2,
  },
  chartDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 20,
  },
  buttonSection: {
    gap: 12,
    marginTop: 20,
  },
  button: {
    width: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
