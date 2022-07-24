import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import Tag from '../components/Tag';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme } from '@ui-kitten/components';

function FoodDetail({route, navigation}) {
    let recipe = route.params.route.params.recipe;
    const theme = useTheme();

    return (
        <SafeAreaView >
            <ScrollView>
                
                <Text category='h1'>{recipe.title}</Text>
                
            </ScrollView>
        </SafeAreaView>
    );
}

export default FoodDetail;