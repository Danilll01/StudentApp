import React from 'react';
import axios from 'axios';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';



function TransportScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Transport!</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function FoodScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  let x = 5;

  return (
    // <SafeAreaView style={styles.container}>
    //   <Text numberOfLines={2}>Open up App.js to start working on your app! This is a very very long line of text to be displayed {x}</Text>
    //   <StatusBar style="auto" />
      
    //   <TouchableOpacity onPress={() => console.log("Hejjja")}>
    //     <Image source={{ 
    //       width: 200,
    //       height: 300,
    //       uri: "https://picsum.photos/200/300"}} />
    //   </TouchableOpacity>
    //   <Button title="Hej" onPress={() => Linking.openURL('canvas-courses://chalmers.instructure.com/courses/15148')}> </Button>
    //   <Button title="Hej2" 
    //   onPress={() => Alert.alert("My title", "My message", [
    //     { text: "Yes", onPress: () => console.log("Yes") },
    //     { text: "No" }
    //   ])}></Button>
    //   <Button title="Hej3" 
    //   onPress={() => Alert.prompt("My title", "My message", (text) => console.log(text))}></Button>
    //   <View style={{
    //     backgroundColor: "dodgerblue",
    //     width: '50%',
    //     height: 100,
    //   }} ></View>
    // </SafeAreaView>

    <NavigationContainer>
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
        >
        <Tab.Screen name="Transport" component={TransportScreen} />
        <Tab.Screen name="Mat" component={FoodScreen} />
        <Tab.Screen name="Hem" component={HomeScreen} />
        <Tab.Screen name="Schema" component={HomeScreen} />
        <Tab.Screen name="Att göra" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
