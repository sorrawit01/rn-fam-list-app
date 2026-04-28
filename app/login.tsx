import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [familyCode, setFamilyCode] = useState("");
  const router = useRouter(); // ใช้ useRouter ของ Expo Router

  const handleLogin = () => {
    if (familyCode.trim()) {
      // ส่งรหัสครอบครัวไปหน้า Home โดยใช้ router.replace (เพื่อไม่ให้กดย้อนกลับมาหน้า Login ได้ง่ายๆ)
      router.replace({ pathname: "../home", params: { familyCode } });
    } else {
      alert("กรุณากรอกรหัสครอบครัว");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="home-heart" size={36} color="#4d89d3" />
        </View>
        <Text style={styles.title}>Family List</Text>
        <Text style={styles.subtitle}>
          แอปพลิเคชันสำหรับจัดการซื้อของเข้าบ้านสำหรับครอบครัว
        </Text>
        <Text style={styles.helperText}>
          ใส่รหัสครอบครัวของคุณเพื่อเข้าสู่ระบบ
        </Text>

        <TextInput
          style={styles.input}
          placeholder="กรอกรหัสครอบครัว เช่น HOME1234"
          placeholderTextColor="#a9a39a"
          value={familyCode}
          onChangeText={setFamilyCode}
          autoCapitalize="characters"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#eaf3ff",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "#bfd8ff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  iconWrap: {
    alignSelf: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#deecff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#163f69",
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 8,
    color: "#2e5684",
    lineHeight: 24,
  },
  helperText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    color: "#456d99",
  },
  exampleText: {
    fontSize: 13,
    textAlign: "center",
    color: "#2b5e97",
    marginBottom: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f2f8ff",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#bfd8ff",
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#b42245",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#5b95dd",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#295d94",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: { color: "#fff", fontSize: 19, fontWeight: "700" },
});
