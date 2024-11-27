import React, { useEffect, useRef, useState } from "react";
import { Modal, View, StyleSheet, ScrollView, Animated } from "react-native";
import { ThemedText } from "../ThemedText";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface AgePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (age: number) => void;
  selectedAge?: number;
}

export function AgePicker({ visible, onClose, onSelect, selectedAge }: AgePickerProps) {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [tempSelectedAge, setTempSelectedAge] = useState(selectedAge);
  const scrollY = useRef(new Animated.Value(0)).current;
  const ages = Array.from({ length: 120 }, (_, i) => i + 1);
  const itemHeight = 50;
  const visibleItems = 5;
  const containerHeight = itemHeight * visibleItems;
  const paddingTop = (containerHeight - itemHeight) / 2;

  useEffect(() => {
    if (visible && selectedAge && scrollViewRef.current) {
      setTempSelectedAge(selectedAge);
      scrollViewRef.current?.scrollTo({
        y: (selectedAge - 1) * itemHeight,
        animated: false,
      });
    }
  }, [visible, selectedAge]);

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      const centerIndex = Math.round(y / itemHeight);
      const newAge = ages[centerIndex];

      if (newAge && newAge !== tempSelectedAge) {
        setTempSelectedAge(newAge);
      }
    },
  });

  const handleMomentumScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const centerIndex = Math.round(y / itemHeight);

    // Ajusta o scroll para centralizar perfeitamente
    scrollViewRef.current?.scrollTo({
      y: centerIndex * itemHeight,
      animated: true,
    });
  };

  const handleConfirm = () => {
    if (tempSelectedAge) {
      onSelect(tempSelectedAge);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={styles.overlay}
        onTouchEnd={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <View style={styles.container}>
          <ThemedText
            type="subtitle"
            style={styles.title}
          >
            {t("profile.editProfile.ageLabel")}
          </ThemedText>

          <View style={[styles.pickerContainer, { height: containerHeight }]}>
            <View style={styles.selectionHighlight} />
            <Animated.ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              snapToInterval={itemHeight}
              decelerationRate="fast"
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingVertical: paddingTop }}
            >
              {ages.map((age) => (
                <View
                  key={age}
                  style={[styles.ageItem, tempSelectedAge === age && styles.selectedAgeRow]}
                >
                  <ThemedText style={[styles.ageText, tempSelectedAge === age && styles.selectedAgeText]}>{age}</ThemedText>
                </View>
              ))}
            </Animated.ScrollView>
          </View>

          <Button
            title={t("common.confirm")}
            onPress={handleConfirm}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  pickerContainer: {
    position: "relative",
    marginBottom: 20,
    overflow: "hidden",
    borderRadius: 8,
  },
  scrollView: {
    height: "100%",
  },
  selectionHighlight: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#007AFF",
    zIndex: -1,
  },
  ageItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  selectedAgeRow: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  ageText: {
    fontSize: 24,
    color: "#000",
    opacity: 0.5,
  },
  selectedAgeText: {
    color: "#007AFF",
    fontWeight: "600",
    opacity: 1,
  },
  button: {
    marginTop: 10,
  },
});
