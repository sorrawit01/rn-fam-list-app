import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../services/supabase";

type GroceryRow = {
  id: string;
  item_name: string;
  current_price: number;
  created_at: string;
  is_bought: boolean;
};

type GroupedHistory = {
  key: string;
  displayName: string;
  entries: GroceryRow[];
};

export default function TradingLogScreen() {
  const { familyCode } = useLocalSearchParams<{ familyCode: string }>();
  const [historyRows, setHistoryRows] = useState<GroceryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (familyCode) {
      fetchTradingLog();
    }
  }, [familyCode]);

  const fetchTradingLog = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("family_groceries")
      .select("id, item_name, current_price, created_at, is_bought")
      .eq("family_code", familyCode)
      .eq("is_bought", true)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setHistoryRows(data as GroceryRow[]);
    } else {
      setHistoryRows([]);
    }
    setLoading(false);
  };

  const groupedHistory = useMemo<GroupedHistory[]>(() => {
    const map = new Map<string, GroupedHistory>();

    for (const row of historyRows) {
      const normalized = row.item_name.trim().toLowerCase();
      if (!map.has(normalized)) {
        map.set(normalized, {
          key: normalized,
          displayName: row.item_name.trim(),
          entries: [],
        });
      }
      map.get(normalized)?.entries.push(row);
    }

    return Array.from(map.values()).sort((a, b) => {
      const aLatestDate = new Date(
        a.entries[a.entries.length - 1]?.created_at ?? 0,
      ).getTime();
      const bLatestDate = new Date(
        b.entries[b.entries.length - 1]?.created_at ?? 0,
      ).getTime();
      return bLatestDate - aLatestDate;
    });
  }, [historyRows]);

  const formatDate = (isoDate: string) => {
    const parsed = new Date(isoDate);
    return parsed.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topCard}>
        <Text style={styles.title}>ประวัติการซื้อของบ้าน {familyCode}</Text>
        <Text style={styles.subtitle}>คัดแยกสินค้าตามชื่อสินค้า</Text>
      </View>

      {loading ? (
        <Text style={styles.stateText}>กำลังโหลดประวัติ...</Text>
      ) : groupedHistory.length === 0 ? (
        <Text style={styles.stateText}>ยังไม่มีประวัติการซื้อ</Text>
      ) : (
        groupedHistory.map((group) => (
          <View key={group.key} style={styles.blockCard}>
            <View style={styles.blockHeader}>
              <Text style={styles.itemTitle}>{group.displayName}</Text>
              <Text style={styles.countText}>{group.entries.length} ครั้ง</Text>
            </View>

            {group.entries.map((entry, index) => (
              <View key={entry.id} style={styles.entryRow}>
                <Text style={styles.entryIndex}>#{index + 1}</Text>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryDate}>
                    {formatDate(entry.created_at)}
                  </Text>
                  <Text style={styles.entryPrice}>฿{entry.current_price}</Text>
                </View>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf3ff" },
  content: { padding: 20, paddingBottom: 24 },
  topCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#bfd8ff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#143b66",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 23, fontWeight: "700", color: "#163f69" },
  subtitle: { fontSize: 15, color: "#2e5684", marginTop: 6, lineHeight: 21 },
  stateText: {
    fontSize: 17,
    color: "#2e5684",
    textAlign: "center",
    marginTop: 30,
  },
  blockCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#bfd8ff",
    marginBottom: 12,
    shadowColor: "#143b66",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemTitle: { fontSize: 20, fontWeight: "700", color: "#163f69" },
  countText: { fontSize: 14, color: "#3f6793", fontWeight: "600" },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#deecff",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#bfd8ff",
    minHeight: 48,
  },
  entryIndex: { fontSize: 14, color: "#3f6793", width: 30, fontWeight: "600" },
  entryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  entryDate: { fontSize: 16, color: "#2e5684" },
  entryPrice: { fontSize: 18, color: "#2f639f", fontWeight: "700" },
});
