import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmptyMealState from './EmptyMealState';
import RecipeCard from './RecipeCard';

interface PlannedRecipe {
  fireId: string;
  recipeId: number;
  title: string;
  image: string;
  date: string;
}

interface WeekViewProps {
  selectedDate: string;
  weekDates: string[];
  onDateSelect: (date: string) => void;
  recipes: PlannedRecipe[];
  onRemoveRecipe: (recipeId: string, date: string) => void;
  getRecipesForDate: (date: string) => PlannedRecipe[];
}

export default function WeekView({
  selectedDate,
  weekDates,
  onDateSelect,
  recipes,
  onRemoveRecipe,
  getRecipesForDate,
}: WeekViewProps) {
  const renderWeekDay = (date: string) => {
    const recipesForDay = getRecipesForDate(date);
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dateObj.getDate();
    const isSelected = date === selectedDate;

    return (
      <TouchableOpacity
        key={date}
        style={[styles.dayContainer, isSelected && styles.daySelected]}
        onPress={() => onDateSelect(date)}
      >
        <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
          {dayName}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
          {dayNumber}
        </Text>
        {recipesForDay.length > 0 && (
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>{recipesForDay.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const weekStartDate = new Date(weekDates[0]).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <View style={styles.weekContainer}>
        <Text style={styles.weekTitle}>Week of {weekStartDate}</Text>
        <View style={styles.weekDaysRow}>
          {weekDates.map((date) => renderWeekDay(date))}
        </View>
      </View>

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
  weekContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  weekDaysRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  daySelected: {
    backgroundColor: '#4A90E2',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dayNumberSelected: {
    color: '#fff',
  },
  dayBadge: {
    marginTop: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
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