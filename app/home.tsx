import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabase";

export default function HomeScreen() {
  // รับพารามิเตอร์ familyCode ผ่าน Expo Router
  const { familyCode } = useLocalSearchParams<{ familyCode: string }>();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    if (familyCode) fetchItems();
  }, [familyCode]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("family_groceries")
      .select("*")
      .eq("family_code", familyCode)
      .order("created_at", { ascending: false });

    if (!error && data) setItems(data);
  };

  const getLatestBoughtPrice = async (itemName: string) => {
    const { data, error } = await supabase
      .from("family_groceries")
      .select("current_price")
      .eq("family_code", familyCode)
      .eq("item_name", itemName)
      .eq("is_bought", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return null;
    return data?.current_price ?? null;
  };

  const addItem = async () => {
    const trimmedName = newItemName.trim();
    if (!trimmedName) return;

    const currPrice = parseFloat(newPrice) || 0;
    const prevPrice = await getLatestBoughtPrice(trimmedName);

    const { error } = await supabase.from("family_groceries").insert([
      {
        family_code: familyCode,
        item_name: trimmedName,
        current_price: currPrice,
        previous_price: prevPrice ?? 0,
      },
    ]);

    if (!error) {
      setNewItemName("");
      setNewPrice("");
      fetchItems();
    }
  };

  const setBoughtStatus = async (id: string, status: boolean) => {
    const { error } = await supabase
      .from("family_groceries")
      .update({ is_bought: status })
      .eq("id", id);
    if (!error) fetchItems();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from("family_groceries")
      .delete()
      .eq("id", id);
    if (!error) fetchItems();
  };

  const renderItem = ({ item }: any) => {
    const priceDiff = item.current_price - item.previous_price;
    const isMoreExpensive = priceDiff > 0;
    const isCheaper = priceDiff < 0;

    return (
      <View style={styles.card}>
        <View style={styles.statusSwitcher}>
          <TouchableOpacity
            style={[
              styles.statusBtn,
              !item.is_bought && styles.statusBtnActiveFalse,
            ]}
            onPress={() => setBoughtStatus(item.id, false)}
          >
            <Text
              style={[
                styles.statusBtnText,
                !item.is_bought && styles.statusBtnTextFalse,
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusBtn,
              item.is_bought && styles.statusBtnActiveTrue,
            ]}
            onPress={() => setBoughtStatus(item.id, true)}
          >
            <Text
              style={[
                styles.statusBtnText,
                item.is_bought && styles.statusBtnTextTrue,
              ]}
            >
              ✓
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.statusLabel,
            item.is_bought ? styles.statusLabelTrue : styles.statusLabelFalse,
          ]}
        >
          {item.is_bought ? "ซื้อสินค้าเรียบร้อย" : "ยังไม่ซื้อสินค้า"}
        </Text>

        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, item.is_bought && styles.boughtText]}>
            {item.item_name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>฿{item.current_price}</Text>
            {item.previous_price > 0 ? (
              <Text
                style={[
                  styles.diffText,
                  isMoreExpensive
                    ? styles.red
                    : isCheaper
                      ? styles.green
                      : styles.grey,
                ]}
              >
                {isMoreExpensive
                  ? " 🔺 แพงขึ้น"
                  : isCheaper
                    ? " 🟢 ถูกลง"
                    : " ➖ ราคาเดิม"}
                ({Math.abs(priceDiff)}฿)
              </Text>
            ) : (
              <Text style={[styles.diffText, styles.grey]}>
                ยังไม่มีราคาที่เคยซื้อก่อนหน้า
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => deleteItem(item.id)}>
          <Text style={styles.deleteText}>✖</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const boughtCount = items.filter((item) => item.is_bought).length;
  const pendingCount = items.length - boughtCount;

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.smallLabel}>My Family id</Text>
            <Text style={styles.header}>{familyCode}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.profilePill}
              onPress={() => router.push("../profile")}
            >
              <Text style={styles.profileBtn}>ตั้งค่า</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutPill}
              onPress={() => router.replace("/loading")}
            >
              <Text style={styles.logoutBtnText}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>รอซื้อ</Text>
            <Text style={styles.statValue}>{pendingCount}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>ซื้อแล้ว</Text>
            <Text style={styles.statValue}>{boughtCount}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>ทั้งหมด</Text>
            <Text style={styles.statValue}>{items.length}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.historyPill}
          onPress={() =>
            router.push({ pathname: "../tradinglog", params: { familyCode } })
          }
        >
          <Text style={styles.historyBtn}>ดูประวัติการซื้อ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="ของที่จะซื้อ"
            placeholderTextColor="#a9a39a"
            value={newItemName}
            onChangeText={setNewItemName}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="ราคา ฿"
            placeholderTextColor="#a9a39a"
            keyboardType="numeric"
            value={newPrice}
            onChangeText={setNewPrice}
          />
        </View>
        <TouchableOpacity style={styles.addBtnLarge} onPress={addItem}>
          <Text style={styles.addBtnText}>เพิ่มรายการสินค้า</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>ยังไม่มีของในลิสต์</Text>
            <Text style={styles.emptyText}>
              เพิ่มรายการแรกของบ้านคุณได้เลยครับ
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#eaf3ff" },
  topCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#bfd8ff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#143b66",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallLabel: {
    fontSize: 15,
    color: "#27486d",
    marginBottom: 3,
    fontWeight: "600",
  },
  header: { fontSize: 26, fontWeight: "800", color: "#b42245" },
  headerActions: {
    flexDirection: "row",
    gap: 6,
  },
  profilePill: {
    backgroundColor: "#d62839",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  profileBtn: { fontSize: 14, color: "#ffffff", fontWeight: "800" },
  logoutPill: {
    backgroundColor: "#c1121f",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutBtnText: { fontSize: 14, color: "#ffffff", fontWeight: "800" },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  statBadge: {
    flex: 1,
    backgroundColor: "#e2efff",
    borderWidth: 1,
    borderColor: "#bcd7ff",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    minHeight: 58,
  },
  statLabel: {
    fontSize: 13,
    color: "#35577f",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2e4661",
  },
  historyPill: {
    marginTop: 12,
    backgroundColor: "#b7d2ff",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  historyBtn: { fontSize: 16, color: "#1f4c7d", fontWeight: "700" },

  inputWrapper: {
    marginBottom: 18,
    gap: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    backgroundColor: "#f3f8ff",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#bfd8ff",
    fontSize: 15,
    color: "#1f3f65",
  },
  addBtnLarge: {
    backgroundColor: "#c1121f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#c1121f",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  addBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfd8ff",
    shadowColor: "#143b66",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  statusSwitcher: {
    marginRight: 15,
    gap: 6,
  },
  statusBtn: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    minWidth: 58,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfd8ff",
    borderRadius: 10,
  },
  statusBtnActiveFalse: {
    backgroundColor: "#ffe3e3",
    borderColor: "#f1a7a7",
  },
  statusBtnActiveTrue: {
    backgroundColor: "#ddf5e6",
    borderColor: "#8ec9a2",
  },
  statusBtnText: {
    fontSize: 20,
    color: "#4f5f73",
    fontWeight: "600",
  },
  statusBtnTextFalse: {
    color: "#8f3535",
  },
  statusBtnTextTrue: {
    color: "#266c3f",
  },
  statusLabel: {
    marginRight: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  statusLabelFalse: {
    color: "#8f3535",
  },
  statusLabelTrue: {
    color: "#266c3f",
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 22, fontWeight: "700", color: "#1f3f65" },
  boughtText: { textDecorationLine: "line-through", color: "#aaa" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  priceText: { fontSize: 17, fontWeight: "700", color: "#204f85" },
  diffText: { fontSize: 13, marginLeft: 10 },
  red: { color: "#c74848" },
  green: { color: "#3b9f68" },
  grey: { color: "#5f7187" },
  deleteText: { fontSize: 20, padding: 10, color: "#5a88bb" },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#bfd8ff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#143b66",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2e4661",
  },
  emptyText: { fontSize: 15, color: "#35577f", marginTop: 6 },
});
