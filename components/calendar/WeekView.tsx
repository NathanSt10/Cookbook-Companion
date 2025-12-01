import { Ionicons } from '@expo/vector-icons';
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
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const daysToAdd = direction === 'next' ? 7 : -7;
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    onDateSelect(currentDate.toISOString().split('T')[0]);
  };

  const renderWeekDay = (date: string) => {
    const recipesForDay = getRecipesForDate(date);
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dateObj.getDate();
    const isSelected = date === selectedDate;
    const isToday = date === new Date().toISOString().split('T')[0];

    return (
      <TouchableOpacity
        key={date}
        style={[
          styles.dayContainer, 
          isSelected && styles.daySelected,
          isToday && !isSelected && styles.dayToday,
        ]}
        onPress={() => onDateSelect(date)}
      >
        <Text style={[
          styles.dayName, 
          isSelected && styles.dayNameSelected,
          isToday && !isSelected && styles.dayNameToday,
        ]}>
          {dayName}
        </Text>
        <Text style={[
          styles.dayNumber, 
          isSelected && styles.dayNumberSelected,
          isToday && !isSelected && styles.dayNumberToday,
        ]}>
          {dayNumber}
        </Text>
        {recipesForDay.length > 0 && (
          <View style={[styles.dayBadge, isSelected && styles.dayBadgeSelected]}>
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
    month: 'short',
    day: 'numeric',
  });

  const weekEndDate = new Date(weekDates[6]).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateWeek('prev')}
          >
            <Ionicons name="chevron-back" size={24} color="#4A90E2" />
          </TouchableOpacity>
          
          <Text style={styles.weekTitle}>
            {weekStartDate} - {weekEndDate}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateWeek('next')}
          >
            <Ionicons name="chevron-forward" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        
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
    borderBottomColor: '#e5e7eb',
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  weekDaysRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 4,
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  daySelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  dayToday: {
    borderColor: '#4A90E2',
    backgroundColor: '#f0f8ff',
  },
  dayName: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  dayNameSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  dayNameToday: {
    color: '#4A90E2',
    fontWeight: '700',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  dayNumberSelected: {
    color: '#fff',
  },
  dayNumberToday: {
    color: '#4A90E2',
  },
  dayBadge: {
    marginTop: 6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBadgeSelected: {
    backgroundColor: '#fff',
  },
  dayBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  recipesSection: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
});