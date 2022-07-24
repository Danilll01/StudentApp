import React, { useState, useEffect, useCallback } from 'react';
import { LogBox, Appearance, Button, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Redux
import Store from './app/redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './app/redux/themeSlice';

// UI library
import { ApplicationProvider, Layout, Text, Card, BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { default as darkTheme } from './app/themes/dark.json';
import { default as lightTheme } from './app/themes/light.json';

import HomeScreen from './app/screens/HomeScreen';
import TransportScreen from './app/screens/TransportScreen';
import FoodScreen from './app/screens/FoodScreen';
import ScheduleScreen from './app/screens/ScheduleScreen';

const { Navigator, Screen } = createBottomTabNavigator();

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

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
        
        <ApplicationProvider {...eva} theme={{...eva[theme.currentTheme], ...theme.currentTheme === 'light' ? lightTheme : darkTheme}}>
            <Layout style={{flex:1}}>
                <StatusBar barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} />
                <NavigationContainer>
                    <Navigator initialRouteName = {"Mat"} 
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

function getIcon(name, props){
    return (
        <Ionicons name={name} size={25} color="tomato" style={{tintColor: 'none'}} />
    )
}