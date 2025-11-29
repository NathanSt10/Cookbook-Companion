import { StyleSheet, Text, View } from "react-native";

interface PantryStatsProps {
    totalItems: number;
    lowStockCount: number;
    categoryCount: number;
}

export default function PantryStats({ totalItems, lowStockCount, categoryCount } : PantryStatsProps) {
    return (
        <View style={styles.container}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalItems}</Text>
                {(totalItems === 1)
                   ? <Text style={styles.statLabel}>Pantry Item</Text> 
                   : <Text style={styles.statLabel}>Pantry Items</Text>
                }
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{lowStockCount}</Text>
                <Text style={styles.statLabel}>Low Stock</Text>
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{categoryCount}</Text>
                {(categoryCount === 1)
                  ? <Text style={styles.statLabel}>Category Item</Text>
                  : <Text style={styles.statLabel}>Category Items</Text>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'ghostwhite',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize:32,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: 'black'
    },
});