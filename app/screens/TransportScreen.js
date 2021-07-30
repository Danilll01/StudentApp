import React from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import styles from './ScreenStyle.js'
import VtStopWidget from '../widgets/VtStopWidget.js';

function TransportScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.headerText}>Kollektivtrafik</Text>
                <View style={styles.widgetArea}>
                    <VtStopWidget></VtStopWidget>
                    <VtStopWidget></VtStopWidget>
                    <VtStopWidget></VtStopWidget>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default TransportScreen;