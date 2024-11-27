import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/ui/Card";
import { useStorage } from "@/hooks/useStorage";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface HistoryItem {
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  iqScore: number;
}

export default function History() {
  const { t } = useTranslation();
  const storage = useStorage();
  const [history, setHistory] = React.useState<HistoryItem[]>([]);

  React.useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await storage.getItem("testHistory");
      if (historyData) {
        const validHistory = historyData.filter((item: HistoryItem) => !isNaN(item.iqScore) && !isNaN(item.correctAnswers) && !isNaN(item.wrongAnswers));
        setHistory(validHistory);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const getAverageIQ = () => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, item) => acc + (isNaN(item.iqScore) ? 0 : item.iqScore), 0);
    return Math.round(sum / history.length);
  };

  const getLatestResult = () => {
    return history[0] || null;
  };

  const getChartData = () => {
    const lastFiveTests = history.slice(-5).reverse();
    return {
      labels: lastFiveTests.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" });
      }),
      datasets: [
        {
          data: lastFiveTests.map((item) => item.iqScore || 0),
        },
      ],
    };
  };

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>{t("profile.history.noTests")}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.row}>
          <Card style={[styles.card, styles.halfCard, styles.highlightCard]}>
            <ThemedText
              type="subtitle"
              style={styles.cardTitle}
            >
              {t("profile.history.latestResult")}
            </ThemedText>
            <ThemedText style={styles.scoreText}>{getLatestResult()?.iqScore?.toString() || "0"}</ThemedText>
          </Card>

          <Card style={[styles.card, styles.halfCard, styles.highlightCard]}>
            <ThemedText
              type="subtitle"
              style={styles.cardTitle}
            >
              {t("profile.history.averageScore")}
            </ThemedText>
            <ThemedText style={styles.scoreText}>{getAverageIQ().toString()}</ThemedText>
          </Card>
        </View>

        <Card style={[styles.card, styles.chartCard]}>
          <ThemedText
            type="subtitle"
            style={styles.cardTitle}
          >
            {t("profile.history.progressChart")}
          </ThemedText>
          <LineChart
            data={getChartData()}
            width={Dimensions.get("window").width - 60}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              propsForLabels: {
                fill: "#333333",
              },
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card>

        <Card style={[styles.card, styles.historyCard]}>
          <ThemedText
            type="subtitle"
            style={styles.cardTitle}
          >
            {t("profile.history.testHistory")}
          </ThemedText>
          {history.map((item, index) => (
            <View
              key={index}
              style={styles.historyItem}
            >
              <ThemedText style={styles.date}>{new Date(item.date).toLocaleDateString()}</ThemedText>
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <ThemedText style={styles.resultLabel}>{t("profile.history.correct")}</ThemedText>
                  <ThemedText style={styles.resultValue}>{item.correctAnswers.toString()}</ThemedText>
                </View>
                <View style={styles.resultItem}>
                  <ThemedText style={styles.resultLabel}>{t("profile.history.wrong")}</ThemedText>
                  <ThemedText style={styles.resultValue}>{item.wrongAnswers.toString()}</ThemedText>
                </View>
                <View style={styles.resultItem}>
                  <ThemedText style={styles.resultLabel}>IQ</ThemedText>
                  <ThemedText style={styles.iqScore}>{item.iqScore.toString()}</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 70, // Espaço para o ad
  },
  row: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  card: {
    padding: 10,
  },
  highlightCard: {
    backgroundColor: "#007AFF",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: "#ffffff",
  },
  halfCard: {
    flex: 1,
    alignItems: "center",
  },
  cardTitle: {
    color: "#FFFFFF",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    lineHeight: 32,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 12,
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#666666",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultItem: {
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  iqScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
