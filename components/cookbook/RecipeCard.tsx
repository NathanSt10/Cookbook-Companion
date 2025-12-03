import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecipeCardProps {
  fireId?: string;
  recipeId: number;
  title: string;
  image: string;
  tags?: string[];
  cookTime: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onPress?: () => void;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  showIngredientMatch?: boolean;
}

export default function RecipeCard({
  recipeId,
  title,
  image,
  cookTime,
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  onPress,
  usedIngredientCount,
  missedIngredientCount,
  showIngredientMatch = false,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  const totalIngredients = (usedIngredientCount || 0) + (missedIngredientCount || 0);
  const matchPercentage = totalIngredients > 0
                            ? Math.round(((usedIngredientCount || 0) / totalIngredients) * 100)
                            : 0;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >

      <View style={styles.iconsRow}>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          style={styles.iconButton}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={24} 
            color={liked ? "red" : "white"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          style={styles.iconButton}
        >
          <Ionicons 
            name={saved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={saved ? "royalblue" : "white"} 
          />
        </TouchableOpacity>
      </View>

      {showIngredientMatch && usedIngredientCount !== undefined && (
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{matchPercentage}% Match</Text>
        </View> )
      }

      <Image 
        source={{ uri: image }} 
        style={styles.recipeImage}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text style={styles.timeText}>{cookTime} min</Text>
        </View>

        {showIngredientMatch && usedIngredientCount !== undefined && (
          <View style={styles.ingredientRow}>
            <Ionicons name='checkmark-circle' size={16} color='green' />
            <Text style={styles.metaText}>{usedIngredientCount}/{totalIngredients}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconsRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // transparent black
    borderRadius: 20,
    padding: 8,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    backgroundColor: 'gainsboro',
  },
  infoContainer: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: 'grey',
    fontWeight: '500',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: 'grey',
    fontWeight: '500',
  },
  matchBadge: {
    position: 'absolute',
    bottom: 130,
    right: 8,
    backgroundColor: 'green',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  matchText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
});