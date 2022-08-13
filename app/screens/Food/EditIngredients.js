import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView, Image, Pressable } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { getCurrentTheme } from '../../redux/themeSlice';

import Units from '../../constants/Units';

// UI library 
import * as eva from '@eva-design/eva';
import { Layout, Text, Card, Button, useTheme , Icon, Input, Select, SelectItem, Divider } from '@ui-kitten/components';

import PropTypes from 'prop-types';

const defaultIngredient = {
    name: '',
    amount: 0,
    unit: '',
}

EditIngredients.propTypes = {
    newIngredientsState: PropTypes.array.isRequired,
}

function EditIngredients({ newIngredientsState }) {
    const themeStyle = useTheme();

    const [newIngredients, setNewIngredients] = newIngredientsState;

    let defaultTextEdit = {editingIndex:-1, text:''}
    // Used to keep track of which ingredient is being edited and only update newIngredients when the user is done editing
    let [currEditAmount, setCurrentEditAmount] = useState(defaultTextEdit);
    let [currEditUnit, setCurrentEditUnit] = useState(defaultTextEdit);
    let [currEditName, setCurrentEditName] = useState({editingIndex:-1, selectedIndex: -1});

    return (
        <Layout style={{padding: 10, paddingTop: 0}}>
            {/*Loops through all ingredients and renders them*/}
            {newIngredients.map((ingredient, index) => {
                let formattedIngredientAmount = ingredient.amount ? String(ingredient.amount) : ''
                return (
                    <Layout key={index} style={{flexDirection: 'column', paddingBottom: 11}}>
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
                                value={currEditAmount.editingIndex === index ? currEditAmount.text : formattedIngredientAmount} 
                                onChangeText={text => {
                                    // Check if the input is a number
                                    if (/^\d+$/.test(text[text.length-1])){
                                        setCurrentEditAmount({text, editingIndex: index});
                                    }
                                }}
                                // The input field is in focus
                                onFocus={() => setCurrentEditAmount({editingIndex: index, text: formattedIngredientAmount})}
                                // The input lost focus
                                onBlur={() => {
                                    // Update newIngredients with the new value
                                    updateIngredientsArray(index, 'amount', Number(currEditAmount.text));
                                    setCurrentEditAmount(defaultTextEdit);
                                }}
                            ></Input>

                            {/* The unit selection is rendered as a dropdown */}
                            <Select style={{flex: 1, paddingLeft: 6, paddingRight: 6}} label='Enhet'
                                value={currEditUnit.editingIndex === index ? Object.values(Units)[currEditUnit.selectedIndex] : ingredient.unit}
                                onSelect={(unit) => {
                                    updateIngredientsArray(index, 'unit', Object.values(Units)[unit.row]);
                                    setCurrentEditUnit({editingIndex: -1, selectedIndex: -1});
                                }}>

                                {Object.keys(Units).map((unit, index) => {
                                    return (
                                        <SelectItem key={index} title={unit.toLowerCase()} />
                                    );
                                })}
                            </Select>
                            <Button 
                                style={{flex: 1, margin: 15}} 
                                status='danger' 
                                size='small' 
                                accessoryLeft={<Icon name='trash-2-outline' style={{width: 42, height: 42, marginLeft: 15}}/>}
                                onPress={() => removeIngredient(index)}
                                >Ta bort</Button>
                        </Layout>
                        <Divider style={{backgroundColor: themeStyle['color-basic-600'], height: 3, marginTop: 5}}></Divider>
                    </Layout>
                );
            })}
            
            <Button onPress={() => addIngredient()}>Lägg till ingrediens</Button>
        </Layout>
    );

    function addIngredient(){
        setNewIngredients([...newIngredients, defaultIngredient]);
    }

    function removeIngredient(index) {
        setNewIngredients([
            ...newIngredients.slice(0, index),
            ...newIngredients.slice(index + 1)
        ])
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

export default EditIngredients;