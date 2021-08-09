import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import { SafeAreaView, View, Text, ScrollView, Button, Linking } from 'react-native';
import styles from './ScreenStyle.js'
import VtStopWidget from '../widgets/VtStopWidget.js';
import { getData, storeData } from '../DataStorage.js';

import uuid from 'react-native-uuid';
import qs from 'qs-stringify';
import xml2j from 'react-native-xml2js';

const VTkey = "KEY";

const getToken = async () => {
  const id = uuid.v4();
  const res = await axios
    .post(
        "https://api.vasttrafik.se/token",
      qs({
        grant_type: "client_credentials",
        scope: id
      }),
      {
        headers: {
          Authorization: `Basic ${VTkey}`,
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

function GenerateAndStoreToken() {
    getData('@tokenDataVT').then((res) => {
        //console.log(res);
        if(res === null || res.expiry < Date.now()) {
          getToken().then(token => {console.log("needed"); storeData('@tokenDataVT', token)});
        } else {
            console.log("Not needed")
        };
    });
    console.log("1")
} 

const GetVTDataTest = async () => {
    let VTaccessToken;
    await getData('@tokenDataVT').then((token) => {
        VTaccessToken = token.access_token;
    })
    const res = await axios
    .get(
        "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?" +
        qs({
        input: "Ytterby",
        format: "json",
      }),
      {
        headers: {
            "Authorization": `Bearer ${VTaccessToken}`,
        } 
      }
    ).then((res) => {
      return res
    }).catch(err => {
      console.log(err.message);
    })
    return {
      res
    }
}

const GetDepatureBoard = async (stopId) => {
  console.log("Calling Dep API")
  let VTaccessToken;
  await getData('@tokenDataVT').then((token) => {
      VTaccessToken = token.access_token;
  })
  const res = await axios
  .get(
      "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?" +
      qs({
      id: stopId, // 9021014014715000
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      time: new Date().toISOString().split('T')[1].slice(0, 5), // HH:mm
      format: "json",
    }),
    {
      headers: {
        "Authorization": `Bearer ${VTaccessToken}`,
      } 
    }
  ).then((res) => {
    return res
  })
  return {res};
}

const GetNearestStop = async (GPSlat, GPSlon) => {
  let VTaccessToken;
  await getData('@tokenDataVT').then((token) => {
      VTaccessToken = token.access_token;
  })
  const res = await axios
  .get(
      "https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?" +
      qs({
      input: "Ytterby",
      format: "json",
    }),
    {
      headers: {
          "Authorization": `Bearer ${VTaccessToken}`,
      } 
    }
  ).then((res) => {
    return res
  }).catch(err => {
    console.log(err.message);
  })
  return {
    res
  }
}

const TestTest = async () => {
    let data;
    await GetVTDataTest().then((res) => {
        console.log("halleluja")
        data = res.res.data.LocationList.StopLocation;
    }).catch((res) => {
        console.log(res)
    })
    
    return data;
}

function TransportScreen() {
    const [stationSearch, setStationSearch] = useState([]);
    const [departureBoard, setDepartureBoard] = useState([]);
    const [nearestStop, setNearestStop] = useState([]);
    
    useEffect(() => {
      let mounted = true;

      if(mounted) {
        console.log("rerender time");
        GenerateAndStoreToken();
        TestTest().then(res => {
          setStationSearch(res);
        }).catch(err => {
          console.log(err.message);
        });

        GetDepatureBoard(9021014014710000).then(res => {
          setDepartureBoard(res.res.data);
        });

      }
      mounted = false;

      return () => {
        mounted = false;
      }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.headerText}>Kollektivtrafik</Text>
                <View style={styles.widgetArea}>
                    <Button title="Hej" onPress={() => Linking.openURL('vaesttrafik://query?Z=Korsv%C3%A4gen%2C+G%C3%B6teborg&start')}> </Button>
                    
                    {stationSearch.map(item => {
                        return <Text key={item.name}>{item.name}</Text>;
                    })}
                    
                    <VtStopWidget props={departureBoard}></VtStopWidget>
                    {/* <VtStopWidget></VtStopWidget>
                    <VtStopWidget></VtStopWidget> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default TransportScreen;