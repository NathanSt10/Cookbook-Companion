import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PreferenceDisplayCardProps {
    title: string;
    items: string[] | undefined;
    emptyMessage?: string;
}

export default function PreferenceCard({
    title, 
    items, 
    emptyMessage=`No ${title.toLowerCase()} set`,
} : PreferenceDisplayCardProps) {

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>

            {items && items.length > 0 ?
                (<View style={styles.itemsContainer}>
                    {items.map((item: string, index: number) => (
                        <View key={index} style={styles.item}>
                            <Text style={styles.itemText}>{item}</Text>
                        </View>))}
                </View>)
                :
                ( <Text style={styles.emptyText}>{emptyMessage}</Text> )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "ghostwhite",
        borderRadius: 12,
        padding: 16, 
        marginBottom: 16, 
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        marginBottom: 12,
    },
    itemsContainer: {
        gap: 8,
    },
    item: {
        backgroundColor: "whitesmoke",
        padding: 12,
        borderRadius: 8,
        elevation: 5, 
    },
    itemText: {
        fontSize: 16,
        color: "black",
    },
    emptyText: {
        fontSize: 14,
        color: "gainsboro",
        fontStyle: "italic",
        textAlign: "center",
        paddingVertical: 8,
    },
});