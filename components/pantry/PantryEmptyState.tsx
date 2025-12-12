import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PantryEmptyStateProps {
    onAddItem: () => void;
}

export default function EmptyPantryState({onAddItem} : PantryEmptyStateProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Empty pantry</Text>
            
            <Text style={styles.subtitle}>Log an item to populate your pantry</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
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
})