import { ImageQuestionLayout } from "@/components/ImageQuestionLayout";
import { useQuestionSelection } from "@/hooks/useQuestionSelection";
import { Button } from "components/ui/Button";
import { router } from "expo-router";
import { useQuestionData } from "hooks/useQuestionData";
import { useStorage } from "hooks/useStorage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Answer } from "types/index";
import { HistoryItem } from "types/storage";
import { calculateIQ } from "utils/iqCalculator";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedView } from "components/ThemedView";
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from "react-native-reanimated";
import { ThemedText } from "components/ThemedText";

function Test() {
  const storage = useStorage();
  const { getQuestionData } = useQuestionData();
  const selectedQuestions = useQuestionSelection();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAge, setUserAge] = useState<string>("25");
  const { t } = useTranslation();

  // Criar um shared value para o progresso
  const progressAnimation = useSharedValue(0);

  useEffect(() => {
    loadProgress();
    loadUserData();
  }, []);

  // Atualizar o valor da animação quando o currentQuestionIndex mudar
  useEffect(() => {
    const newProgress = Math.round((currentQuestionIndex / selectedQuestions.length) * 100);
    progressAnimation.value = withTiming(newProgress, {
      duration: 500,
    });
  }, [currentQuestionIndex, selectedQuestions.length]);

  const loadUserData = async () => {
    try {
      const userData = await storage.getItem("userData");
      if (userData?.age) {
        setUserAge(userData.age);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadProgress = async () => {
    try {
      const progress = await storage.getItem("testProgress");
      if (progress) {
        setCurrentQuestionIndex(progress.currentIndex);
        setAnswers(progress.savedAnswers);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading progress:", error);
      setIsLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      await storage.setItem("testProgress", {
        currentIndex: currentQuestionIndex,
        savedAnswers: answers,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleAnswer = async () => {
    if (selectedOption === null) return;

    const currentQuestion = selectedQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    const timeSpent = (Date.now() - startTime) / 1000;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      isCorrect: selectedOption === currentQuestion.correctAnswer,
      timeSpent,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < selectedQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setStartTime(Date.now());
      await saveProgress();
    } else {
      try {
        const existingHistory = (await storage.getItem("testHistory")) || [];
        const historyEntry: HistoryItem = {
          date: new Date().toISOString(),
          score: newAnswers.filter((answer) => answer.isCorrect).length,
          totalQuestions: selectedQuestions.length,
          correctAnswers: newAnswers.filter((answer) => answer.isCorrect).length,
          wrongAnswers: newAnswers.filter((answer) => !answer.isCorrect).length,
          iqScore: calculateIQ(newAnswers, Number(userAge)),
        };
        await storage.setItem("testHistory", [historyEntry, ...existingHistory]);
        await storage.removeItem("testProgress");

        router.push({
          pathname: "/(test)/purchase-options",
          params: {
            answers: JSON.stringify(newAnswers),
            age: userAge,
          },
        });
      } catch (error) {
        console.error("Error finalizing test:", error);
      }
    }
  };

  const renderQuestion = () => {
    if (!questionData || !questionData.options) return null;

    if (currentQuestion.type === "image") {
      return (
        <ImageQuestionLayout
          questionId={currentQuestion.id}
          questionKey={currentQuestion.questionKey}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
        />
      );
    }

    return (
      <View style={styles.optionsContainer}>
        {Array.isArray(questionData.options) ? (
          questionData.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, selectedOption === index && styles.optionButtonSelected]}
              onPress={() => setSelectedOption(index)}
            >
              <Text style={[styles.optionText, selectedOption === index && styles.optionTextSelected]}>{option}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.error}>{t("test.error.invalidOptions")}</Text>
        )}
      </View>
    );
  };

  // Criar o estilo animado usando o shared value
  const progressWidth = useAnimatedStyle(() => ({
    width: `${progressAnimation.value}%`,
  }));

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{t("test.error.questionNotFound")}</Text>
      </View>
    );
  }

  const questionData = getQuestionData(currentQuestion.id);
  if (!questionData || !questionData.options) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{t("test.error.questionDataNotFound")}</Text>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 122, 255, 0.08)", "rgba(0, 122, 255, 0)", "rgba(0, 122, 255, 0.05)"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressBar, progressWidth]} />
        </View>
        <ThemedText style={styles.progressText}>{Math.round((currentQuestionIndex / selectedQuestions.length) * 100)}%</ThemedText>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.progress}>
          {t("test.question", {
            current: currentQuestionIndex + 1,
            total: selectedQuestions.length,
          })}
        </Text>
        {currentQuestion.type !== "image" && <Text style={styles.question}>{questionData.question}</Text>}
        {renderQuestion()}
        {selectedOption !== null && (
          <Button
            title={t("test.confirm")}
            onPress={handleAnswer}
            size="large"
            style={styles.confirmButton}
          />
        )}
      </ScrollView>
    </ThemedView>
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
    paddingBottom: 100,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  progress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "white",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  confirmButton: {
    marginTop: 20,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    minWidth: 45,
  },
});

export default Test;
