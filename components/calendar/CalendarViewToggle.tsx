import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CalendarView = "month" | "week";

interface CalendarViewToggleProps {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
}

export default function CalendarViewToggle({ 
  value, 
  onChange 
}: CalendarViewToggleProps) {
  return (
    <View style={styles.toggle}>
      <TouchableOpacity
        style={[styles.item, value === "month" && styles.active]}
        onPress={() => onChange("month")}
      >
        <Text style={[styles.text, value === "month" && styles.textActive]}>
          Month
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.item, value === "week" && styles.active]}
        onPress={() => onChange("week")}
      >
        <Text style={[styles.text, value === "week" && styles.textActive]}>
          Week
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  active: {
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  textActive: {
    fontWeight: "700",
  },
});