import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyMealStateProps {
  title?: string;
  subtitle?: string;
}

export default function EmptyMealState({ 
  title = 'No meals planned',
  subtitle = 'Browse recipes and add them to this date'
}: EmptyMealStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});