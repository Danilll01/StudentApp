import React, { useState, useRef } from 'react';
import { Platform, SafeAreaView , ScrollView, Image, Pressable, StyleSheet, LogBox } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import SimplePicker from 'react-native-simple-picker';

import { useDispatch, useSelector } from 'react-redux';
import { getCurrentTheme } from '../../redux/themeSlice';
import { addRecipe, getRecipes, removeRecipe, updateRecipe } from '../../redux/recipesSlice';


import Tag from '../../components/Tag';
import EditIngredients from './EditIngredients';
import EditInstructions from './EditInstructions';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme , Icon, Input, Select, SelectItem, Divider } from '@ui-kitten/components';

import FishImage from '../../assets/TempFishImage.jpg';
import EditPen from '../../assets/emojis/EditPen';
import Tags from '../../constants/Tags';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

LogBox.ignoreLogs(['Animated: `useNativeDriver`']);


function FoodDetail({route, navigation}) {
    let routeParams = route.params.route?.params;
    let recipeId = routeParams?.recipeId
    const recipe = useSelector(getRecipes).find(recipe => recipe.id === recipeId);
    const themeStyle = useTheme();
    const theme = useSelector(getCurrentTheme);

    // Redux dispatcher
    const dispatch = useDispatch();
    
    const [pickerOpen, setPickerOpen] = useState(false);
    const [currentServings, setCurrentServings] = useState(recipe?.servings);
    const [isEditing, setIsEditing] = useState(routeParams.isEditing || false);

    const [newTitle, setNewTitle] = useState(recipe?.title);
    const [newCooktime, setNewCooktime] = useState(recipe?.cookTime);

    const timePickerRef = useRef(null);

    // Used to make a deep copy of a json object
    const deepCopyJSON = (json) => JSON.parse(JSON.stringify(json || {})) ;
    
    // State to keep track of new ingredients
    const newIngredientsState = useState(deepCopyJSON(recipe?.ingredients));
    const [newIngredients, setNewIngredients] = newIngredientsState;

    // State to keep track of new instructions
    const newInstructionsState = useState(deepCopyJSON(recipe?.instructions));
    const [newInstructions, setNewInstructions] = newInstructionsState;

    function ToggleIsEditing() {
        setIsEditing(!isEditing);
    }

    // Renders title based on editing state
    function Title() {
        if (isEditing) {
            let [editedTitle, setEditedTitle] = useState({selected: false, text: ''});
            return (
                <Input
                    style={{paddingTop: 16, paddingBottom: 16}}
                    value={editedTitle.selected ? editedTitle.text : newTitle}
                    onFocus={() => setEditedTitle({selected: true, text: newTitle})}
                    onBlur={() => {
                        // When finished editing, update the title in the recipe and set the editing state to false
                        setNewTitle(editedTitle.text);
                        setEditedTitle({selected: false, text: ''});
                    }}
                    onChangeText={text => setEditedTitle({selected: true, text: text})}
                />
            );
        } else {
            return (
                <Text category='h1' style={{paddingTop: 16, paddingBottom: 16}}>{newTitle}</Text>
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
                        onPress={() => {
                            // Navigate back and delete the recipe
                            navigation.goBack();
                            dispatch(removeRecipe(recipeId));
                        }}
                    ></Button>
                    <Button 
                        style={{marginRight: 5}} 
                        status='danger' 
                        onPress={() => {
                            setNewTitle(recipe?.title);
                            setNewCooktime(recipe?.cooktime);
                            setNewIngredients(deepCopyJSON(recipe?.ingredients));
                            setNewInstructions(deepCopyJSON(recipe?.instructions));
                            ToggleIsEditing();
                        }}
                    >Avbryt</Button>
                    <Button 
                        style={{marginRight: 25}} 
                        status='success' 
                        onPress={() => {
                            // Save data to redux state
                            let updatedRecipe = {
                                ...recipe,
                                title: newTitle,
                                cookTime: newCooktime,
                                servings: currentServings,
                                ingredients: newIngredients.filter(ingredient => ingredient.name !== ''), // Remove empty ingredients
                                instructions: newInstructions.filter(instruction => instruction !== ''), // Remove empty instructions
                            }
                            dispatch(updateRecipe(updatedRecipe));
                            ToggleIsEditing();
                        }}
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

    function TagsComponent() {
        let nrPickerOptions = 70;
        let pickerNrInterval = 5;
        let pickerOptions = [ ...Array(nrPickerOptions).keys() ].map( i => String((i+1) * pickerNrInterval) + " min");
        let pickerTextStyle = {
            color: themeStyle['text-basic-color'], 
            fontSize: 18
        }

        if (isEditing) {
            return (
                <Layout style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => timePickerRef.current.show()}>
                        <Tag type={Tags.TIME} active={false} nonInteractable={true} text={newCooktime + " minuter"} />
                    </TouchableOpacity>

                    <SimplePicker
                        ref={timePickerRef}
                        options={pickerOptions}
                        initialOptionIndex={newCooktime / pickerNrInterval - 1}
                        onSubmit={(option) => {
                            // When finished editing, update the new cooktime state
                            setNewCooktime(parseInt(option.split(" ")[0]));
                        }}
                        styles={{
                            mainBox: {backgroundColor: themeStyle['background-basic-color-1']},
                            buttonView: [timePickerStyle.buttonView, {backgroundColor: themeStyle['background-basic-color-1']}]
                        }}
                        itemStyle={{color: themeStyle['text-basic-color']}}
                        cancelTextStyle={pickerTextStyle}
                        confirmTextStyle={pickerTextStyle}
                        >
                    </SimplePicker>

                    {recipe?.tags.map((tag, index) => {
                        return <Tag key={index} type={tag.type} active={false} nonInteractable={true} />
                    })}
                </Layout>
            )
            
        } else {
            return (
                <Layout style={{flexDirection: 'row'}}>
                    <Tag type={Tags.TIME} active={false} nonInteractable={true} text={recipe?.cookTime + " minuter"} />
                    
                    {recipe?.tags.map((tag, index) => {
                        return <Tag key={index} type={tag} active={false} nonInteractable={true} />
                    })}
                </Layout>
            )
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
                        { recipe?.ingredients?.length > 0 
                        ? recipe?.ingredients?.map((ingredient, index) => (
                            <Text key={index} category='h6'>
                                {ingredient.amount && CalculateIngredientAmount(ingredient.amount, currentServings, recipe.servings)} {ingredient.unit}
                            </Text>
                        ))
                        : <Text category='p1'>Ingredienser saknas :{"("}</Text> }
                    </Layout>

                    <Layout>
                        {recipe?.ingredients.map((ingredient, index) => (
                            <Text key={index} category='h6'>  -  {ingredient.name}</Text>
                        ))}
                    </Layout>
                </Layout>
            )
        }
    }

    function Instructions() {
        if (isEditing) {
            return (
                <EditInstructions newInstructionsState={newInstructionsState}></EditInstructions>
            )
        } else {
            return (
                <Layout style={{paddingLeft: 20}}>
                    {recipe?.instructions.map((step, index) => (
                        <Text key={index} category='h6' style={{paddingBottom: 5}}>{index+1}.  {step}</Text>
                    ))}
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
                    <TagsComponent></TagsComponent>
                    
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
                    <Text category='h5' style={{paddingBottom: 10}}>Recept</Text>
                    <Instructions></Instructions>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
}

// Calculates the amount of an ingredient based on the current servings and the original servings
function CalculateIngredientAmount(amount, currentServings, designedServings) {
    let realAmount = (amount / designedServings) * currentServings;
    let roundedAmount = Math.round(realAmount * 10) / 10;
    return roundedAmount;
}

const timePickerStyle = StyleSheet.create({
    buttonView: {
		width: '100%',
		padding: 10,
		borderTopWidth: 0.5,
		borderTopColor: 'lightgrey',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
});

export default FoodDetail;