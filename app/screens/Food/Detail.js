import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView, Image, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'

import { useDispatch, useSelector } from 'react-redux';
import { getCurrentTheme } from '../../redux/themeSlice';


import Tag from '../../components/Tag';
import EditIngredients from './EditIngredients';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme , Icon, Input, Select, SelectItem, Divider } from '@ui-kitten/components';

import FishImage from '../../assets/TempFishImage.jpg';
import EditPen from '../../assets/emojis/EditPen';
import Tags from '../../constants/Tags';

// List of servings choices
const servingsChoices = [
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
    const theme = useSelector(getCurrentTheme);
    
    const [pickerOpen, setPickerOpen] = useState(false);
    const [currentServings, setCurrentServings] = useState(recipe.servings);
    const [isEditing, setIsEditing] = useState(false);

    const [newTitle, setNewTitle] = useState(recipe.title);
    const newIngredientsState = useState(recipe.ingredients);
    const [newIngredients, setNewIngredients] = newIngredientsState;

    function ToggleIsEditing() {
        setIsEditing(!isEditing);
    }

    // Renders title based on editing state
    function Title() {
        if (isEditing) {
            return (
                <Input
                    style={{paddingTop: 16, paddingBottom: 16}}
                    value={newTitle}
                    onChangeText={text => setNewTitle(text)}
                />
            );
        } else {
            return (
                <Text category='h1' style={{paddingTop: 16, paddingBottom: 16}}>{recipe.title}</Text>
            );
        }
    }

    function EditButton() {
        if (isEditing) {
            return (
                <>
                    <Button
                        style={{marginLeft: 'auto', marginRight: 5}} 
                        status='danger'
                        accessoryLeft={<Icon name='trash-2-outline' style={{width: 42, height: 42, marginLeft: 15}}/>}
                    ></Button>
                    <Button 
                        style={{marginRight: 5}} 
                        status='danger' 
                    >Avbryt</Button>
                    <Button 
                        style={{marginRight: 25}} 
                        status='success' 
                        onPress={ToggleIsEditing}
                    >Spara</Button>
                </>
                
            );
        } else {
            return (
                <Pressable style={{marginLeft: 'auto', marginRight: 25, padding: 5}} onPress={ToggleIsEditing}>
                    <EditPen></EditPen>
                </Pressable>
            );
        }
    }

    function Ingredients() {
        if (isEditing) {
            return (
                <EditIngredients newIngredientsState={newIngredientsState}></EditIngredients>
            );
        } else {
            return (
                <Layout style={{flex: 1, flexDirection: 'row'}}>
                    <Layout style={{paddingLeft: 20}}>
                        {recipe.ingredients.map((ingredient, index) => (
                            <Text key={index} category='h6'>
                                {ingredient.amount && CalculateIngredientAmount(ingredient.amount, currentServings, recipe.servings)} {ingredient.unit}
                            </Text>
                        ))}
                    </Layout>

                    <Layout>
                        {recipe.ingredients.map((ingredient, index) => (
                            <Text key={index} category='h6'>  -  {ingredient.name}</Text>
                        ))}
                    </Layout>
                </Layout>
            )
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: themeStyle['background-basic-color-1']}}>

            {/* Header */}
            <Layout style={{height: 60, flexDirection: 'row', alignItems: 'center'}}>
                <Icon name='arrow-back' fill={themeStyle['text-basic-color']} style={{width: 42, height: 42, marginLeft: 15}} onPress={() => navigation.goBack()}/>
                <EditButton></EditButton>
            </Layout>

            <ScrollView scrollEnabled={!pickerOpen}>
                <Image source={FishImage} style={{width: '100%', height: 200}} />
                <Layout style={{paddingLeft: 8, paddingRight: 8}}>

                    <Title></Title>
                    
                    {/* Renders all tags + time to cook */}
                    <Layout style={{flexDirection: 'row'}}>
                        <Tag type={Tags.TIME} active={false} nonInteractable={true} text={recipe.cookTime + " minuter"} />

                        {recipe.tags.map((tag, index) => {
                            return <Tag key={index} type={tag.type} active={false} nonInteractable={true} />
                        })}
                    </Layout>
                    
                    {/* Renders the servings picker */}
                    <Layout style={{flex: 1, flexDirection: 'row', zIndex: 100, alignItems: 'center'}}>
                        <Text category='h5' >Ingredienser för </Text>
                        <DropDownPicker style={{width: 60}}
                            containerStyle={{width: 60}} 
                            items={servingsChoices} 
                            value={currentServings}
                            open={pickerOpen}
                            setOpen={setPickerOpen}
                            setValue={setCurrentServings}
                            placeholder=""
                            listMode={"SCROLLVIEW"}
                            theme={theme.toUpperCase()} />
                        <Text category='h5'> personer</Text>
                    </Layout>

                    {/* Renders all ingredients */}
                    <Ingredients></Ingredients>

                    {/* Renders the instructions */}
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

// Calculates the amount of an ingredient based on the current servings and the original servings
function CalculateIngredientAmount(amount, currentServings, designedServings) {
    let realAmount = (amount / designedServings) * currentServings;
    return realAmount;
}

export default FoodDetail;