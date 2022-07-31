import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'

import { useDispatch, useSelector } from 'react-redux';

import Tag from '../components/Tag';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme } from '@ui-kitten/components';

import FishImage from '../assets/TempFishImage.jpg';
import Tags from '../constants/Tags';

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
    const themeStyle = useTheme();
    const theme = useSelector((state) => state.theme).currentTheme;
    
    const [pickerOpen, setPickerOpen] = useState(false);
    const [currentServings, setCurrentServings] = useState(recipe.servings);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: themeStyle['background-basic-color-1']}}>
            <ScrollView scrollEnabled={!pickerOpen}>
                <Image source={FishImage} style={{width: '100%', height: 200}} />
                <Layout style={{paddingLeft: 8, paddingRight: 8}}>
                    
                    <Text category='h1' style={{paddingTop: 16, paddingBottom: 16}}>{recipe.title}</Text>
                    
                    {/* Renders all tags + time to cook */}
                    <Layout style={{flexDirection: 'row'}}>
                        <Tag type={Tags.TIME} active={false} nonInteractable={true} text={recipe.cookTime + "minuter"} />

                        {recipe.tags.map((tag, index) => {
                            return <Tag key={index} type={tag.type} active={false} nonInteractable={true} />
                        })}
                    </Layout>
                    
                    
                    <Layout style={{flex: 1, flexDirection: 'row', zIndex: 100, alignItems: 'center'}}>
                        <Text category='h5' >Ingredienser för </Text>
                        <DropDownPicker style={{width: 60}}
                            containerStyle={{width: 60}} 
                            items={servingsChoises} 
                            value={currentServings}
                            open={pickerOpen}
                            setOpen={setPickerOpen}
                            setValue={setCurrentServings}
                            placeholder=""
                            listMode={"SCROLLVIEW"}
                            theme={theme.toUpperCase()} />
                        <Text category='h5'> personer</Text>
                    </Layout>

                    
                    <Layout style={{flex: 1, flexDirection: 'row'}}>
                        <Layout style={{paddingLeft: 20}}>
                            {recipe.ingredients.map((ingredient, index) => (
                                <Text key={index} category='h6'>{ingredient.amount} {ingredient.unit}</Text>
                            ))}
                        </Layout>

                        <Layout>
                            {recipe.ingredients.map((ingredient, index) => (
                                <Text key={index} category='h6'>  -  {ingredient.name}</Text>
                            ))}
                        </Layout>
                        
                    </Layout>

                    <Text category='h5'>Recept</Text>
                    <Layout style={{paddingLeft: 20}}>
                        {recipe.instructions.map((step, index) => (
                            <Text key={index} category='h6' style={{paddingBottom: 5}}>{index+1}.  {step}</Text>
                        ))}
                    </Layout>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
}

export default FoodDetail;