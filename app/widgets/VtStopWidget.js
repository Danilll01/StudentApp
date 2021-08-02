import React from 'react';
import { View, Text } from 'react-native';
import styles from './WidgetStyles.js';

function VtStopWidget(props) {
    var test = "test";
    if (Object.keys(props).length != 0) {
        console.log(props.props.text);
        test = "no";
    }
    return (
        <View style={styles.basicWidget}>
            <Text h1 style={styles.basicWidgetHeader}>Chalmers + {test}</Text>
        </View>
    );
}

export default VtStopWidget;