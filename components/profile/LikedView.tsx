import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLikedRecipes } from '../../hooks/useLikedRecipes';
import RecipeCard from "../calendar/RecipeCard";

interface LikedViewProps {
    onRemove?: () => void;
    showRemoveButton?: boolean;
    
}

export default function LikedView({ onRemove, showRemoveButton = true }: LikedViewProps) {
    const { likedRecipes, loading, error, removeLikedRecipe } = useLikedRecipes();

    const handleRemove = async (fireId: string) => {
        try {
            await removeLikedRecipe(fireId);
            onRemove?.();
        } catch (error) {
            console.error('Failed to remove recipe:', error);
        }
    };
    
    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Error loading recipes: {error.message}</Text>
            </View>
        );
    }
    
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Liked Recipes</Text>
            {likedRecipes.length === 0 ? (
                <Text style={styles.emptyText}>No liked recipes yet</Text>
            ) : (
                <View style={styles.listContent}>
                    {likedRecipes.map((item) => (
                        <RecipeCard
                            key={item.fireId}
                            title={item.title}
                            image={item.image}
                            onPress={() => router.push(`/recipe/${item.recipeId}`)}
                            onRemove={showRemoveButton ? () => handleRemove(item.fireId) : undefined}
                            showRemoveButton={showRemoveButton}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 32,
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        textAlign: 'center',
    },
    listContent: {
        gap: 12,
    }
});