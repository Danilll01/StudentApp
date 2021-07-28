import React from 'react';
import { View, Text } from 'react-native';
import styles from './WidgetStyles.js';

function BasicWidget(props) {
    return (
        <View style={styles.basicWidget}>
            <Text>Hello gajs2</Text>
        </View>
    );
}

export default BasicWidget;