import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "components/ThemedText";
import { Card } from "components/ui/Card";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View, Modal } from "react-native";
import { Button } from "@/components/ui/Button";
import { useStorage } from "@/hooks/useStorage";
import { AgePicker } from "@/components/ui/AgePicker";
import { TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface UserData {
  name: string;
  age: string;
}

function Profile() {
  const { t } = useTranslation();
  const storage = useStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await storage.getItem("userData");
    if (data) {
      setUserData(data);
    }
  };

  const handleSave = async () => {
    await storage.setItem("userData", userData);
    setIsEditing(false);
  };

  const handleAgeSelect = (age: number) => {
    setUserData((prev) => ({ ...prev, age: age.toString() }));
    setShowAgePicker(false);
  };

  const menuItems = [
    {
      icon: "settings-outline",
      title: t("profile.settings.title"),
      route: "/(profile)/settings",
    },
    {
      icon: "bar-chart-outline",
      title: t("profile.history.title"),
      route: "/(profile)/history",
    },
  ];

  const renderEditModal = () => (
    <Modal
      visible={isEditing}
      animationType="slide"
      transparent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText
            type="subtitle"
            style={styles.modalTitle}
          >
            {t("profile.editProfile.title")}
          </ThemedText>

          <View style={styles.inputContainer}>
            <ThemedText style={{ color: "#000" }}>{t("profile.editProfile.nameLabel")}</ThemedText>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData((prev) => ({ ...prev, name: text }))}
              placeholder={t("profile.editProfile.namePlaceholder")}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={{ color: "#000" }}>{t("profile.editProfile.ageLabel")}</ThemedText>
            <Pressable
              style={styles.agePicker}
              onPress={() => setShowAgePicker(true)}
            >
              <ThemedText style={{ color: "#666" }}>{userData.age || t("profile.editProfile.agePlaceholder")}</ThemedText>
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={t("profile.editProfile.saveButton")}
              onPress={handleSave}
              style={styles.button}
            />
            <Button
              title={t("profile.editProfile.cancelButton")}
              onPress={() => setIsEditing(false)}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 122, 255, 0.1)", "rgba(255, 255, 255, 0)", "rgba(0, 122, 255, 0.05)"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
      />
      <Pressable onPress={() => setIsEditing(true)}>
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-circle-outline"
              size={80}
              color="#007AFF"
            />
          </View>

          <ThemedText
            type="title"
            style={styles.name}
          >
            {userData.name || t("profile.guest")}
          </ThemedText>

          {!userData.name && <ThemedText style={styles.emptyText}>{t("profile.userDataEmpty")}</ThemedText>}
        </Card>
      </Pressable>

      <View style={styles.menuContainer}>
        {menuItems.map((item: any, index: number) => (
          <Pressable
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <Card style={styles.menuCard}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color="#007AFF"
              />
              <ThemedText style={styles.menuText}>{item.title}</ThemedText>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="#007AFF"
              />
            </Card>
          </Pressable>
        ))}
      </View>

      {renderEditModal()}

      <AgePicker
        visible={showAgePicker}
        onClose={() => setShowAgePicker(false)}
        onSelect={handleAgeSelect}
        selectedAge={parseInt(userData.age)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    marginTop: 8,
    color: "#007AFF",
  },
  emptyText: {
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  menuContainer: {
    marginTop: 20,
    gap: 12,
  },
  menuItem: {
    width: "100%",
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  agePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    width: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
});

export default Profile;
