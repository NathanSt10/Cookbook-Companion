import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  type PlannedRecipe = {
    title: string;
    image: string;
  };

  type PlannedRecipes = Record<string, PlannedRecipe[]>;

  // Example planned recipes (replace with backend later)
  const plannedRecipes: PlannedRecipes = {
    "2025-09-23": [
      { title: "Avocado Toast", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" },
      { title: "Lemon Cake", image: "https://images.unsplash.com/photo-1605478571920-74b90cda44bb" },
    ],
    "2025-09-25": [
      { title: "Pasta Primavera", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" },
    ],
  };


  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        initialDate={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "black" },
          "2025-09-23": { marked: true, dotColor: "blue" },
          "2025-09-25": { marked: true, dotColor: "red" },
        }}
        theme={{
          todayTextColor: "red",
          selectedDayBackgroundColor: "black",
          arrowColor: "black",
        }}
      />

      {/* Planned Recipes Section */}
      <ScrollView style={styles.recipesSection}>
        <Text style={styles.sectionTitle}>
          Planned Recipes for {selectedDate}
        </Text>

        {plannedRecipes[selectedDate] ? (
          plannedRecipes[selectedDate].map((recipe, index) => (
            <View key={index} style={styles.recipeCard}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noRecipes}>No recipes planned for this day.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  recipesSection: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  noRecipes: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
});
