import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PantryStatsProps {
    totalItems: number;
    lowStockCount: number;
    categoryCount: number;
    agingCount: number;
    urgentCount: number;
    onFilterByStatus?: (status: 'all' | 'lowStock' | 'aging' | 'urgent') => void;
    selectedStatus?: 'all' | 'lowStock' | 'aging' | 'urgent';
}

export default function PantryStats({ 
  totalItems, 
  lowStockCount, 
  categoryCount,
  agingCount,
  urgentCount,
  onFilterByStatus,
  selectedStatus = 'all',
} : PantryStatsProps) {
    return (
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.wrapper}
          contentContainerStyle={styles.container}  
        >
            <TouchableOpacity 
              style={[
                styles.statCard,
                selectedStatus === 'all' && styles.selectedCard
              ]}
              onPress={() => onFilterByStatus?.('all')}
              activeOpacity={0.8}
            >
                <Text style={styles.statNumber}>{totalItems}</Text>
                <Text style={styles.statLabel}>
                  {totalItems === 1 ? 'Pantry Item' : 'Pantry Items'}
                </Text>
            </TouchableOpacity>

            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{categoryCount}</Text>
                <Text style={styles.statLabel}>
                  {categoryCount === 1 ? 'Category' : 'Categories'}
                </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.statCard,
                styles.warningCard,
                selectedStatus === 'lowStock' && styles.selectedCard
              ]}
              onPress={() => onFilterByStatus?.('lowStock')}
              activeOpacity={0.8}
            >
                <Text style={styles.statNumber}>{lowStockCount}</Text>
                <Text style={styles.statLabel}>Low Stock</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.statCard,
                styles.agingCard,
                selectedStatus === 'aging' && styles.selectedCard
              ]}
              onPress={() => onFilterByStatus?.('aging')}
              activeOpacity={0.8}
            >
                <Text style={styles.statNumber}>{agingCount}</Text>
                <Text style={styles.statLabel}>
                  {agingCount === 1 ? 'Aging Item' : 'Aging Items'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statCard,
                styles.urgentCard,
                selectedStatus === 'urgent' && styles.selectedCard
              ]}
              onPress={() => onFilterByStatus?.('urgent')}
              activeOpacity={0.8}
            >
                <Text style={styles.statNumber}>{urgentCount}</Text>
                <Text style={styles.statLabel}>
                  {urgentCount === 1 ? 'Urgent Item' : 'Urgent Items'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
      maxHeight: 116,
    },
    container: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 4,
    },
    statCard: {
        width: 120,
        height: 100,
        backgroundColor: 'ghostwhite',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: 'royalblue',
        backgroundColor: 'aliceblue',
    },
    warningCard: {
        borderLeftWidth: 4,
        borderLeftColor: 'goldenrod',
    },
    agingCard: {
        borderLeftWidth: 4,
        borderLeftColor: 'darkorange',
    },
    urgentCard: {
        borderLeftWidth: 4,
        borderLeftColor: 'firebrick',
    },
});