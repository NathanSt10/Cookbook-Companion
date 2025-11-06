import { StyleSheet, View, Text, ScrollView } from 'react-native';
import FloatingActionButton from '../FloatingActionButton';

interface EmptyStateProps {
    tab: string;
    onAddItem: () => void;
}

export default function EmptyStateFor({tab, onAddItem} : EmptyStateProps) { 

    return (
        <ScrollView>
            <Text style={styles.titleText}>Empty {tab} collection</Text>

            <Text style={styles.subtitleText}>Click the + button to add to this collection</Text>  

            <View style={styles.fabRealign}>
                <FloatingActionButton onPress={onAddItem} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 600,
        color: 'black',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 14,
        color: 'grey',
        textAlign: 'center',
        marginBottom: 15,
    },
    fabRealign: {
        bottom: -484,
    },
})