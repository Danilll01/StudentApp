import React, { useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import MeatEmoji from '../assets/emojis/Meat.js';
import FishEmoji from '../assets/emojis/Fish.js';
import ChickenEmoji from '../assets/emojis/Chicken.js';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';

export default Tag = (props) => {

    return(
        <TouchableOpacity style={[tagStyle.tagRoot, props.active ? tagStyle.activated : null]} onPress={props.onPress} disabled={props.nonInteractable}>
            {getIcon(props.type)}
        </TouchableOpacity>
    );
}

function getIcon(type) {
    switch(type) {
        case 'meat':
            return <MeatEmoji />;
        case 'fish':
            return <FishEmoji />;
        case 'chicken':
            return <ChickenEmoji />;
        default:
            return <MeatEmoji />;
    }
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
