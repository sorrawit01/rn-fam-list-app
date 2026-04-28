import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // ล้าง history ทั้งหมด แล้วไปหน้าใส่รหัสครอบครัวใหม่
    router.dismissAll();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ตั้งค่าครอบครัว</Text>
      <Text style={styles.subtitle}>จัดการบัญชีและสถานะการเชื่อมต่อของบ้านเรา</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>สถานะการเชื่อมต่อ</Text>
        <Text style={styles.value}>ออนไลน์</Text>
      </View>
      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>เคล็ดลับเล็กน้อย</Text>
        <Text style={styles.tipText}>
          เพิ่มรายการของที่ใช้ประจำไว้ล่วงหน้า จะช่วยให้เช็คลิสต์เร็วขึ้นเวลาช้อป
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>ออกจากระบบครอบครัว</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eaf3ff",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    color: "#163f69",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#2e5684",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#bfd8ff",
    shadowColor: "#143b66",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  label: {
    fontSize: 18,
    color: "#2e5684",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2f639f",
  },
  tipBox: {
    backgroundColor: "#deecff",
    borderWidth: 1,
    borderColor: "#bfd8ff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#143b66",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2f639f",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 15,
    color: "#2e5684",
    lineHeight: 22,
  },
  logoutBtn: {
    backgroundColor: "#5b95dd",
    padding: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    shadowColor: "#295d94",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logoutBtnText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
  },
});
