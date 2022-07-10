import React, { useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from "react-native-svg"

import MeatEmoji from '../assets/emojis/Meat.js';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';

export default Tag = (props) => {
    const [active, setActive] = useState(false);


    return(
        <TouchableOpacity style={[tagStyle.tagRoot, props.active ? tagStyle.activated : null]} onPress={props.onPress}>
            <MeatEmoji />
        </TouchableOpacity>
    );
}

function getImage() {
    return null;
}

const tagStyle = StyleSheet.create({
    tagRoot: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#EEEEEF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 52,
        height: 40,
        marginRight: 10,
    },
    activated: {
        backgroundColor: '#CCCCCC',
        borderColor: '#007AFF',
        borderWidth: 1.5,
    }
})
