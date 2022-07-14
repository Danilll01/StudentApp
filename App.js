import React, { useState, useEffect, useCallback } from 'react';
import { Appearance, Button, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Redux
import Store from './app/redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './app/redux/themeSlice';

// UI library
import { ApplicationProvider, Layout, Text, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import HomeScreen from './app/screens/HomeScreen';
import TransportScreen from './app/screens/TransportScreen';
import FoodScreen from './app/screens/FoodScreen';
import ScheduleScreen from './app/screens/ScheduleScreen';


const Tab = createBottomTabNavigator();

var firstLoad = true;

export default function AppWrapper() {


    return (
        <Provider store={Store}>
          <App />
        </Provider>
    )
}

function App(props) {
    const [reloadTheme, setReloadTheme] = useState(false);
    //const [isDarkmode, setIsDarkmode] = useState(false);
    const theme = useSelector((state) => state.theme);

    const dispatch = useDispatch();
    
    const handleColorSchemeChange = useCallback((theme) => {
        dispatch(toggleTheme());
        setReloadTheme(!reloadTheme);
    }, []);
    
    useEffect(() => {
        Appearance.addChangeListener(handleColorSchemeChange);
        return () => {
        Appearance.removeChangeListener(handleColorSchemeChange);
        };
    }, [handleColorSchemeChange]);

    return (
        // <SafeAreaView style={styles.container}>
        //   <TouchableOpacity onPress={() => console.log("Hejjja")}>
        //     <Image source={{ 
        //       width: 200,
        //       height: 300,
        //       uri: "https://picsum.photos/200/300"}} />
        //   </TouchableOpacity>
        //   <Button title="Hej" onPress={() => Linking.openURL('canvas-courses://chalmers.instructure.com/courses/15148')}> </Button>
        // </SafeAreaView>
        <ApplicationProvider {...eva} theme={eva[theme.currentTheme]}>
            <Text style={{paddingTop: 50}}>Hello this is </Text>
            <NavigationContainer>
                <StatusBar barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} />
                <Tab.Navigator screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        switch (route.name){
                        case 'Transport':
                            iconName = 'bus-sharp';
                            break;
                        case 'Mat':
                            iconName = 'fast-food';
                            break;
                        case 'Hem':
                            iconName = 'home';
                            break;
                        default:
                            iconName = 'fast-food';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    })}

                    tabBarOptions={{
                        activeTintColor: 'tomato',
                        inactiveTintColor: 'gray',
                        tabStyle: {
                            backgroundColor: eva[theme.currentTheme]['background-basic-color-1'],
                        },
                    }}

                    initialRouteName = {
                    "Mat"
                    }
                >
                <Tab.Screen name="Transport" component={TransportScreen} />
                <Tab.Screen name="Mat" component={FoodScreen} />
                <Tab.Screen name="Hem" component={HomeScreen} />
                <Tab.Screen name="Schema" component={ScheduleScreen} />
                <Tab.Screen name="Att göra" component={HomeScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </ApplicationProvider>
    );
}
