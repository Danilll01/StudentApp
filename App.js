import { StatusBar } from 'expo-status-bar';
import React from 'react';
import axios from 'axios';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Linking } from 'react-native';

export default function App() {
  console.log("Hello world");
  let x = 5;

  return (
    <SafeAreaView style={styles.container}>
      <Text numberOfLines={2} onPress={handlePress}>Open up App.js to start working on your app! This is a very very long line of text to be displayed {x}</Text>
      <StatusBar style="auto" />
      
      <TouchableOpacity onPress={() => console.log("Hejjja")}>
        <Image source={{ 
          width: 200,
          height: 300,
          uri: "https://picsum.photos/200/300"}} />
      </TouchableOpacity>
      <Button title="Hej" onPress={() => Linking.openURL('canvas-courses://chalmers.instructure.com/courses/15148')}> </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
