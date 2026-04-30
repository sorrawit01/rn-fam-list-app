import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function loadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          router.replace("../login");
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoEmoji}>🏠</Text>
      </View>
      <Text style={styles.title}>กำลังเตรียมการเข้าสู่หน้าหลัก</Text>
      <Text style={styles.subTitle}>กำลังเชื่อมต่อกับระบบ...</Text>
      <View style={styles.progressOuter}>
        <View style={[styles.progressInner, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.percent}>{progress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf3ff",
    paddingHorizontal: 26,
    gap: 12,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#deecff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#bfd8ff",
    shadowColor: "#275a90",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  logoEmoji: {
    fontSize: 42,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#163f69",
  },
  subTitle: {
    fontSize: 16,
    color: "#2e5684",
    marginBottom: 6,
  },
  progressOuter: {
    width: "90%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "#cfe4ff",
    overflow: "hidden",
    marginTop: 8,
  },
  progressInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#5b95dd",
  },
  percent: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2f639f",
    letterSpacing: 0.5,
  },
});
