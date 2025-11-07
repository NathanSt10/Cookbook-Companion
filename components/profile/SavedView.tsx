import { StyleSheet, Text, View } from 'react-native';

interface SavedViewProps {
    savedItems: String[];
}

export default function SavedView() {
    return(
        <View>
            <Text>Saved</Text>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        
    }
});