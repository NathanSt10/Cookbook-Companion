import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CalendarViewType = "month" | "week";

interface CalendarViewToggleProps {
  active: CalendarViewType;
  onChange: (view: CalendarViewType) => void;
}

export default function CalendarViewToggle({ 
  active, 
  onChange 
  }: CalendarViewToggleProps) {

  return (
    <View style={styles.toggle}>
      <TouchableOpacity
        style={[styles.item, active === "month" && styles.active]}
        onPress={() => onChange("month")}
      >
        <Text style={[styles.text, active === "month" && styles.textActive]}>
          Month
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.item, active === "week" && styles.active]}
        onPress={() => onChange("week")}
      >
        <Text style={[styles.text, active === "week" && styles.textActive]}>
          Week
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    backgroundColor: 'gainsboro',
    shadowColor: "black",
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
    backgroundColor: "whitesmoke",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    color: "black",
  },
  textActive: {
    fontWeight: "700",
  },
});