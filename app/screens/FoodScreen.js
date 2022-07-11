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
    const [tags, setTags] = useState([{type: 'meat', active: false}, {type: 'fish', active: false}, {type: 'chicken', active: false}]);

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
                            <Tag key={tag.type} type={tag.type} active={tag.active} onPress={() => setActiveTag(tag.type)} />
                        )
                    )}
                </Layout>
                <ScrollView style={{padding: 20, }}>
                    {recipeData.map(recipe => (
                            <RecipeItem key={recipe.title} recipe={recipe} />
                        )
                    )}
                    
                    
                </ScrollView>
            </SafeAreaView>
        </ApplicationProvider>
    );
}



export default FoodScreen;