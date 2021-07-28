import React from 'react';
import axios from 'axios';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import qs from 'qs-stringify';

import HomeScreen from './app/screens/HomeScreen';

const tokenEndPoint = "https://api.vasttrafik.se/token";
const getToken = async key => {
  const id = uuid.v4();
  const res = await axios
    .post(
      tokenEndPoint,
      qs({
        grant_type: "client_credentials",
        scope: id
      }),
      {
        headers: {
          Authorization: `Basic ${key}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/x-www-form-urlencoded;"
        }
      }
    );
  return {
    id,
    expiry: new Date().getTime() + res.data.expires_in * 1000,
    ...res.data
  };
};


function BasicWidget() {
  return (
    <View style={styles.basicWidget}>
      <Text>Hello gajs</Text>
    </View>
  )
}

function TransportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Kollektivtrafik</Text>
      <View component={BasicWidget}></View>
    </SafeAreaView>
  );
}

function FoodScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Vad vill du äta idag?</Text>
    </SafeAreaView>
  );
}

function HomeScreen2() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Home!</Text>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

// JSON.stringify({ stations: [10, undefined, function(){}, Symbol('')] })
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@VT_key', jsonValue)
  } catch (e) {
    // saving error
    console.log(e.message)
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@VT_key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
    console.log(e.message)
  }
}

export default function App() {
  let x = 5;
  const VTkey = "KEY";
  //console.log(getToken(VTkey))
  //storeData(getToken(VTkey))
  //console.log(getData())

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

const sideMargin = '5%';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerText: {
    paddingTop: 20,
    paddingLeft: sideMargin,
    paddingBottom: 20,
    fontSize: 34,
    fontWeight: 'bold',
  },
  basicWidget: {
    backgroundColor: 'red',
    marginLeft: sideMargin,
    width: '90%',
    height: 300,
    borderRadius: 16,
  },
});
