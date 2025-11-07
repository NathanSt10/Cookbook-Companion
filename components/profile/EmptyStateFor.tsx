import { StyleSheet, View, Text } from 'react-native';
import FloatingActionButton from '../FloatingActionButton';

interface EmptyStateProps {
    tab: string;
    onAddItem: () => void;
}

export default function EmptyStateFor({tab, onAddItem} : EmptyStateProps) { 

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Empty {tab} collection</Text>
            <Text style={styles.subtitleText}>Click the + button to add to this collection</Text>  
            <View style={styles.fabWrap} pointerEvents="box-none">
                <FloatingActionButton onPress={onAddItem} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 280,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    titleText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 14,
        color: 'grey',
        textAlign: 'center',
        marginBottom: 15,
    },
    tabContent: {
        position: 'relative',
    },
    fabWrap: {
        position: 'absolute',
        bottom: -270,
        zIndex: 10,
        elevation: 10,
    },
});