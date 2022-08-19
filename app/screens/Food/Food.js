import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView , ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import screenStyles from '../ScreenStyle.js';
import { createStackNavigator } from '@react-navigation/stack';

import { useDispatch, useSelector } from 'react-redux';
import { getRecipes, addRecipe } from '../../redux/recipesSlice.js';

import Tag from '../../components/Tag';
import RecipeItem from '../../components/RecipeItem';
import FoodDetail from './Detail';
import Tags from '../../constants/Tags';
import Units from '../../constants/Units.js';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme, Icon } from '@ui-kitten/components';

import { v4 as uuidv4 } from 'uuid';

const Stack = createStackNavigator();

function Food(props) {
    
    return (
        <Stack.Navigator>
            <Stack.Screen name="Food" component={MainScreen} initialParams={props} options={{ headerShown: false }} />
            <Stack.Screen name="FoodDetail" component={FoodDetail} initialParams={props} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

function MainScreen({route, navigation}) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState(useSelector(getRecipes));

    const [tags, setTags] = useState([{type: Tags.MEAT, active: false}, {type: Tags.FISH, active: false}, {type: Tags.CHICKEN, active: false}]);

    const recipeData = useSelector(getRecipes);

    // Filter recipes by search query when search query changes or when recipes change
    useEffect(() => {
        let updatedSearchResults = recipeData.filter(recipe => recipe.title.toLowerCase().includes(search.toLowerCase()));

        // If a tag is active, also filter by that tag
        if (tags.filter(tag => tag.active).length > 0) {
            updatedSearchResults = updatedSearchResults.filter(recipe => 
                // Check if recipe has any of the active tags
                recipe.tags.some(tag => 
                    // If the tag is active, check if the recipe has the tag
                    tags.filter(tag => tag.active).map(tag => tag.type).includes(tag)
                )
            );
        }
        
        setSearchResults(updatedSearchResults);
    }, [recipeData, search, tags])

    const updateSearch = (search) => {
        setSearch(search);
    };

    const setActiveTag = (type) => {
        let updatedState = (tags.map(tag => (
                tag.type === type
                ? { ...tag, active: !tag.active }
                : { ...tag, active: false }
        )));

        setTags(updatedState);
    }

    return (
        <SafeAreaView style={[screenStyles.container, {backgroundColor: theme['background-basic-color-1'], flex: 1}]}>
            
            <Text style={screenStyles.headerText} category='h1'>Vad vill du äta idag?</Text>

            <SearchBar 
                platform={Platform.OS}
                placeholder="Sök efter ett recept"
                onChangeText={updateSearch}
                value={search}
                onCancel={() => setSearch("")}
                lightTheme={true}
                containerStyle={{ backgroundColor: theme['background-basic-color-1']}}
            />
            <Layout style={{flexDirection: 'row', paddingLeft: 10}}>
                {tags.map(tag => {
                        return (
                            <Tag key={tag.type} type={tag.type} active={tag.active} onPress={() => setActiveTag(tag.type)} />
                        )
                    }
                )}
            </Layout>
            <FlatList style={{padding: 20, backgroundColor: theme['background-basic-color-1']}}
                data={searchResults}
                renderItem={recipe => (
                    <RecipeItem key={recipe.id} recipe={recipe} route={route} navigation={navigation} />
                )}
                keyExtractor={recipe => recipe.id} />

            <TouchableOpacity 
                style={[style.addRecipeButton ,{backgroundColor: theme['border-alternative-color-3']}]}
                onPress={() => {
                    let newId = uuidv4();
                    dispatch(addRecipe({
                        id: newId,
                        title: "Nytt recept",
                        cookTime: 30,
                        servings: 2,
                        ingredients: [],
                        instructions: [],
                        tags: []
                    }));
                    navigation.navigate('Mat', {screen: 'FoodDetail', recipeId: newId, isEditing: true});
                }}>
                <Icon name='plus-circle' fill={theme['color-success-500']} style={style.addRecipeButtonIcon} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    addRecipeButton: {
        position: 'absolute',
        bottom: 35,
        right: 15,
        borderRadius: 99
    },
    addRecipeButtonIcon: {
        width: 72,
        height: 72,
        margin: -6
    },
});

export default Food;