import React from 'react';
import { View, Text } from 'react-native';
import styles from './WidgetStyles.js';

function VtStopWidget(props) {
    return (
        <View style={styles.basicWidget}>
            <Text h1 style={styles.basicWidgetHeader}>Chalmers</Text>
        </View>
    );
}

export default VtStopWidget;