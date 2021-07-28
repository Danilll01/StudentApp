import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';
import styles from './ScreenStyle.js'

function HomeScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Home!</Text>
        </SafeAreaView>
    );
}

export default HomeScreen;