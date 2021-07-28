import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import styles from './ScreenStyle.js';

function FoodScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Vad vill du äta idag?</Text>
        </SafeAreaView>
    );
}

export default FoodScreen;