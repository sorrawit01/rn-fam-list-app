import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "loading",
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="loading" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      {/* ซ่อน Header ในหน้า redirect (index) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* กำหนดชื่อ Header สำหรับหน้า Home */}
      <Stack.Screen
        name="home"
        options={{
          title: "รายการซื้อของเข้าบ้าน",
          headerStyle: { backgroundColor: "#e6f1ff" },
          headerTitleStyle: { color: "#23496f", fontWeight: "700", fontSize: 19 },
          headerTintColor: "#2f639f",
          headerShadowVisible: false,
        }}
      />
      {/* กำหนดชื่อ Header สำหรับหน้า Profile */}
      <Stack.Screen
        name="profile"
        options={{
          title: "ตั้งค่าครอบครัว",
          headerStyle: { backgroundColor: "#e6f1ff" },
          headerTitleStyle: { color: "#23496f", fontWeight: "700", fontSize: 19 },
          headerTintColor: "#2f639f",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="tradinglog"
        options={{
          title: "ประวัติการซื้อ",
          headerStyle: { backgroundColor: "#e6f1ff" },
          headerTitleStyle: { color: "#23496f", fontWeight: "700", fontSize: 19 },
          headerTintColor: "#2f639f",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
