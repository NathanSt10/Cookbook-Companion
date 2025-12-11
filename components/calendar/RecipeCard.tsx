import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecipeCardProps {
  title: string;
  image?: string;
  onRemove?: () => void;
  onPress?: () => void;
  showRemoveButton?: boolean;
}

export default function RecipeCard({ 
  title, 
  image, 
  onRemove,
  onPress,
  showRemoveButton = true 
}: RecipeCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {image 
        ? (<Image source={{ uri: image }} style={styles.image} />) 
        : (<View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>🍽️</Text>
           </View>
          )
      }
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {showRemoveButton && onRemove && (
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={(e) => {
            e.stopPropagation(); // Prevents card press when clicking remove
            onRemove();
          }}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: 'ghostwhite',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 18,
    color: 'firebrick',
  },
});