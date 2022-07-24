import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import Tag from '../components/Tag';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme } from '@ui-kitten/components';

function FoodDetail(props) {
    let recipe = props.recipe;
    const theme = useTheme();

    return (
        <SafeAreaView >
            <ScrollView>
                
                <Text>{recipe.title}</Text>
                <Text>{recipe.cookTime} minuter</Text>
                <Text>{recipe.servings} portioner</Text>
                <Text>{recipe.tags}</Text>
                <Text>{recipe.ingredients}</Text>
                
            </ScrollView>
        </SafeAreaView>
    );
}

export default FoodDetail;