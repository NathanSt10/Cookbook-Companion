import { router } from 'expo-router';
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
          selectedDayBackgroundColor: 'royalblue',
          todayTextColor: 'royalblue',
          dotColor: 'firebrick',
          arrowColor: 'black',
        }}
      />

      <View style={styles.recipesSection}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{formattedDate}</Text>
          {(recipes.length === 1) 
            ? <Text style={styles.headerCount}>{recipes.length} meal</Text>
            : <Text style={styles.headerCount}>{recipes.length} meals</Text>
          }
        </View>

        {recipes.length === 0 
          ?  <EmptyMealState />
          : (<FlatList
              data={recipes}
              keyExtractor={(item) => item.fireId}
              renderItem={({ item }) => (
                <RecipeCard
                  title={item.title}
                  image={item.image}
                  onPress={() => router.push(`/recipe/${item.recipeId}`)}
                  onRemove={() => onRemoveRecipe(item.fireId, item.date)}
                />
              )}
              contentContainerStyle={styles.list} />
            )
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  recipesSection: {
    flex: 1,
    backgroundColor: 'ghostwhite',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'ghostwhite',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerCount: {
    fontSize: 14,
    color: 'black',
  },
  list: {
    padding: 20,
  },
});