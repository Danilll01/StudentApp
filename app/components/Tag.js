import React, { useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Tags from '../constants/Tags';

import MeatEmoji from '../assets/emojis/Meat.js';
import FishEmoji from '../assets/emojis/Fish.js';
import ChickenEmoji from '../assets/emojis/Chicken.js';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme } from '@ui-kitten/components';

export default Tag = ({active, onPress, nonInteractable, type}) => {
    const themeStyle = useTheme();


    const defaultBGColor = themeStyle['background-basic-color-2'];
    const activatedBGColor = themeStyle['background-basic-color-3'];
    const BGColor = active ? activatedBGColor : defaultBGColor;

    const rootStyle = [tagStyle.tagRoot, {backgroundColor: BGColor}];

    const containerStyle = [tagStyle.tagContainer, {backgroundColor: BGColor}];

    const defaultBorderStyle = {
        borderColor: defaultBGColor,
        borderWidth: 1.5,
    };
    const activatedBorderStyle = {
        borderColor: themeStyle['border-primary-color-1'],
        borderWidth: 1.5,
    };
    const borderStyle = active ? activatedBorderStyle : defaultBorderStyle;

    return(
        <TouchableOpacity style={[rootStyle, borderStyle]} onPress={onPress} disabled={nonInteractable}>
            <Layout style={containerStyle}>
                {getIcon(type)}
                <Text style={{backgroundColor: BGColor}}>15 min</Text>
            </Layout>
        </TouchableOpacity>
    );
}

function getIcon(type) {
    switch(type) {
        case Tags.MEAT:
            return <MeatEmoji />;
        case Tags.FISH:
            return <FishEmoji />;
        case Tags.CHICKEN:
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
        borderColor: '#EEEEEF',
        borderWidth: 1.5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginRight: 10,
    },
    tagContainer: {
        flexDirection: 'row',
        margin: 10,
    },
})
