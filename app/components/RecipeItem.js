import React, { useState, useEffect} from 'react';
import { StyleSheet, TouchableHighlight, ImageBackground, Pressable  } from 'react-native';

import Tag from '../components/Tag';

import FishImage from '../assets/TempFishImage.jpg';

// UI library 
import * as eva from '@eva-design/eva';
import { useTheme, ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';

export default RecipeItem = (props) => {
    const recipeData = props.recipe.item;

    const theme = useTheme();

    const [isPressed, setIsPressed] = useState(false);

    const pressStart = () => {
        setIsPressed(true);
    }

    // Navigate to FoodDetail screen
    const pressEnd = () => {
        setIsPressed(false);
    }

    return(
        <Pressable style={[recipeStyle.root, isPressed ? {backgroundColor: 'grey'} : null , {backgroundColor: theme['background-basic-color-3']}]} 
            onPressIn={pressStart}
            onPressOut={pressEnd}
            onPress={(event) => {
                props.navigation.navigate('Mat', {screen: 'FoodDetail', recipe: recipeData})
            }}>
            
            <ImageBackground source={FishImage} style={{width: '100%', height: '100%', flexDirection: 'column-reverse'}} imageStyle={{borderRadius: 20}}>
            
                {/* Title and cook time */}
                <Layout style={[recipeStyle.titleDiv, {backgroundColor: theme['background-basic-color-2'],}]}>
                    <Text category='h6'>{recipeData.title}</Text>
                    <Text category='h6' style={{marginLeft: 'auto'}}>{recipeData.cookTime} min</Text>
                </Layout>

                {/* Layer all tags ontop of image */}
                <Layout style={{backgroundColor: 'transparent', flexDirection: 'row', paddingLeft: 5, paddingBottom: 5}}>
                    {recipeData.tags.map((tag, index) => (
                            <Tag key={index} type={tag} active={false} nonInteractable={true} />
                        )
                    )}
                </Layout>
            </ImageBackground>
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
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity:  0.22,
        shadowRadius: 8.22,
        elevation: 12
    },
    titleDiv: {
        flexDirection: 'row',
        height: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    }
})