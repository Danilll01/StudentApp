import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'

import Tag from '../components/Tag';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme } from '@ui-kitten/components';

import FishImage from '../assets/TempFishImage.jpg';

const servingsChoises = [
    {label: '1', value: 1},
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '4', value: 4},
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
    {label: '9', value: 9},
    {label: '10', value: 10},
];


function FoodDetail({route, navigation}) {
    let recipe = route.params.route.params.recipe;
    const theme = useTheme();
    const [pickerOpen, setPickerOpen] = useState(false);
    const [currentServings, setCurrentServings] = useState(recipe.servings);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme['background-basic-color-1']}}>
            <ScrollView scrollEnabled={!pickerOpen}>
                <Image source={FishImage} style={{width: '100%', height: 200}} />
                <Text category='h1'>{recipe.title}</Text>
                <Text category='h5'>Ingredienser för {
                    <DropDownPicker style={{width: 60, flex: 1}} 
                        items={servingsChoises} 
                        value={currentServings}
                        open={pickerOpen}
                        setOpen={setPickerOpen}
                        setValue={setCurrentServings}
                        placeholder=""
                        listMode={"SCROLLVIEW"} />
                } personer</Text>
                {recipe.ingredients.map((ingredient, index) => (
                    <Text key={index} category='h6'>{ingredient.amount} {ingredient.unit} {ingredient.name}</Text>
                ))}
                <Text category=''>Det tar {recipe.cookTime} minuter</Text>
                
            </ScrollView>
        </SafeAreaView>
    );
}

export default FoodDetail;