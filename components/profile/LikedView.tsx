import { StyleSheet, Text, View } from 'react-native';

interface LikedViewProps {
    items: String[];
    
}

export default function LikedView() {
    return(
        <View>
            <Text>Liked</Text>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        
    }
});