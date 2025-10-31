import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface PantryEmptyStateProps {
    onAddItem: () => void;
}

export default function EmptyPantryState({onAddItem} : PantryEmptyStateProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Empty pantry</Text>
            <Text style={styles.subtitle}>Log an item to populate your pantry</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddItem}
            >                          
              <Text style={styles.addButtonText}>+ Add Item</Text>
            </TouchableOpacity>
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
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: 'grey',
        textAlign: 'center',
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'ghostwhite',
        fontSize: 16,
        fontWeight: '600',
  },
})