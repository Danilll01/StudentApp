import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import styles from './ScreenStyle.js'
import BasicWidget from '../widgets/BasicWidget.js';

function TransportScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Kollektivtrafik</Text>
            <View style={styles.widgetArea}>
                <BasicWidget></BasicWidget>
                <BasicWidget></BasicWidget>
                <BasicWidget></BasicWidget>
            </View>
        </SafeAreaView>
    );
}

export default TransportScreen;