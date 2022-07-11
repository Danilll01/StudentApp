import React, { useState, useEffect} from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// UI library
//import { ApplicationProvider, Layout, Text, SafeAreaView, View, Card } from '@ui-kitten/components';
//import * as eva from '@eva-design/eva';

import HomeScreen from './app/screens/HomeScreen';
import TransportScreen from './app/screens/TransportScreen';
import FoodScreen from './app/screens/FoodScreen';
import ScheduleScreen from './app/screens/ScheduleScreen';

const Tab = createBottomTabNavigator();

export default function App() {
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
        
    );
}