import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FloatingActionButtonProps {
    onPress: () => void;
}

export default function FloatingActionButton({onPress} : FloatingActionButtonProps) {
    return (
        <View>
            <TouchableOpacity   
                style={styles.fab}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: 'ghostwhite',
    fontWeight: '300',
  },
})