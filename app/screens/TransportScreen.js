import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import { SafeAreaView, View, Text, ScrollView, Button, Linking } from 'react-native';
import styles from './ScreenStyle.js'
import VtStopWidget from '../widgets/VtStopWidget.js';
import { getData, storeData } from '../DataStorage.js';

import uuid from 'react-native-uuid';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import qs from 'qs-stringify';
import VTkey from '../APIKey.js';
import locationHandler from '../LocationHandler.js';

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
        if(res === null || res.expiry < Date.now()) {
          getToken().then(token => {
            storeData('@tokenDataVT', token)
          });
        };
    });
};

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
      date: DateToFormattedString(new Date()), // YYYY-MM-DD
      time: new Date().toTimeString().split(':').slice(0,2).join(':'), // HH:mm
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
      originCoordLat: GPSlat,
      originCoordLong: GPSlon,
      maxNo: 20,
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

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
  
     return (
      promiseInProgress && 
      <Text>Hämtar västtrafik data</Text>
    );  
   }

function TransportScreen() {
    const [stationSearch, setStationSearch] = useState([]);
    const [departureBoards, setDepartureBoards] = useState([]);
    const [nearestStop, setNearestStop] = useState([]);
    const [location, setLocation] = useState([]);
    
    useEffect(() => {
      let mounted = true;

      if(mounted) {
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
              })
            })

          });
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
            <ScrollView>
                <Text style={styles.headerText}>Kollektivtrafik 🚍</Text>
                <View style={styles.widgetArea}>
                    {/* <Button title="Hej" onPress={() => Linking.openURL('vaesttrafik://query?Z=Korsv%C3%A4gen%2C+G%C3%B6teborg&start')}> </Button> */}
                    
                    <LoadingIndicator/>
                    
                    {departureBoards.map(depBoard => {
                      return <VtStopWidget key={depBoard.DepartureBoard.Departure[0].stopid + new Date().now} props={depBoard}></VtStopWidget>
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default TransportScreen;