import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import EmptyMealState from './EmptyMealState';
import RecipeCard from './RecipeCard';

interface PlannedRecipe {
  fireId: string;
  recipeId: number;
  title: string;
  image: string;
  date: string;
}

interface MonthViewProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  markedDates: any;
  recipes: PlannedRecipe[];
  onRemoveRecipe: (recipeId: string, date: string) => void;
}

export default function MonthView({
  selectedDate,
  onDateSelect,
  markedDates,
  recipes,
  onRemoveRecipe,
}: MonthViewProps) {
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => onDateSelect(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#4A90E2',
          todayTextColor: '#4A90E2',
          dotColor: '#FF6B6B',
          arrowColor: '#000',
        }}
      />

      <View style={styles.recipesSection}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{formattedDate}</Text>
          <Text style={styles.headerCount}>{recipes.length} meal(s)</Text>
        </View>

        {recipes.length === 0 ? (
          <EmptyMealState />
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.fireId}
            renderItem={({ item }) => (
              <RecipeCard
                title={item.title}
                image={item.image}
                onRemove={() => onRemoveRecipe(item.fireId, item.date)}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  recipesSection: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerCount: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 20,
  },
});