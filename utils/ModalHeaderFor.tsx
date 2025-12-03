import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalHeaderProps {
    title: string;
    onBack: () => void;
    onSave?: () => void;
    rightText?: string;
    loading?: boolean;
    showSave?: boolean;
    backButtonTestId: string;
    rightButtonTestId: string;
}

export default function ModalHeaderFor({
    title,
    onBack,
    onSave,
    rightText = 'Save',
    loading = false,
    showSave = true,
    backButtonTestId = 'modal-back-button',
    rightButtonTestId = 'modal-save-button',
}: ModalHeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={onBack}
                style={styles.backButton}
                disabled={loading}
                testID={backButtonTestId}
            >
                <Ionicons name='chevron-back-outline' size={24} color='black' />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            {showSave && onSave ? 
                (<TouchableOpacity 
                    onPress={onSave}
                    disabled={loading}
                    style={styles.actionButton}
                    testID={rightButtonTestId}    
                >
                    <Text style={[styles.actionText, loading && styles.disabledText]}>
                        {loading ? 'Standby' : rightText}
                    </Text>
                </TouchableOpacity>)
                : 
                (<View style={{ width: 60 }} />)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'gainsboro',
    },
    backButton: {
        padding: 8,
        width: 60,
    }, 
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
        textAlign: 'center',
    },
    actionButton: {
        padding: 8,
        width: 60,
        alignItems: 'flex-end',
    },
    actionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'royalblue',
    },
    disabledText: {
        color: 'black',
    },
});