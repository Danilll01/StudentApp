import React, {useState} from 'react';

// UI library 
import { Layout, Text, Card, Button, useTheme , Icon, Input, Select, SelectItem, Divider } from '@ui-kitten/components';

import PropTypes from 'prop-types';

EditInstructions.propTypes = {
    newIngredientsState: PropTypes.array.isRequired,
}

function EditInstructions({ newInstructionsState }) {
    const themeStyle = useTheme();
    const [newInstructions, setNewInstructions] = newInstructionsState;
    let defaultTextEdit = {editingIndex:-1, text:''}
    // Used to keep track of which instruction is being edited and only update newInstructions when the user is done editing
    let [currEditInstruction, setCurrentEditInstruction] = useState(defaultTextEdit);
    return (
        <Layout style={{padding: 10, paddingTop: 0}}>
            {/*Loops through all ingredients and renders them*/}
            {newInstructions.map((instruction, index) => {
                return (
                    <Layout key={index} style={{flexDirection: 'column', paddingBottom: 11}}>
                        {/* Inputfield for ingredient name */}
                        <Input style={{flex: 1}}
                            value={currEditInstruction.editingIndex === index ? currEditInstruction.text : instruction}
                            onChangeText={text => setCurrentEditInstruction({text,editingIndex:index})}
                            // The input field is in focus
                            onFocus={() => setCurrentEditInstruction({editingIndex: index, text: instruction})}
                            // The input lost focus
                            onBlur={() => {
                                // Update newInstructions with the new value
                                setNewInstructions(prevState => {
                                    let newState = [...prevState];
                                    newState[index] = currEditInstruction.text;
                                    return newState;
                                });
                                setCurrentEditInstruction(defaultTextEdit)
                            }
                            }
                        ></Input>
                    </Layout>
                )
            }
            )}
        </Layout>
    )
}

export default EditInstructions;