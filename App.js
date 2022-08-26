import React, { useState, useEffect, useCallback } from 'react';
import { LogBox, Appearance, Button, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Redux
import Store from './app/redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

import { toggleTheme, getCurrentTheme } from './app/redux/themeSlice';

// UI library
import { ApplicationProvider, IconRegistry , Layout, Text, Card, BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as mapping } from './app/themes/mapping.json';
import { default as darkTheme } from './app/themes/dark.json';
import { default as lightTheme } from './app/themes/light.json';

import HomeScreen from './app/screens/HomeScreen';
import TransportScreen from './app/screens/TransportScreen';
import FoodScreen from './app/screens/Food/Food';
import ScheduleScreen from './app/screens/ScheduleScreen';

const { Navigator, Screen } = createBottomTabNavigator();

// Used to store persisted state in AsyncStorage
let persistor = persistStore(Store)

LogBox.ignoreLogs([
    "EventEmitter.removeListener",
    "Warning: Failed prop type: Invalid props.style key `tintColor` supplied to `Text`.",
    "Non-serializable values were found in the navigation state."
]);

export default function AppWrapper() {
    return (
        <Provider store={Store}>
            <PersistGate loading={null} persistor={persistor}>
                <IconRegistry icons={EvaIconsPack} />
                <App />
            </PersistGate>
        </Provider>
    )
}

function App(props) {
    const theme = useSelector(getCurrentTheme) ?? 'light';

    const dispatch = useDispatch();
    
    // Method to toggle theme
    const handleColorSchemeChange = useCallback((theme) => {
        dispatch(toggleTheme());
    }, []);
    
    // Listen to theme changes on IOS and Android
    useEffect(() => {
        Appearance.addChangeListener(handleColorSchemeChange);
        return () => {
        Appearance.removeChangeListener(handleColorSchemeChange);
        };
    }, [handleColorSchemeChange]);

    return (
        // <Button title="Hej" onPress={() => Linking.openURL('canvas-courses://chalmers.instructure.com/courses/15148')}> </Button>
        
        <ApplicationProvider 
            {...eva} 
            customMapping={mapping}
            theme={{...eva[theme], ...theme === 'light' ? lightTheme : darkTheme}}>
            <Layout style={{flex:1}}>
                <StatusBar barStyle={theme === 'light' ? "dark-content" : "light-content"} />
                <NavigationContainer>
                    <Navigator initialRouteName = {"Transport"} 
                        tabBar={props => <BottomTabBar {...props} />}
                        screenOptions={{headerShown: false}} >
                    <Screen name="Transport" component={TransportScreen} />
                    <Screen name="Mat" component={FoodScreen} />
                    <Screen name="Hem" component={HomeScreen} />
                    <Screen name="Schema" component={ScheduleScreen} />
                    <Screen name="Att göra" component={HomeScreen} />
                    </Navigator>
                    
                </NavigationContainer>
            </Layout>
        </ApplicationProvider>
    );
}


const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}
      height={70}>
      <BottomNavigationTab title='Transport' icon={getIcon("bus-sharp")}/>
      <BottomNavigationTab title='Mat' icon={getIcon("fast-food")}/>
      <BottomNavigationTab title='Hem' icon={getIcon("home")}/>
      <BottomNavigationTab title='Schema' icon={getIcon("bus-sharp")}/>
      <BottomNavigationTab title='Att göra' icon={getIcon("bus-sharp")}/>
    </BottomNavigation>
);

// Returns the correct icon for the tab
function getIcon(name){
    return (
        <Ionicons name={name} size={25} color="tomato" style={{tintColor: 'none'}} />
    )
}