import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView, Image, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'

import { useDispatch, useSelector } from 'react-redux';
import { getCurrentTheme } from '../../redux/themeSlice';


import Tag from '../../components/Tag';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme , Icon, Input, Select, SelectItem } from '@ui-kitten/components';

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
        if (isEditing) {
            let defaultTextEdit = {editingIndex:-1, text:''}
            // Used to keep track of which ingredient is being edited and only update newIngredients when the user is done editing
            let [currTextEdit, setCurrentTextEdit] = useState(defaultTextEdit);

            return (
                <Layout style={{padding: 10, paddingTop: 0}}>
                    <Layout style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
                        <Layout style={{flex: 1, flexDirection: 'row'}}>
                            <Text category='h6' style={{flex: 1}}>Mängd</Text>
                            <Text category='h6' style={{flex: 1}}>Enhet</Text>
                            <Text category='h6' style={{flex: 2}}>Ingrediens</Text>
                        </Layout>
                    </Layout>

                    {/*Loops through all ingredients and renders them*/}
                    {newIngredients.map((ingredient, index) => {
                        return (
                            <Layout key={index} style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
                                <Layout style={{flex: 1, flexDirection: 'row'}}>
                                    <Input style={{flex: 1}} 
                                        value={currTextEdit.editingIndex === index ? currTextEdit.text : String(ingredient.amount)} 
                                        onChangeText={text => setCurrentTextEdit({text,editingIndex:index})}
                                        // The input field is in focus
                                        onFocus={() => setCurrentTextEdit({editingIndex: index, text: String(ingredient.amount)})}
                                        // The input lost focus
                                        onBlur={() => {
                                            // Update newIngredients with the new value
                                            setNewIngredients(newIngredients.map((ingredient, i) => {
                                                if (i === index) {
                                                    ingredient.amount = Number(currTextEdit.text);
                                                }
                                                return ingredient;
                                            }));
                                            setCurrentTextEdit(defaultTextEdit)
                                        }}
                                    ></Input>

                                    <Select style={{flex: 1, paddingLeft: 8, paddingRight: 8}} value={ingredient.unit} accessoryRight={null}>
                                        <SelectItem title='g'/>
                                        <SelectItem title='kg'/>
                                        <SelectItem title='dl'/>
                                        <SelectItem title='l'/>
                                        <SelectItem title='st'/>
                                    </Select>

                                    <Text category='h6' style={{flex: 2}}>{ingredient.name}</Text>
                                </Layout>
                            </Layout>
                        );
                    })}
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