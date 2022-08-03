import React, {useState} from 'react';
import { Platform, SafeAreaView , ScrollView, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import styles from './ScreenStyle.js';
import { createStackNavigator } from '@react-navigation/stack';

import Tag from '../components/Tag';
import RecipeItem from '../components/RecipeItem';
import FoodDetail from './FoodDetail';
import Tags from '../constants/Tags';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button, useTheme } from '@ui-kitten/components';


const Stack = createStackNavigator();

const recipeData = [
    {
        id: 0,
        title: "Lättlagad lax i ugn",
        cookTime: 40,
        image: "image",
        tags: [Tags.FISH], //"meat", "chicken"
        servings: 2,
        ingredients: [
            {
                amount: 400,
                unit: "g",
                name: "Laxfile"
            },
            {
                amount: 1/2,
                unit: "st",
                name: "Citron"
            },
            {
                amount: 2,
                unit: "dl",
                name: "Creme fraiche"
            },
            {
                amount: 300,
                unit: "g",
                name: "Potatis"
            },
            {
                amount: 1,
                unit: "st",
                name: "Dillvippa"
            },
            {
                amount: null,
                unit: "",
                name: "Salt och peppar"
            }
        ],
        instructions: [
            "Sätt ugnen på 200 grader",
            "Blanda creme fraiche, citron, salt och peppar",
            "Bred på blandningen på laxen",
            "Lägg på dillvippan på laxen",
            "Sätt in laxen i ca 25 minuter i ugnen",
            "Skala och koka potatisen",
        ],
    },
    {
        id: 1,
        title: "Lättlagad torsk i ugn",
        cookTime: 30,
        image: "image",
        tags: [Tags.FISH], //"meat", "chicken"
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
        instructions: [
            "Sätt ugnen på 200 grader",
            "Bred på creme fraiche på torsken",
            "Pressa ut citronen över torsken",
            "Lägg på dillvippan på torsken",
            "Sätt in torsken i ca 25 minuter i ugnen",
            "Skala och koka potatisen",
        ],
    }
]

function FoodScreen(props) {
    
    return (
        <Stack.Navigator>
            <Stack.Screen name="Food" component={MainScreen} initialParams={props} options={{ headerShown: false }} />
            <Stack.Screen name="FoodDetail" component={FoodDetail} initialParams={props} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

function MainScreen({navigation}) {
    const theme = useTheme();
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState([{type: Tags.MEAT, active: false}, {type: Tags.FISH, active: false}, {type: Tags.CHICKEN, active: false}]);

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
        
        <SafeAreaView style={[styles.container, {backgroundColor: theme['background-basic-color-1']}]}>
            <Text style={styles.headerText} category='h1'>Vad vill du äta idag?</Text>
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
                data={recipeData}
                renderItem={recipe => (
                    <RecipeItem key={recipe.id} recipe={recipe} navigation={navigation} />
                )}
                keyExtractor={recipe => recipe.id} />
        </SafeAreaView>
    );
}



export default FoodScreen;