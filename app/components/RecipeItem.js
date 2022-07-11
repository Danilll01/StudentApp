import React, { useState, useEffect} from 'react';
import { StyleSheet, TouchableHighlight, Image, Pressable  } from 'react-native';

import Tag from '../components/Tag';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';

export default RecipeItem = (props) => {
    const recipeData = props.recipe;

    const [isPressed, setIsPressed] = useState(false);

    const pressStart = () => {
        setIsPressed(true);
    }

    const pressEnd = () => {
        setIsPressed(false);
    }

    return(
        <Pressable style={[recipeStyle.root, isPressed ? {backgroundColor: 'grey'} : null ]} 
            onPressIn={pressStart}
            onPressOut={pressEnd}>
            
                <Image></Image>
                
                <Layout style={recipeStyle.titleDiv}>
                    <Text category='h6'>{recipeData.title}</Text>
                    <Text category='h6' style={{marginLeft: 'auto'}}>{recipeData.cookTime} min</Text>
                </Layout>
                <Layout style={{backgroundColor: 'transparent'}}>
                    {recipeData.tags.map((tag, index) => (
                            <Tag key={index} type={tag} active={false} nonInteractable={true} />
                        )
                    )}
                </Layout>
        </Pressable >
    );
}

const recipeStyle = StyleSheet.create({
    root: {
        flexDirection: 'column-reverse',
        backgroundColor: '#C8C8C8',
        height: 190,
        borderRadius: 20,
        marginBottom: 14,
    },
    titleDiv: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#EDEDED',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    }
})