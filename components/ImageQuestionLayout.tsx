import React, { useState } from "react";
import { View, StyleSheet, Pressable, Dimensions, Modal, PanResponder } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTranslation } from "react-i18next";
import { patternImages } from "@/assets/questions/patterns";

interface ImageQuestionLayoutProps {
  questionId: string;
  questionKey: string;
  selectedOption: number | null;
  onSelect: (index: number) => void;
}

export function ImageQuestionLayout({ questionKey, selectedOption, onSelect }: ImageQuestionLayoutProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const screenWidth = Dimensions.get("window").width;
  const imageSize = (screenWidth - 60) / 2;
  const { t } = useTranslation();

  const questionNumber = questionKey.replace("p", "").padStart(2, "0");
  const questionImageKey = `${questionNumber}_q_01` as keyof typeof patternImages;
  const answerImageKeys = [`${questionNumber}_a_01`, `${questionNumber}_a_02`, `${questionNumber}_a_03`, `${questionNumber}_a_04`] as const;

  const QuestionSvg = patternImages[questionImageKey];
  const answerSvgs = answerImageKeys.map((key) => patternImages[key as keyof typeof patternImages]);

  if (!QuestionSvg || answerSvgs.some((svg) => !svg)) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.error}>Error loading images</ThemedText>
      </View>
    );
  }

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      setModalVisible(true);
      setLastTap(null);
    } else {
      setLastTap(now);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setPan({
        x: gestureState.dx,
        y: gestureState.dy,
      });
    },
    onPanResponderRelease: () => {
      setPan({ x: 0, y: 0 });
      setScale(1);
    },
  });

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{t("questions.patterns.title")}</ThemedText>

      <Pressable
        onPress={handleDoubleTap}
        style={styles.questionImageContainer}
      >
        <QuestionSvg
          width={screenWidth * 0.9}
          height={200}
          style={styles.questionImage}
        />
      </Pressable>

      <View style={styles.optionsContainer}>
        <View style={styles.optionsGrid}>
          {answerSvgs.map((AnswerSvg, index) => (
            <Pressable
              key={index}
              style={[styles.optionContainer, selectedOption === index && styles.selectedOption]}
              onPress={() => onSelect(index)}
            >
              <AnswerSvg
                width="100%"
                height="100%"
                style={styles.optionImage}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setPan({ x: 0, y: 0 });
          setScale(1);
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setModalVisible(false);
            setPan({ x: 0, y: 0 });
            setScale(1);
          }}
        >
          <View
            style={[
              styles.modalContent,
              {
                transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <QuestionSvg
              width={screenWidth * 0.95}
              height={screenWidth * 0.95}
              style={styles.modalImage}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  questionImageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  questionImage: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  optionsContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  optionContainer: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    overflow: "hidden",
    margin: "1%",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  optionImage: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  error: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "transparent",
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalImage: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
});
