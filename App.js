import React from 'react';
import axios from 'axios';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
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
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>

    // <SafeAreaView style={{
    //   backgroundColor: "limegreen",
    //   flex: 1,
    //   flexDirection: "column-reverse",
    // }}>
    //   <View style={{
    //   backgroundColor: "red",
    //   width: '100%',
    //   height: 50,
    //   flexDirection: "row",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   alignContent: "center",
    //   flexWrap: "wrap",
    // }}>
    //   <Button title="Hej3" style={{
    //     backgroundColor: "gold",
    //     width: 100,
    //     height: 100,
    //   }}></Button>
    //   <Button title="Hej3" style={{
    //     backgroundColor: "tomato",
    //     width: 100,
    //     height: 100,
    //   }}></Button>
    //   <Button title="Hej3" style={{
    //     backgroundColor: "green",
    //     width: 100,
    //     height: 100,
    //   }}></Button>
    // </View>
    // </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
