import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView, Image, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'

import { useDispatch, useSelector } from 'react-redux';
import { getCurrentTheme } from '../../redux/themeSlice';


import Tag from '../../components/Tag';

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

const units = [
    'g',
    'kg',
    'l',
    'dl',
    'ml',
    'st'
];

function FoodDetail({route, navigation}) {
    let recipe = route.params.route.params.recipe;
    const themeStyle = useTheme();
    const theme = useSelector(getCurrentTheme);
    
    const [pickerOpen, setPickerOpen] = useState(false);
    const [currentServings, setCurrentServings] = useState(recipe.servings);
    const [isEditing, setIsEditing] = useState(false);

    const [newTitle, setNewTitle] = useState(recipe.title);
    const [newIngredients, setNewIngredients] = useState(recipe.ingredients);

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
                <Button style={{marginLeft: 'auto', marginRight: 25}} onPress={ToggleIsEditing}>Spara</Button>
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
        let defaultTextEdit = {editingIndex:-1, text:''}
        // Used to keep track of which ingredient is being edited and only update newIngredients when the user is done editing
        let [currEditAmount, setCurrentEditAmount] = useState(defaultTextEdit);
        let [currEditUnit, setCurrentEditUnit] = useState(defaultTextEdit);
        let [currEditName, setCurrentEditName] = useState({editingIndex:-1, selectedIndex: -1});


        if (isEditing) {
            return (
                <Layout style={{padding: 10, paddingTop: 0}}>
                    {/*Loops through all ingredients and renders them*/}
                    {newIngredients.map((ingredient, index) => {
                        return (
                            <Layout key={index} style={{flexDirection: 'column', paddingBottom: 5}}>
                                {/* Inputfield for ingredient name */}
                                <Input style={{flex: 1}} label='Ingredient'
                                    value={currEditName.editingIndex === index ? currEditName.text : ingredient.name}
                                    onChangeText={text => setCurrentEditName({text,editingIndex:index})}
                                    // The input field is in focus
                                    onFocus={() => setCurrentEditName({editingIndex: index, text: ingredient.name})}
                                    // The input lost focus
                                    onBlur={() => {
                                        // Update newIngredients with the new value
                                        updateIngredientsArray(index, 'name', currEditName.text);
                                        setCurrentEditName(defaultTextEdit)
                                    }}
                                ></Input>
                                <Layout style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    {/* Inputfield for ingredient amount */}
                                    <Input style={{flex: 1}} label='Mängd'
                                        value={currEditAmount.editingIndex === index ? currEditAmount.text : (ingredient.amount ? String(ingredient.amount) : '')} 
                                        onChangeText={text => setCurrentEditAmount({text, editingIndex:index})}
                                        // The input field is in focus
                                        onFocus={() => setCurrentEditAmount({editingIndex: index, text: (ingredient.amount ? String(ingredient.amount) : '')})}
                                        // The input lost focus
                                        onBlur={() => {
                                            // Update newIngredients with the new value
                                            updateIngredientsArray(index, 'amount', Number(currEditAmount.text));
                                            setCurrentEditAmount(defaultTextEdit);
                                        }}
                                    ></Input>

                                    {/* The unit selection is rendered as a dropdown */}
                                    <Select style={{flex: 1, paddingLeft: 6, paddingRight: 6}} label='Enhet'
                                        value={currEditUnit.editingIndex === index ? units[currEditUnit.selectedIndex] : ingredient.unit}
                                        onSelect={(unit) => {
                                            updateIngredientsArray(index, 'unit', units[unit.row]);
                                            setCurrentEditUnit({editingIndex: -1, selectedIndex: -1});
                                        }}>

                                        {units.map((unit, index) => {
                                            return (
                                                <SelectItem key={index} title={unit} />
                                            );
                                        })}
                                    </Select>
                                    <Button 
                                        style={{flex: 1, margin: 15}} 
                                        status='danger' 
                                        size='small' 
                                        accessoryLeft={<Icon name='trash-2-outline' style={{width: 42, height: 42, marginLeft: 15}}/>}
                                        >Ta bort</Button>
                                </Layout>
                                <Divider style={{backgroundColor: themeStyle['color-basic-600'], height: 3}}></Divider>
                            </Layout>
                        );
                    })}
                    <Layout style={{flex: 1, flexDirection: 'row'}}>
                        <Button style={{margin: 5}}>Lägg till</Button>
                    </Layout>
                    
                </Layout>
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

        // Updates the ingredient amount in newIngredients
        function updateIngredientsArray(index, key, value) {
            setNewIngredients(newIngredients.map((ingredient, i) => {
                if (i === index) {
                    ingredient[key] = value;
                }
                return ingredient;
            }));
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