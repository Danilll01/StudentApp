import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import styles from './ScreenStyle.js';

import Tag from '../components/Tag';
import RecipeItem from '../components/RecipeItem';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';


const recipeData = [
    {
        title: "Lättlagad lax i ugn",
        cookTime: 40,
        image: "image",
        tags: ["fish"], //"meat", "chicken"
        servings: 2,
        ingredients: [
            {
                amount: 400,
                unit: "g",
                name: "Laxfile"
            },
            {
                amount: 1,
                unit: "st",
                name: "Citron"
            }
        ],
    }
]

function FoodScreen(props) {
    const [theme, setTheme] = useState(eva.light);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState([{id: 0, active: false}, {id: 1, active: false}, {id: 2, active: false}]);

    const updateSearch = (search) => {
        setSearch(search);
    };

    const setActiveTag = (id) => {
        let updatedState = (tags.map(tag => (
                tag.id === id
                ? { ...tag, active: !tag.active }
                : { ...tag, active: false }
        )));

        setTags(updatedState);
    }

    return (
        <ApplicationProvider {...eva} theme={theme}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.headerText} category='h1'>Vad vill du äta idag?</Text>
                <SearchBar 
                    platform={Platform.OS}
                    placeholder="Sök efter ett recept"
                    onChangeText={updateSearch}
                    value={search}
                    onCancel={() => setSearch("")}
                />
                <Layout style={{flexDirection: 'row', paddingLeft: 10}}>
                    {tags.map(tag => (
                            <Tag key={tag.id} id={tag.id} active={tag.active} onPress={() => setActiveTag(tag.id)} />
                        )
                    )}
                </Layout>
                <ScrollView style={{padding: 20, }}>
                    {recipeData.map(recipe => (
                            <RecipeItem key={recipe.title} recipe={recipe} />
                        )
                    )}
                    <RecipeItem/>
                    
                </ScrollView>
            </SafeAreaView>
        </ApplicationProvider>
    );
}



export default FoodScreen;