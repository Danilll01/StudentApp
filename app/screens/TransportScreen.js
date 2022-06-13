import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import { SafeAreaView, View, Text, ScrollView, RefreshControl, Button, Linking } from 'react-native';
import styles from './ScreenStyle.js'
import VtStopWidget from '../widgets/VtStopWidget.js';
import { getData, storeData } from '../DataStorage.js';

import uuid from 'react-native-uuid';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import qs from 'qs-stringify';
import VTkey from '../APIKey.js';
import locationHandler from '../LocationHandler.js';



function TransportScreen() {
    const [stationSearch, setStationSearch] = useState([]);
    const [departureBoards, setDepartureBoards] = useState([]);
    const [nearestStop, setNearestStop] = useState([]);
    const [location, setLocation] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
      let mounted = true;

      if(mounted) {
        setRefreshing(true);
        GenerateAndStoreToken();

        trackPromise( locationHandler().then((res) => {
          setLocation(res);
          GetNearestStop(res.coords.latitude, res.coords.longitude).then(res => {
            setDepartureBoards([]);

            let stations = res.res.data.LocationList.StopLocation;
            let uniqueStations = getUniqueStations(stations);
            uniqueStations.map(station => {
              GetDepatureBoard(station).then(depBoard => {
                setDepartureBoards(depBoards => [...depBoards, depBoard.res.data]);
                setRefreshing(false);
              })
            })

          })
          .catch();
        }));
        console.log("rerender time");
      }

      mounted = false;

      return () => {
        mounted = false;
      }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  //onRefresh={}
                />
              }>
                <Text style={styles.headerText}>Kollektivtrafik 🚍</Text>
                <View style={styles.widgetArea}>
                    {/* <Button title="Hej" onPress={() => Linking.openURL('vaesttrafik://query?Z=Korsv%C3%A4gen%2C+G%C3%B6teborg&start')}> </Button> */}
                    
                    <LoadingIndicator/>
                    
                    {departureBoards.map((depBoard, i) => {
                      return <VtStopWidget key={i} props={depBoard}></VtStopWidget>
                    // depBoard.DepartureBoard.Departure[0].stopid + 
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


// Helper functions 
function DateToFormattedString(d) {         
  var yyyy = d.getFullYear().toString();                                    
  var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based         
  var dd  = d.getDate().toString();             

  return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};  

function getUniqueStations(stations) {
  let uniqueStations = [];
  stations.map(station => {
    let stationID = parseInt(station.id);
    // Checks if station starts with 9021. If 21 it's a real station and 9022 is a track of a station.
    if (stationID - 9021000000000000 < 1000000000000) { 
      if (uniqueStations.indexOf(stationID) == -1) {
        uniqueStations.push(stationID);
      }
    }
    
  });
  return uniqueStations;
}
// Helper funtions END

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
          "Authorization": `Basic ${VTkey}`,
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
      // Get new token if expired 
      if(res === null || res.expiry <= Date.now()) {
        getToken().then(token => {
          storeData('@tokenDataVT', token)
        });
      };
    });
};

const GetDepatureBoard = async (stopId) => {
  console.log("Calling Dep API")

  let APIEndpoint = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?";

  let payload = qs({
    id: stopId, // 9021014014715000
    date: DateToFormattedString(new Date()), // YYYY-MM-DD
    time: new Date().toTimeString().split(':').slice(0,2).join(':'), // HH:mm
    timeSpan: 120,
    format: "json",
  });
  let res = await CallVTAPIWithPayload(APIEndpoint, payload);
  return {res};
}

const GetNearestStop = async (GPSlat, GPSlon) => {
  let APIEndpoint = "https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?";

  let payload = qs({
    originCoordLat: GPSlat,
    originCoordLong: GPSlon,
    maxNo: 20,
    format: "json",
  });

  let res = await CallVTAPIWithPayload(APIEndpoint, payload);

  return {res};
}

// Calls västtrafiks api with provided endpoint and payload
const CallVTAPIWithPayload = async (APIEndpoint, payload) => {
  let VTaccessToken;

  // Retreive active token
  await getData('@tokenDataVT').then((token) => {
      VTaccessToken = token.access_token;
  })

  // Make request to api endpoint
  const res = await axios
  .get(
      APIEndpoint + payload,
    {
      // Use access token
      headers: {
        "Authorization": `Bearer ${VTaccessToken}`,
      } 
    }
  ).catch(err => {
    console.log(err.message);
  })

  return res;
}

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();

    return (
    promiseInProgress && 
    <Text>Hämtar västtrafik data</Text>
  );  
}



export default TransportScreen;