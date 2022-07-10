import React, {useState} from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import styles from './ScreenStyle.js';

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';

function FoodScreen(props) {
    const [theme, setTheme] = useState(eva.light);
    const [search, setSearch] = useState("");

    const updateSearch = (search) => {
        setSearch(search);
    };

    return (
        <ApplicationProvider {...eva} theme={theme}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.headerText} category='h1'>Vad vill du äta idag?</Text>
                <SearchBar 
                    platform={Platform.OS}
                    placeholder="Type Here..."
                    onChangeText={updateSearch}
                    value={search}
                    onCancel={() => setSearch("")}
                    />
            </SafeAreaView>
        </ApplicationProvider>
    );
}



export default FoodScreen;