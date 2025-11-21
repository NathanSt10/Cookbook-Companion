import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface LoadingViewProps {
    page: string;
}

export default function LoadingViewFor({page} : LoadingViewProps) {
    return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size='large' color='black' />
            <Text style={styles.loadingText}>Loading {page}...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: 'black',
    },
})